import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../axios/axios";
import { CustomHeader } from "../../components/Table/header";
import { CustomTable } from "../../components/Table/Table";
import { createMockArray } from "../../utils/arrayOperations";
import { TableSearchByDebounce } from "../../utils/debounce";
import { notifySuccess } from "../../utils/speccificToasts";
import { SkeletonWrapper } from "../SkeletonWrapper/SkeletonWrapper";

const uzFields = ['id', "Электронная Почта", "Статус", "Последний Сеанс", 'action']
const fields = ['id', 'email', "banned", "lastLogin", 'action']
const shortHeaderName = ['#',  'Почта', "Статус", "Заходил", 'Действия']

const initialFilterFields = fields.reduce((prevResult, field) => {
  return { ...prevResult, [field]: '' }
}, {})

initialFilterFields.extraOptions = {
  user_type_id: {type: 'select', options: []}
}

const attributesArray = ['', '', '', '', '']

const tableChangableFields = {
  user_type_id: {type: 'select', options: []}
}

const getLink = "users"

const UserList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [filterOptions, setFilterOptions] = useState(initialFilterFields)
  const [perPage, setPerPage] = useState(20)
  const [page, setPage] = useState(1)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [arrays, setArrays] = useState({ warehouse_type_id: "" })
  const [editProperties, setEditProperties] = useState(tableChangableFields)

  const navigate = useNavigate()

  useEffect(() => {
    const promises = [
      // setFilterOptionsArray('admin/user_types', 'user_type_id', 'name')
    ]
    Promise.allSettled(promises).
      then((results) => {
        let arrays = results.reduce((prevResult, data) => {
          let object = Object.entries(data.value)
          return {...prevResult, [object[0][0]]: object[0][1]}
        }, {})
        getData(page, perPage, filterOptions, arrays)
      });
  }, []);

  const setFilterOptionsArray = async (link, name, field, extraparams={}) => {
    return await httpClient.get(link, {params: {...extraparams}})
      .then(res => {
        let array = res.data.data ?? []
        array = ['All'].concat(res.data.data.map((item) => item[field]))
        let mainArray = res.data.data ? res.data.data.map(data => ({ ...data, label: field ? data[field] : data.name })) : []
        setEditProperties((editProperties) => {
          return {
            ...editProperties,
            [name]: { ...editProperties[name], options: mainArray }
          }
        })
        setArrays((arrays) => ({ ...arrays, [name]: res.data.data }))
        setFilterOptions((filterOptions) => ({
          ...filterOptions,
          extraOptions: {
            ...filterOptions.extraOptions,
            [name]: { type: 'select', options: mainArray }
          }
        }))
        return {[name]: res.data.data}
      })
      .catch(err => console.log(err))
  }

  const getBadge = status => {
    switch (+status) {
      case true: return 'danger'
      case false: return 'success'
      default: return 'secondary'
    }
  }

  const getData = (currentPage = page, page_size = perPage, extraParams = filterOptions, currentArrays=arrays) => {

    const { extraOptions: _, ...params } = extraParams

    setLoading(true)
    httpClient
      .get(getLink, { params: { page_size, page: currentPage, ...params }})
      .then((res) => {
        let responseArray = res.data ?? [];

        // количество страниц должно быть изменено 
        // 
        let totalPages = Math.ceil(res.data.count / page_size)
        setTotalQuantity(totalPages)
        setData([
          ...createMockArray({}, (currentPage - 1) * page_size),
          ...responseArray.map(item => (transform(item, currentArrays))),
          ...createMockArray({}, (totalPages - currentPage) * page_size)
        ]
        );
        setPage(currentPage)
        setPerPage(page_size)
        setLoading(false)
      })
      .catch((err) => { setLoading(false); console.log(err) });
  };

  const transform = (item, currentArrays=arrays) => {
    return {
      ...item, banned: !!item.banned ? "Заблокирован" : "Активный",
      banned_classes: getBadge(item.banned),
      lastLogin: item.lastLogin ? moment(item.lastLogin).format('MM/DD/yyyy hh:mm'): ''
    }
  }

  const splitActionProps = {
    editable: true,
    edit: [{ icon: 'pi-book', editFunction: (id) => editFunction(id) }],
    deletable: true,
    delete: [{ icon: 'pi-book', deleteFunction: (id) => deleteFunction(id) }],
    // deletable: false,
    // deleteFunction: (id) => deleteFunction(id)
  }

  const changeFilteredData = (e) => {
    let idx = filterOptions.filterChilds.findIndex(filterProp => filterProp.searchParam === e.target.name)
    setFilterOptions((filterOptions) => ({
      ...filterOptions,
      filterChilds: [
        ...filterOptions.filterChilds.slice(0, idx),
        { ...filterOptions.filterChilds[idx], value: e.target.value },
        ...filterOptions.filterChilds.slice(idx + 1)
      ]
    }))
  }

  const deleteFunction = (id) => {
    console.log(id)
    httpClient.delete(`admin/materials/${id}/`)
      .then(res => {
        let idx = data.findIndex(el => (el.id === id))
        setData([
          ...data.slice(0, idx),
          ...data.slice(idx + 1)
        ])
        notifySuccess("Успешно удалено")
      })
      .catch(err => console.log(err))
  }

  const editFunction = (id) => {
    navigate(`/users/${id}`);
  }

  const createFunction = () => {
    navigate('/users/add')
  }

  // filter response
  const callbackFunction = (response) => {
    console.log(response)
  }  
