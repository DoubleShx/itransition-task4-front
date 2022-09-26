import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { notifySuccess } from './utils/speccificToasts';
import httpClient from './axios/axios';
import Cookies from 'universal-cookie';

export const AppTopbar = (props) => {

    const [visible, setVisible] = useState(false);
    let cookie = new Cookies();
    let navigate = useNavigate();

    const accept = () => {
        cookie.remove("access_token")
        notifySuccess('Вы успешно вышли из системы')
        navigate("/login")
    };

    const reject = () => {
        return
    };

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={'assets/layout/images/Itransition.jpg'} alt="logo" />
                <span>Itransition</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-cog" />
                        <span>Settings</span>
                    </button>
                </li>
                <li>
                    <ConfirmPopup target={document.getElementById('profile_button')} visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?"
                        icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                    <button id="profile_button" className="p-link layout-topbar-button" onClick={() => setVisible(true)}>
                        <i className="pi pi-user" />
                        <span>Profile</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}
