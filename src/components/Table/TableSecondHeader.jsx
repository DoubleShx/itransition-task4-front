import React from "react";
import { FilterSidebar } from './FilterSidebar';

export const TableSecondHeader = ({filterOptions, getFilteredData, changeFilteredData}) => {
    return (
        <div className="table_filter_wrapper flex">            
            <FilterSidebar filterOptions={filterOptions} changeFilteredData={changeFilteredData} getFilteredData={getFilteredData}/>
        </div>
    )
}