import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import httpClient from '../axios/axios';
import { notifySuccess } from '../utils/speccificToasts';

const initialFormData = {email:'', password: ''}


const Login = () => {
    const [checked, setChecked] = useState(false);
    const [formData, setFormData] = useState(initialFormData)

    let cookie = new Cookies()
    let navigate = useNavigate()

    useEffect(() => {
        let token = cookie.get('access_token')
        if (token) {
            navigate('/')
        }
    }, [])

    const handleChange = (e) => {
        setFormData((formData) => ({...formData, [e.target.name]: e.target.value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let params = {email: formData.email, password: formData.password}
        httpClient.post('auth/login',  {email: formData.email, password: formData.password})
        .then(res => {
            let {token, expires_at} = res.data 
            setFormData(initialFormData)
            if (token) {
                cookie.set('access_token', token)
                notifySuccess('Вы успешно вошли в систему')
                navigate('/')
            }
        })
        .catch(err => { 
            console.log(err)
            setFormData(initialFormData)
        })
    }

    return (
        <div className="block-viewer login_page_wrapper">
        <div className="block-section">
        <div className='block-header'>
            <span className="block-title"><span>Sign-In</span></span>
            </div>
            <div className='block-content'>
        <div className="surface-card p-4 shadow-2 border-round w-full ">
            <div className="text-center mb-5">
                <img src="images/search_gif.gif" alt="hyper" height="50" className="login_page_img" />
                <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                <button className="p-link font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</button>
            </div>

            <div>
                <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
                <InputText id="email1" type="text" name="email" className="w-full mb-3" onChange={handleChange} value={formData.email}/>

                <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                <InputText id="password1" type="password" name="password" className="w-full mb-3" onChange={handleChange} value={formData.password}/>

                {/* <div className="flex align-items-center justify-content-between mb-6">
                    <div className="flex align-items-center">
                        <Checkbox inputId="rememberme1" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                        <label htmlFor="rememberme1">Remember me</label>
                    </div>
                    <button className="p-link font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</button>
                </div> */}

                <Button label="Sign In" icon="pi pi-user" className="w-full mt-5" onClick={handleSubmit}/>
            </div>
        </div>
        </div>
        
        </div>
        </div>
    )
}

export default Login;