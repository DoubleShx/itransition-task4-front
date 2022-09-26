import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterSelect } from './filterElements/filterSelect';
import { FilterInput } from './filterElements/filterInput';

export const FilterSidebar = ({ filterOptions, getFilteredData, changeFilteredData }) => {
    const [visibleRight, setVisibleRight] = useState(false);

    return (
        <div className="card flex ml-auto w-100 table_second_header">

            {/* Full screen version
                <Sidebar visible={visibleRight} className="w-100 h-100" position="fullScreen" onHide={() => setVisibleRight(false)}>
                    <h3>Full Screen Version</h3>
                </Sidebar> */}

            <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <h5 className='search_title'>Qidirish Menyusi</h5>
                {
                    filterOptions.filterChilds.map(filterOption => {
                        return (
                            <div className="col-12 md:col-4">
                                <div className="p-inputgroup">
                                    <Button className="p-button-raised p-button-secondary p-button-text search_group_label" label={filterOption.name} />

                                    {filterOption.type === 'select' ?
                                        <FilterSelect filterOption={filterOption} changeFilteredData={changeFilteredData} />
                                        : filterOption.type === 'input' ?
                                            <FilterInput filterOption={filterOption} changeFilteredData={changeFilteredData} />
                                            : null
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                <div className="col-12 md:col-4 flex">
                    <Button label="Qidirish" icon="pi pi-search" className="p-button-success confirm_search_button" onClick={() => getFilteredData()} /></div>
            </Sidebar>


            <Button icon="pi pi-search" className="search_button" aria-label="Search" onClick={() => setVisibleRight(true)} />
        </div>
    )
}