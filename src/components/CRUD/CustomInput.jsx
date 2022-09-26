import { InputText } from "primereact/inputtext";
import React from "react";

let CustomInput = ({ formProps, index, handleChange, type, label = true }) => {
    return (
        <>
            {label ?
                <span className="col-12 md:col-6 custom_input_wrapper custom_select_wrapper">
                    <label htmlFor={formProps.title ? formProps.title : formProps.name} className="custom_input_label">{formProps.title ? formProps.title : formProps.name}</label>
                    <InputText type={type} id={formProps.title ? formProps.title : formProps.name} value={formProps.value} onChange={(e) => handleChange(e.target.value, index)} className="custom_input w-100" />
                </span>
                :
                <InputText type={type} id={formProps.title ? formProps.title : formProps.name} value={formProps.value} onChange={(e) => handleChange(e.target.value, index)} className="custom_input w-100" />
            }
        </>
    )
}

export default CustomInput;