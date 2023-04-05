import { useEffect, useState } from "react";
import { Item } from "./Item"
import InfiniteScroll from 'react-infinite-scroll-component';

const UP_AMOUNT = 7
const DOWN_AMOUNT = 13

const ContainerV2 = ({data}) => {
    return <div
            className="wrapper"
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '300px',
                width: '500px',
                overflow: 'scroll',
                flexWrap: 'nowrap'
            }}>
                {/* {<CornerElement reference={firstElementRef} />} */}
                {data.map((d) => <Item key={d.id} content={d.content} />)}
                {/* {<CornerElement reference={lastElementRef} />} */}
            </div>
}

export { ContainerV2 }