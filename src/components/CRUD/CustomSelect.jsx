import { Dropdown } from "primereact/dropdown";
import React from "react";

let CustomSelect = ({ formProps, index, handleChange, disabled="" }) => {

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    <div>{option.label}</div>
                </div>
            );
        }

        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const countryOptionTemplate = (option) => {
        return (
            <div className="country-item">
                <div>{option.label}</div>
            </div>
        );
    }

    return (
        <span className="col-12 md:col-6 custom_input_wrapper custom_select_wrapper">
            <label htmlFor={formProps.title ? formProps.title : formProps.name} className="custom_input_label select">{formProps.title ? formProps.title : formProps.name}</label>
            <Dropdown disabled={formProps.value? disabled : false} id={formProps.title ? formProps.title : formProps.name} value={formProps.value} options={formProps.options} onChange={(e)=>handleChange(e.value, index)} optionLabel="label" filter showClear filterBy="label"  className="w-100"
            placeholder={`Выберите ${formProps.title ? formProps.title : formProps.name}`}
            valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} />
        </span>
    )
}

export default CustomSelect;