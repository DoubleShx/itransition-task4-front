import { Calendar } from 'primereact/calendar';
import React from "react";

let CustomCalendar = ({formProps, index, handleChange}) => {
    return (
        <span className="col-12 md:col-6 custom_input_wrapper custom_select_wrapper">
            <label htmlFor={formProps.title ? formProps.title : formProps.name} className="custom_input_label">{formProps.title ? formProps.title : formProps.name}</label>
            <Calendar dateFormat='yy-mm-dd' id={formProps.title ? formProps.title : formProps.name} type="text" value={formProps.value} onChange={(e) => handleChange(e.target.value, index)} className="custom_input w-100" timeOnly={formProps.timeOnly} showSeconds={formProps.timeOnly}/>
        </span>
    )
}

export default CustomCalendar;