const handleFilterChange = (e, fieldName = "") => {
    // console.log('filter changed')
    setFilterOptions((filterOptions) => {
      let newParams = {
        ...filterOptions,
        [fieldName ? fieldName : e.target.name]: e.target.value !== undefined ? e.target.value : e.value
      }
      TableSearchByDebounce(getLink, page, perPage, newParams, callbackFunction)
      return newParams
    })
  }

  const onPageChange = (e) => {
    getData(e.page + 1, e.rows)
  }

  const handleEditSelect = (options, e) => {
    const changingLink = `${getLink}/${options.rowData?.id}`
    PatchData(changingLink, options.field, e.value.id, +options.rowIndex)
  }

  const OnEditComplete = (e) => {
    const changingLink = `${getLink}/${e.rowData?.id}`
    if (e.rowData[e.field] !== e.newRowData[e.field]) {
      PatchData(changingLink, e.field, e.newValue, e.rowIndex)
    }
  }

  const PatchData = (changingLink, field, value, idx) => {
    field = field.includes('.') ?  field.split(".")[0]+'_id' : field
    httpClient.put(changingLink, { [field]: value })
      .then(res => {
        let currenObject = res.data.data
        setData((data) => ([
          ...data.slice(0, +idx),
          transform(currenObject),
          ...data.slice(+idx + 1)
        ]))
        notifySuccess('Успешно изменено')
      })
      .catch(err => console.log('err', err))
  }

  return (
    <>
      {!loading ?
        <CustomTable 
        // representive="code_1c"
        editProperties={editProperties} handleEditSelect={handleEditSelect} OnEditComplete={OnEditComplete}
        onPageChange={onPageChange} perPage={perPage} paginate={true} itemsQuantity={totalQuantity}
        splitActionProps={splitActionProps} filterOptions={filterOptions} handleFilterChange={handleFilterChange}
        shortHeaderName={shortHeaderName}
          header={<CustomHeader creatable={true} createFunction={createFunction} title="Пользователей" >
            {/* <TableSecondHeader changeFilteredData={changeFilteredData} getFilteredData={getData} filterOptions={filterOptions}/> */}
          </CustomHeader>} attributesArray={attributesArray} fields={fields} uzFields={uzFields} data={data}
          deleteFunction={deleteFunction} tableChangableFields={tableChangableFields} editable={true} editFunction={editFunction} />
        : <div><CustomHeader title="Пользователей" /> <SkeletonWrapper RowsCount="25" ColumnsCount="4" marginSkeleton="1" /></div>}
    </>
  );
};

export default UserList;