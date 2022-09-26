import React, { useEffect, useState } from "react";
import httpClient from "../../axios/axios";
import CustomCreate from "../../components/CRUD/CustomCreate";
import { useNavigate } from 'react-router-dom';
import { notifySuccess } from "../../utils/speccificToasts";
import moment from "moment";

let initialFormData = [
    {title: "Имя пользователя", name: 'name', type: 'input', value: ''},
    {title: "Электронная почта", name: 'email', type: 'input', value: ''},
    {title: "Пароль", name: 'password', type: 'input', value: ''},
    {title: "Тип Пользователя", name: 'user_type_id', type: 'select', options: [], value: '', necessaryFieldName: 'id'}
]

const changableFieldName = 'Пользователь'

const link = 'admin/users'

const navigateLink = '/user-table'

let UserAdd = () => {

    const [formData, setFormData] = useState(initialFormData)

    let navigate = useNavigate()

    useEffect(() => {
        if (true) {
            getInitialOptions('admin/user_types', 'user_type_id')
        }
    }, [])

    const getInitialOptions = (link, fieldName, labelName='name') => {
        httpClient.get(link)
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
        })
        .catch(err => console.log(err))
    }

    const handleChange = (value, index) => {
        let dateFormat = {}
        if (typeof value.getMonth === 'function') {
            dateFormat.dateFormat = moment(value).format('yyyy-MM-DD')
        }
        setFormData((formData) => ([
            ...formData.slice(0, index),
            {...formData[index], value: value, ...dateFormat},
            ...formData.slice(index+1)
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
        httpClient.post(link, {...data})
        .then(res => {
            notifySuccess(`${changableFieldName} успешно добавлен`)
            navigate(navigateLink)
        })
        .catch(err => console.log(err))
    }

    const handleReject = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <CustomCreate formData={formData} title={changableFieldName} handleChange={handleChange} handleSubmit={handleSubmit} handleReject={handleReject}/>
        </div>
    )
}

export default UserAdd;