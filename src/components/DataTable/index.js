import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DownloadIcon from '../../icons/download-icon.svg'
import EditIcon from '../../icons/edit-icon.svg'
import TrashCan from '../../icons/trash-icon.svg'
import MoonLoader from "react-spinners/MoonLoader"
import './styles.css'

export default function DataTable(props) {
    const [maxItems, setMaxItems] = useState(10)
    const {
        tableData,
        title,
        subtitle,
        setIsEdit,
        isEdit,
        loading,
        tableHeaders,
        setItem,
        item,
        sizes,
        setResumeData,
        setOpenModal,
        setIsPdf,
        modalView
    } = props

    const history = useHistory()

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
        <div className='data-table-container'>
            <div className='data-table-titles'>
                <h4 className='data-table-title'>{title || ''}</h4>
                <h4 className='data-table-subtitle'>{subtitle || ''}</h4>
            </div>
            <div className='data-table-headers'>
                {
                    tableHeaders.map((header, i) => <h4 key={i} className='data-table-header' style={{ width: sizes && sizes[i] }}>{header.name}</h4>)
                }
            </div>
            {loading ? <div style={{ alignSelf: 'center', display: 'flex', marginTop: '5vw' }}><MoonLoader color='#E59A2F' /></div>
                :
                tableData.length ?
                    <>
                        {tableData.map((row, i) => i < maxItems &&
                            <div
                                key={i}
                                className='data-table-row'
                                style={{ backgroundColor: item === i ? '#E4C69C' : i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                                {tableHeaders.map((header, j) =>
                                    header.value === 'icons' ?
                                        <div key={j} className='data-table-icons'>
                                            {/* <img src={DownloadIcon} className='resume-icon' /> */}
                                            <img src={EditIcon} className='data-table-icon' onClick={() => history.push(`/new-cv?edit=${row._id}`)} />
                                            <img src={TrashCan} onClick={() => {
                                                setResumeData(row)
                                                setOpenModal(true)
                                            }} className='data-table-icon' />
                                        </div>
                                        :
                                        <h4
                                            key={j}
                                            className={`data-table-row-item detail data-table-row-${header.value}`}
                                            style={{ width: sizes && sizes[j] }}
                                            onClick={() => {
                                                if (modalView) {
                                                    setOpenModal(true)
                                                    setIsPdf(true)
                                                    setResumeData(row)
                                                } else handleItem(i)
                                            }}>
                                            {header.value === 'date' || header.value === 'updatedAt' ? `${new Date(row[header.value]).toDateString()} ${new Date(row[header.value]).toLocaleTimeString()}` :
                                                header.value === 'isManager' || header.value === 'isAdmin' ?
                                                    row[header.value] ? 'Yes' : 'No'
                                                    :
                                                    row[header.value] ? String(row[header.value])
                                                        :
                                                        '--'}
                                        </h4>
                                )}
                            </div>
                        )}
                        {maxItems < tableData.length &&
                            <button className='data-table-lazy-btn' onClick={() => setMaxItems(maxItems + 10)}>{`Show more ${title.toLowerCase()} ▼`}</button>
                        }
                    </>
                    :
                    <div className='data-table-row' style={{ backgroundColor: 'white', height: '2vw', justifyContent: 'center', cursor: 'default' }}>
                        No data to display.
                    </div>}
        </div>
    )
}
