import React, { useEffect, useState } from "react";
import httpClient from "../../axios/axios";
import CustomCreate from "../../components/CRUD/CustomCreate";
import { useNavigate, useParams } from 'react-router-dom';
import { notifySuccess } from "../../utils/speccificToasts";
import moment from "moment";
import { debouncedSingleGetData } from "../../utils/debounce";

let initialFormData = [
    {title: "Имя Пользователя", name: 'name', type: 'input', value: ''},
    {title: "Электронная почта", name: 'email', type: 'input', value: ''},
    {title: "Пароль", name: 'password', type: 'input', value: ''},
    {title: "Тип Пользователя", name: 'user_type_id', type: 'select', options: [], value: '', necessaryFieldName: 'id'}
]

const changableFieldName = 'Пользователь'

const link = 'admin/users/'

const navigateLink = '/user-table'

let UserEdit = () => {

    const [formData, setFormData] = useState(initialFormData)

    let params = useParams()

    useEffect(() => {
        if (true) {
            const promises = [
                getInitialOptions('admin/user_types', 'user_type_id'),
            ]
            Promise.allSettled(promises).
            then((results) => {
                debouncedSingleGetData(link, params, setSingleData)
            });
        }
    }, [])

    const setSingleData = (res) => {
        let data = res.data.data
        setFormData((formData) => {
            let formDataObject = formData.reduce((prevResult, form, index) => {
                let dateFormat = {}
                if (form.type === 'date') {
                    dateFormat.dateFormat = data[form.name]
                    data[form.name] = new Date(data[form.name])
                }
                return [...prevResult, {
                    ...form, value: form.type !== 'select' ? data[form.name] :
                    form.options.findIndex(idLabel => (+idLabel.id === +data[form.name])) !== -1 ?  form.options[form.options.findIndex(idLabel => (+idLabel.id === +data[form.name]))] : '',
                    ...dateFormat
                }]
            }, [])
            return formDataObject
        })
    } 

    const getInitialOptions = async (link, fieldName, labelName='name') => {
        return await httpClient.get(link)
         .then(res => {
             setFormData((formData) => {
                 let array = res.data.data ?? []
                 let options = array.map(item => ({...item, label: item[labelName]}))
                 let idx = formData.findIndex(form => form.name === fieldName)
                 return ([
                     ...formData.slice(0, idx),
                     {...formData[idx], options},
                     ...formData.slice(idx+1)
                 ])
             })
             return res
         })
         .catch(err => console.log(err))
     }

    let navigate = useNavigate()

    const handleChange = (value, index) => {
        let dateFormat = {}
        if (typeof value.getMonth === 'function') {
            dateFormat.dateFormat = moment(value).format('yyyy-MM-DD')
        }
        setFormData((formData) => ([
            ...formData.slice(0, index),
            { ...formData[index], value: value, ...dateFormat},
            ...formData.slice(index + 1)
        ]))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('e', e)
        let data = formData.reduce((prevResult, currentForm) => {
            return {
                ...prevResult, [currentForm.name]: currentForm.necessaryFieldName ? currentForm.value[currentForm['necessaryFieldName']] : currentForm.dateFormat ? currentForm.dateFormat : currentForm.value
            }
        }, {})
        httpClient.put(link + params.id, { ...data })
            .then(res => {
                notifySuccess(`${changableFieldName} успешно изменён`)
                if (navigateLink) {
                    navigate(navigateLink)
                }
            })
            .catch(err => console.log(err))
    }

    const handleReject = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <CustomCreate formData={formData} title={`${changableFieldName} #${params?.id}`} handleChange={handleChange} handleSubmit={handleSubmit} handleReject={handleReject} />
        </div>
    )
}

export default UserEdit;