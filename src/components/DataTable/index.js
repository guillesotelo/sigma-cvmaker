import React, { useState } from 'react'
import './styles.css'

export default function DataTable(props) {
    const [maxItems, setMaxItems] = useState(10)
    const {
        tableData,
        title,
        subtitle,
        setIsEdit,
        isEdit,
        tableHeaders,
        setItem,
        item,
        sizes
    } = props

    const handleItem = key => {
        if (isEdit) {
            if (key !== item) setItem(key)
            else {
                setItem(-1)
                setIsEdit(!isEdit)
            }
        }
        else {
            setItem(key)
            setIsEdit(!isEdit)
        }
    }

    return (
        <div className='table-container'>
            <div className='table-titles'>
                <h4 className='table-title'>{title || ''}</h4>
                <h4 className='table-subtitle'>{subtitle || ''}</h4>
            </div>
            <div className='table-headers'>
                {
                    tableHeaders.map((header, i) => <h4 key={i} className='table-header' style={{ width: sizes && sizes[i] }}>{header.name}</h4>)
                }
            </div>
            {tableData.length ?
                <>
                    {tableData.map((row, i) => i < maxItems &&
                        <div
                            key={i}
                            className='table-row'
                            onClick={() => handleItem(i)}
                            style={{ backgroundColor: item === i ? '#E4C69C' : i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                            {tableHeaders.map((header, j) =>
                                <h4 key={j} className={`table-row-item detail table-row-${header.value}`} style={{ width: sizes && sizes[j] }}>{
                                    header.value === 'date' || header.value === 'createdAt' ? new Date(row[header.value]).toDateString() :
                                    row[header.value] ? String(row[header.value]) : '--'}
                                </h4>
                            )}
                        </div>
                    )}
                    {maxItems < tableData.length &&
                        <button className='table-lazy-btn' onClick={() => setMaxItems(maxItems + 10)}>▼</button>
                    }
                </>
                :
                <div className='table-row' style={{ backgroundColor: 'white', height: '2vw', justifyContent: 'center' }}>
                    'No data to show.'
                </div>}
        </div>
    )
}
