import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';


const OverlayDemo = () => {
    const op = useRef(null);
    const op2 = useRef(null);


    const toggle = (event) => {
        op.current.toggle(event);
    };

    const toggle2 = (event) => {
        op2.current.toggle(event);
    };

    return (
        <>
            <div className="card p-fluid">
                <h5>Overlay Panel</h5>
                <div className="grid formgrid">
                    <div className="col-6">
                        <Button type="button" label="Image" onClick={toggle} className="p-button-success" />
                        <OverlayPanel ref={op} appendTo={document.body} showCloseIcon>
                            <img src="images/nature/nature9.jpg" alt="nature1" />
                            <Button type="button" label="Image" onClick={toggle2} className="p-button-success" />
                            <OverlayPanel ref={op2} appendTo={op && op.current && op.current.target ? op.current.target : document.body} showCloseIcon>
                                <img src="images/nature/nature9.jpg" alt="nature1" />

                            </OverlayPanel>
                        </OverlayPanel>
                    </div>
                </div>
            </div>
        </>
    )
}



export default OverlayDemo;