import { Button } from "primereact/button";
import React from "react";
import CustomCalendar from "./CustomCalendar";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";

let CustomCreate = ({ formData, title, handleChange, handleSubmit = "", handleReject = "", group_attribute="id" }) => {

    return (
        <div className="col-12 md:col-12 custom_crud_wrapper">
            <div className="card custom_crud_wrapper_card">

                <div className="p-datatable-header">
                    <div className="flex justify-content-between align-items-center table-header bg_transparent">
                        <h5 className="m-5 ml-0">{title}</h5>
                    </div>
                </div>

                <div className="grid free-themes">
                    {formData.map((formProps, index) => {
                        if (formProps.type === 'input') {
                            return (
                                <CustomInput type={formProps.inputType ? formProps.inputType : 'text'} key={formProps.name} formProps={formProps} index={index} handleChange={handleChange} />
                            )
                        }
                        else if (formProps.type === 'select') {
                            return (
                                <CustomSelect disabled={formProps.disabled} key={formProps.name} formProps={formProps} index={index} handleChange={handleChange} />
                            )
                        }
                        else if (formProps.type === 'date') {
                            return (
                                <CustomCalendar key={formProps.name} formProps={formProps} index={index} handleChange={handleChange} />
                            )
                        }
                        else if (formProps.type === 'input_group') {
                            console.log(formData[group_attribute], 'formprops', group_attribute, formData)
                            return (
                                <div className="col-12 md:col-12">
                                    <div className="p-inputgroup">
                                        <CustomInput type={formProps.inputType ? formProps.inputType : 'text'} key={formProps.name} formProps={formProps} index={index} handleChange={handleChange} label={false}/>
                                        <Button label={formData[0][group_attribute]} className="p-button-secondary" />
                                    </div>
                                </div>
                            )
                        }
                        else if (formProps.type === 'display_none') {
                            return null
                        }
                    }
                    )}

                </div>

                <div className="custom_crud_buttons_wrapper">
                    {handleSubmit && <Button label="Submit" icon="pi pi-check" className="p-button-raised p-button-success p-button-text mr-2" onClick={handleSubmit}
                    />}
                    {handleReject && <Button label="Reject" icon="pi pi-times" className="p-button-raised p-button-danger p-button-text reject_button_header" onClick={handleReject}
                    />}
                </div>


            </div>
        </div>
    )
}

export default CustomCreate;