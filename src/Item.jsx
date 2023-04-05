const Item = ({content, forwardedRef}) => {
    return <div style={{
        display: 'flex',
        flexWrap: 'nowrap',
        width:'100%',
        padding: '1rem',
        height: '50px'
    }}
    ref={forwardedRef ?? null}>
        {content}
    </div>
}

export { Item }