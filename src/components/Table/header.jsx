import React from "react";
import { Button } from 'primereact/button';

export const CustomHeader = ({ isTable = true, title = "Header", submitable = true, submitFunction = "", rejectable = true, rejectFunction = "", children = "", creatable="", createFunction="" }) => {
    return (
        <>
            <div className="flex justify-content-between align-items-center table-header">
                <h5 className="m-0">{isTable ? 'Таблица ' : ''} {title} </h5>
                <div className="flex ml-auto header_button_wrapper">
                    {creatable && createFunction && <Button icon="pi pi-plus" className=""
                        onClick={() => createFunction()}
                    />
                    }
                    {submitable && submitFunction &&
                        <Button label="Submit" icon="pi pi-check" className="p-button-sm mr-2 confirm p-button-success"
                            onClick={() => submitFunction()}
                        />
                    }
                    {rejectable && rejectFunction &&
                        <Button label="Reject" icon="pi pi-times" className="p-button-sm reject reject_button_header p-button-danger"
                            onClick={() => rejectFunction()}
                        />
                    }
                </div>
            </div>
            {children}
        </>
    )
}