import React from "react";
import { Skeleton } from 'primereact/skeleton';

function Repeat({children, numTimes, repeatWithClass}) {
    let items = [];
    for (let i = 0; i < numTimes; i++) {
        items.push(children(i));
    }
    return <div className={repeatWithClass}>{items}</div>;
}

export const SkeletonWrapper = ({ RowsCount = 100, ColumnsCount = 2, height = "2rem", RowMargin="2", ColMargin="1", marginSkeleton="2" }) => {
    let calculateWidth = `${100 / ColumnsCount}%`
    return (
        <div className='p-5'>
            <Repeat repeatWithClass={`columns-${ColumnsCount}`} numTimes={RowsCount}>
                {(index) => (<Repeat repeatWithClass={`flex`}  numTimes={ColumnsCount}>
                    {(index) => <Skeleton className={`skeletons-with-margin m-${marginSkeleton} mt-3`} key={index} width="100%" height={height} />}
                </Repeat>)}
            </Repeat>
        </div>
    )
}