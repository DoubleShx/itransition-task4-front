import React from "react";

export const FilterInput = ({filterOption, changeFilteredData}) => {
    return (
        <input name={filterOption.searchParam} value={filterOption.value} onChange={(e) => changeFilteredData(e)} placeholder={filterOption.searchParam} /> 
    )
}