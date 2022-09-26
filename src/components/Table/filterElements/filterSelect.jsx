import React from "react";
export const FilterSelect = ({ filterOption, changeFilteredData }) => {
    return (
        <select name={filterOption.searchParam} value={filterOption.value} onChange={(e) => changeFilteredData(e)} className="p-dropdown p-component p-inputwrapper p-dropdown-clearable search_select">
            {filterOption.childs.map(option => (
                <option value={option}>{option}</option>
            ))}
        </select>
    )
}