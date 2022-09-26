import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { recLookup } from "../../utils/getDeepedValueOfObject";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { useState } from "react";

const FilterFooter = () => {
  return (
    <div></div>
  )
}

const RepresentativeFilterTemplate = ({ name, fieldName, filterOptions, handleFilterChange, rowData }) => {
  // console.log('rowData filter', filterOptions)
  return (
    <>
      {!filterOptions.extraOptions || !filterOptions.extraOptions[fieldName] ? <span className="p-float-label mt-5">
        <InputText id={fieldName} name={fieldName} type="text" value={filterOptions[fieldName]} onChange={(e) => handleFilterChange(e)} />
        <label htmlFor={fieldName}>{name}</label>
      </span> : !filterOptions.extraOptions ? null :
        filterOptions.extraOptions[fieldName].type === 'select' ?
          <span className="mt-5">
            <label htmlFor={fieldName}>{name}</label>
            <Dropdown id={fieldName} value={fieldName} options={filterOptions.extraOptions[fieldName].options}
              onChange={(e) => handleFilterChange(e, fieldName)} optionLabel="label" placeholder={name} className="p-column-filter" />
          </span> : null
      }
    </>
  );
};

export const CustomTable = ({
  first = "",
  onPageChange = "",
  perPage,
  paginate = false,
  itemsQuantity = 0,
  shortHeaderName = [],
  header = false,
  fields = [],
  attributesArray = [],
  uzFields = [],
  data = [],
  deleteFunction = "",
  editFunction = "",
  deletable = true,
  editable = false,
  splitActionProps = "",
  handleFilterChange = "",
  filterOptions = {},
  OnEditComplete = "",
  editProperties = {},
  handleEditSelect = "",
  representive = "",
  representiveData = "",
  representiveDataObjects = "",
  multiLinesProperties = ""
}) => {
  const [editorType, setEditorType] = useState('cell')
  const TableAction = ({
    splitActionProps,
    rowData,
    deleteFunction,
    editFunction,
  }) => {
    return (
      // <span>{true ?
      <span>
        {!splitActionProps ? (
          <>
            {editable ? (
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success"
                aria-label="Search"
                onClick={() => editFunction(rowData.id)}
              />
            ) : null}
            {deletable ? (
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                aria-label="Search"
                onClick={() => deleteFunction(rowData.id)}
              />
            ) : null}
          </>
        ) : (
          <div className="table_splitactions_wrapper">
            {splitActionProps.editable
              ? splitActionProps.edit.map((edit) => (
                <div className="p-inputgroup split_buttons_action columns-6">
                  <span className="p-inputgroup-addon">
                    <i className={`pi ${edit.icon}`}></i>
                  </span>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success"
                    aria-label="Search"
                    onClick={() => edit.editFunction(rowData.id)}
                  />
                </div>
              ))
              : null}
            {splitActionProps.deletable ? (
              splitActionProps.delete.map((deleteProps) => (
                <div className="p-inputgroup split_buttons_action columns-6">
                  <span className="p-inputgroup-addon">
                    <i className={`pi ${deleteProps.icon}`}></i>
                  </span>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    aria-label="Search"
                    onClick={() => deleteProps.deleteFunction(rowData.id)}
                  />
                </div>
              ))
            ) : splitActionProps.deleteFunction ? (
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                aria-label="Search"
                onClick={() => splitActionProps.deleteFunction(rowData.id)}
              />
            ) : null}
          </div>
        )}
      </span>
    );
  };

  const DefaultBody = (rowData) => {
    let isObject = typeof rowData.field === 'object'
    let classes = rowData.rowData[`${rowData.field}_classes`];
    let value = !isObject ? recLookup(rowData.rowData, rowData.field) : rowData.field;
    return (
      <>
        {!isObject ?
          <span>
            {!classes ? (
              <div>{value}</div>
            ) : (
              <Tag value={value} severity={classes} rounded></Tag>
            )}
          </span>
          : <div className="flex direction-column box_shadow"> {rowData.rowData[rowData.field.array].map(trElement => {
              // let classesOnArrayElement = rowData.rowData[`${rowData.field}_classes`];
              // console.log(item,'field', rowData.field)
              // let valueTr = recLookup(trElement, rowData.field.properties.dataRenderOn[0].th)
              return (
                <div className="flex row justify-content-between">
                  {rowData.field.properties.dataRenderOn.map(tdElement => {
                    let valueTd = recLookup(trElement, tdElement.th)
                    return (
                      <div className="m-auto col-6">
                        {valueTd}
                      </div>
                    )
                  })
                  }
                </div>
              )
            })}
          </div>
        }
      </>
    );
  };

  const TheadTemplate = ({ shortHeaderName = "", field }) => {
    return (
      <Button
        label={shortHeaderName ? shortHeaderName : field}
        className="thead_button"
        tooltip={field}
        tooltipOptions={{ className: "blue-tooltip", position: "top" }}
      />
    );
  };



  const TextEditor = ({ options, editProperties = {}, handleEditSelect = "" }) => {
    // console.log(editProperties[options.field], 'editProperties[options.field]')
    let getSelectValue = (currentValue) => {
      return editProperties[options.field]?.options.filter(item => item.label === currentValue)[0]
    }
    let isSelect = options.field.includes('.') ? options.field.split(".")[0] : ''
    console.log('editProperties', options.field)
    // console.log(isSelect, 'editProperties', options)
    if (isSelect && editProperties[`${isSelect}_id`]?.type === 'select' && options[`${isSelect}_id`] !== 'id') {
      return (<span className="p-float-label">
        <Dropdown value={getSelectValue(options.value)} options={editProperties[`${isSelect}_id`]?.options ?? []}
          onChange={(e) => handleEditSelect(options, e)} optionLabel="label" className="p-column-filter" />
      </span>)
    }
    else if (!editProperties[options.field] && options.field !== 'id') {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value, 'test')} />;
    }
    else if (editProperties[options.field]?.type === 'date' && options.field !== 'id') {
      return (<span className="p-float-label">
        <input type="date" value={options.value} onChange={(e) => { options.editorCallback(moment(e.target.value).format('yyyy-MM-DD'), 'test') }} />
      </span>)
    }
    else if (editProperties[options.field]?.type === 'time' && options.field !== 'id') {
      return (<span className="p-float-label">
        <input type="time" value={options.value} onChange={(e) => { options.editorCallback(e.target.value, 'test') }} pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" step="2" />
      </span>)
    }
    else {
      return <span><div>{typeof options.rowData[options.field] !== 'object' ? options.rowData[options.field] : ''}</div></span>
    }
  }

  const onCellEditComplete = (e, type) => {
    console.log('cell edit', e, type)
    if (e && e.newValue && typeof e.newValue.getDate !== 'function') {
      OnEditComplete(e, type)
    }
  }

  const HeaderGroupTemplate = ({ data, representive, representiveData, representiveDataObjects }) => {
    let entries = Object.entries(representiveDataObjects)
    // console.log(
    //   recLookup(data[representiveData], entries[0][1].join('.')),
    //   data[representiveData],
    //   entries[1],
    //   'entries')
    return (
      <React.Fragment>
        {
          !representiveDataObjects ?
            <tr>
              <td className="image-text">{`id: ${data[representive]}`}</td>
            </tr>
            :
            <tr role="row" class="w-100 group_template_header_tr">
              {
                entries.map((headerObjects, index) => {
                  // console.log(headerObjects, 'headerObjects')
                  // return null
                  return <td className="image-text">{`${headerObjects[0]}:`} <b>{`${recLookup(data[representiveData], headerObjects[1].join('.'))}`}; </b></td>
                })
              }
              {/* <td className="image-text">{`id: ${data[representiveData].id}`}</td> */}
            </tr>
        }
      </React.Fragment>
    );
  }

  const FooterGroupTemplate = ({ data, representive, representiveData, representiveDataObjects }) => {
    return (
      <React.Fragment>
        <tr className="w-100 representive_footer_tr"></tr>
      </React.Fragment>
    );
  }

  const checkOnCanEdit = (options, editProperties) => {
    if (!((options.field && !editProperties[options.field]) || (options.field && editProperties[options.field] && editProperties[options.field]?.type))) {
      setEditorType('row')
      setTimeout(() => {
        setEditorType('cell')
      }, 100)
    }
  }

  return (
    <DataTable
      rowGroupMode={representive ? "subheader" : ''} groupRowsBy={representive}
      rowGroupHeaderTemplate={(data) => <HeaderGroupTemplate data={data} representive={representive} representiveData={representiveData} representiveDataObjects={representiveDataObjects} />}
      rowGroupFooterTemplate={(data) => <FooterGroupTemplate data={data} representive={representive} representiveData={representiveData} representiveDataObjects={representiveDataObjects} />}
      responsiveLayout="scroll"
      totalRecords={itemsQuantity}
      paginator={paginate}
      rows={paginate ? perPage : data.length}
      onPage={onPageChange}
      first={first}
      header={header}
      scrollable
      scrollHeight="flex"
      value={data}
      dataKey="id"
      rowsPerPageOptions={[10, 20, 50]}
      editMode={editorType}
    // onRowEditComplete={onRowEditComplete}
    >
      {uzFields.map((field, index) => {
        if (field !== "action") {
          // console.log('test 222', data && attributesArray[index] ? `${fields[index]}.${attributesArray[index].join('.')}` : fields[index])
          // console.log('fields', fields[index])
          return (
            <Column
              field={
                data && attributesArray[index] && !multiLinesProperties[fields[index]]
                  ? `${fields[index]}.${attributesArray[index].join(".")}`
                  : fields[index]
              }
              header={
                <TheadTemplate
                  shortHeaderName={shortHeaderName[index]}
                  field={field}
                />
              }
              showFilterMenuOptions={false}
              body={(rowData) => (
                <DefaultBody
                  rowData={rowData}
                  field={
                    data && attributesArray[index] && !multiLinesProperties[fields[index]]
                      ? `${fields[index]}.${attributesArray[index].join(".")}`
                      : multiLinesProperties && multiLinesProperties[fields[index]] ? { array: fields[index], properties: multiLinesProperties[fields[index]]?.properties }
                        : fields[index]
                  }
                />
              )}
              editor={(options) => <TextEditor options={options} editProperties={editProperties} handleEditSelect={handleEditSelect} /> }
              onCellEditComplete={onCellEditComplete}
              onBeforeCellEditShow={(options) => checkOnCanEdit(options, editProperties)}
              filterClear={(<FilterFooter />)} filterApply={<FilterFooter />} filter filterElement={(rowData) => (<RepresentativeFilterTemplate rowData={rowData} filterOptions={filterOptions} handleFilterChange={handleFilterChange} fieldName={
                data && attributesArray[index]
                  ? `${fields[index]}.${attributesArray[index].join(".")}`
                  : fields[index]
              } name={field} />)}
            ></Column>
          );
        } else if (field === "action") {
          return (
            <Column
              field={
                data && attributesArray[index]
                  ? `${fields[index]}.${attributesArray[index].join(".")}`
                  : fields[index]
              }
              header={
                <TheadTemplate
                  shortHeaderName={shortHeaderName[index]}
                  field={field}
                />
              }
              showFilterMenuOptions={false}
              body={(rowData) => (
                <TableAction
                  splitActionProps={splitActionProps}
                  deleteFunction={deleteFunction}
                  editFunction={editFunction}
                  rowData={rowData}
                />
              )}
            //filterClear={(<FilterFooter />)}  filterApply={<FilterFooter />} filter filterElement={() => (<RepresentativeFilterTemplate filterOptions={filterOptions} handleFilterChange={handleFilterChange} name={fields[index]} />)}
            />
          );
        }
      })}
    </DataTable>
  );
};
