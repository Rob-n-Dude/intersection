import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Item } from "./Item"
import './Container.css'

const usePrevious = (value) => {
    const previous = useRef()
  
    useEffect(() => {
      previous.current = value
    }, [value])
  
    return previous.current
  }

const useIntersection = (loadData) => {
    const cornerEl = useRef(null)
    // const wrapperRef = useRef(null)

    const intersectionCb = useCallback(async ([entry]) => {
        if (entry.isIntersecting) {
            await loadData()
        }
    }, [loadData])

    const observer = useMemo(() => new IntersectionObserver(intersectionCb, {threshold: 0.2}), [intersectionCb])

    useEffect(() => {
        const corner = cornerEl.current
        corner && observer.observe(corner)

        return () => {
            corner && observer.unobserve(corner)
        }
    }, [cornerEl, observer])

    return { cornerEl }
}

const BEFORE_TRESHOLD = 7
const AFTER_TRESHOLD = 10

const Container = ({data, activeTabIndex}) => {

    const CornerElement = useCallback(({reference}) => <div ref={reference} style={{minWidth: '1px'}} />, [])

    const wrapperRef = useRef(null)
    const [dataToDisplay, setDataToDisplay] = useState([])
    const [displayedIndex, setDisplayedIndex] = useState({
        last: 0,
        first: 0,
    })

    const prevDataLength = usePrevious(dataToDisplay.length)

    const dataItemsAmountDelta = useMemo(() => (
        dataToDisplay.length - prevDataLength
    ), [dataToDisplay, prevDataLength])

    const scrollToActive = useCallback(() => {
            const startIdx = data.findIndex((t) => t.id === activeTabIndex) - BEFORE_TRESHOLD
            const endIdx = data.findIndex((t) => t.id === activeTabIndex) + AFTER_TRESHOLD
        
            const start = startIdx > 0 ? startIdx : 0
            const end = (endIdx > 0 && endIdx < data.length) ? endIdx : data.length
        
            setDataToDisplay(data.slice(start, end))
            setDisplayedIndex(() => ({
                first: start,
                last: end,
            }))
    }, [data, activeTabIndex])

    useEffect(() => {
        scrollToActive()
    }, [scrollToActive])


    const getNextData = useCallback(() => {
        const nextIndex = displayedIndex.last + AFTER_TRESHOLD >= data.length ? data.length : displayedIndex.last + AFTER_TRESHOLD
        if (nextIndex === displayedIndex.last) {
            return
        }
        setDataToDisplay((prev) => {
            return prev.concat(data.slice(displayedIndex.last, nextIndex))
        })


        setDisplayedIndex((prev) => ({
            ...prev,
            last: nextIndex,
        }))
    }, [setDataToDisplay, data, displayedIndex])

    const getLeftScrollPosition = useCallback(() => {
        const { childNodes } = wrapperRef.current

        const nodes = Array.from(childNodes).slice(0, dataItemsAmountDelta)

        return nodes.reduce((acc, cur) => acc += cur.clientWidth, 0)
       
    }, [wrapperRef, dataItemsAmountDelta])

    const getPrevData = useCallback(() => {
        const prevIndex = displayedIndex.first - BEFORE_TRESHOLD <= 0 ? 0 : displayedIndex.first - BEFORE_TRESHOLD
        if (prevIndex === displayedIndex.first) {
            return
        }
        setDataToDisplay((prev) => {
            return data.slice(prevIndex, displayedIndex.first).concat(prev)
        })

        wrapperRef.current.scrollTo({
            left: getLeftScrollPosition()
        })
        setDisplayedIndex((prev) => ({
            ...prev,
            first: prevIndex,
        }))
    }, [setDataToDisplay, displayedIndex, data, getLeftScrollPosition])

    const { cornerEl: lastElementRef} = useIntersection(getNextData)
    const { cornerEl: firstElementRef} = useIntersection(getPrevData)

    return <div
            ref={wrapperRef}
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
                {<CornerElement reference={firstElementRef} />}
                {dataToDisplay.map((d) => <Item key={d.id} content={d.content} />)}
                {<CornerElement reference={lastElementRef} />}
            </div>
}

export { Container }