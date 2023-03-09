import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import EditIcon from '../../icons/edit-icon.svg'
import TrashCan from '../../icons/trash-icon.svg'
import DownloadIcon from '../../icons/download-icon.svg'
import PublishIcon from '../../icons/share-icon.svg'
import MoonLoader from "react-spinners/MoonLoader"
import './styles.css'
import Tooltip from '../Tooltip'

export default function DataTable(props) {
    const {
        tableData,
        setTableData,
        title,
        subtitle,
        maxRows,
        setIsEdit,
        isEdit,
        loading,
        setLoading,
        tableHeaders,
        setItem,
        item,
        sizes,
        setResumeData,
        setOpenModal,
        setDownload,
        setPublishCV,
        setIsPdf,
        modalView,
        style
    } = props

    const [maxItems, setMaxItems] = useState(maxRows || 10)
    const [ordered, setOrdered] = useState({ ...tableHeaders.forEach(h => { return { [h.name]: false } }) })
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

    const orderBy = header => {
        const copyData = [...tableData]
        const orderedData = copyData.sort((a, b) => {
            if (ordered[header.name]) {
                if (header.value === 'createdAt' || header.value === 'updatedAt') {
                    if (new Date(a[header.value]).getTime() < new Date(b[header.value]).getTime()) return -1
                    if (new Date(a[header.value]).getTime() > new Date(b[header.value]).getTime()) return 1
                }
                if (header.value === 'size') {
                    if (Number(a[header.value]) > Number(b[header.value])) return -1
                    if (Number(a[header.value]) < Number(b[header.value])) return 1
                }
                if (a[header.value] > b[header.value]) return -1
                if (a[header.value] < b[header.value]) return 1
            } else {
                if (header.value === 'createdAt' || header.value === 'updatedAt') {
                    if (new Date(a[header.value]).getTime() > new Date(b[header.value]).getTime()) return -1
                    if (new Date(a[header.value]).getTime() < new Date(b[header.value]).getTime()) return 1
                }
                if (header.value === 'size') {
                    if (Number(a[header.value]) < Number(b[header.value])) return -1
                    if (Number(a[header.value]) > Number(b[header.value])) return 1
                }
                if (a[header.value] < b[header.value]) return -1
                if (a[header.value] > b[header.value]) return 1
            }
            return 0
        })
        setTableData(orderedData)
        setOrdered({ [header.name]: !ordered[header.name] })
        setItem(-1)
        setIsEdit(false)
    }


    const calculateExpiration = cv => {
        let expired = true
        if (cv.published && cv.publicTime) {
            const now = new Date().getTime()
            const published = new Date(cv.published).getTime()
            const publicDays = cv.publicTime
            if (now - published < publicDays * 8.64E7) expired = false
        }
        return expired
    }

    const checkExpirationDays = cv => {
        let days = 0
        if (cv.published && cv.publicTime) {
            const now = new Date().getTime()
            const published = new Date(cv.published).getTime()
            const publicDays = cv.publicTime
            days = publicDays - ((now - published) / 8.64E7)
        }
        return days.toFixed(0)
    }

    return (
        <div className='data-table-container' style={style}>
            <div className='data-table-titles'>
                <h4 className='data-table-title'>{title || ''}</h4>
                <h4 className='data-table-subtitle'>{subtitle || ''}</h4>
            </div>
            <div className='data-table-headers'>
                {
                    tableHeaders.map((header, i) =>
                        <h4
                            key={i}
                            className='data-table-header'
                            onClick={() => header.value !== 'icons' && header.value !== 'data' && orderBy(header)}
                            style={{
                                width: sizes ? sizes[i] : `${100 / tableHeaders.length}%`,
                                textDecoration: Object.keys(ordered).includes(header.name) || header.value === 'icons' || header.value === 'data' && 'none',
                                cursor: header.value !== 'icons' && header.value !== 'data' ? 'pointer' : 'default'
                            }}>
                            {header.name} {Object.keys(ordered).includes(header.name) ? ordered[header.name] ? `▼` : `▲` : ''}
                        </h4>
                    )
                }
            </div>
            {loading ? <div style={{ alignSelf: 'center', display: 'flex', marginTop: '5vw' }}><MoonLoader color='#E59A2F' /></div>
                :
                tableData && tableData.length ?
                    <>
                        {tableData.map((row, i) => i < maxItems &&
                            <div
                                key={i}
                                className={item === i ? 'data-table-row-selected' : 'data-table-row'}
                                style={{
                                    backgroundColor: item === i ? '#d4e1f6' : i % 2 === 0 ? 'white' : '#F9FAFB',
                                    marginBottom: i === tableData.length - 1 && '3vw'
                                }}
                            >
                                {tableHeaders.map((header, j) =>
                                    header.value === 'data' ?
                                        <div key={j} style={{ width: sizes ? sizes[i] : `${100 / tableHeaders.length}%` }} onClick={() => handleItem(i)}>
                                            <img src={row[header.value]} className='data-table-image' />
                                        </div>
                                        :
                                        header.value === 'icons' ?
                                            <div key={j} className='data-table-icons' style={{ width: sizes ? sizes[i] : `${100 / tableHeaders.length}%` }}>
                                                {/* <img src={DownloadIcon} className='resume-icon' /> */}
                                                <Tooltip tooltip='Edit' style={{ marginRight: '.5vw' }}>
                                                    {row.isPdf ? '' : <img src={EditIcon} className='data-table-icon' onClick={() => history.push(`/new-cv?edit=${row._id}`)} />}
                                                </Tooltip>
                                                <Tooltip tooltip='Remove' style={{ marginRight: '.5vw' }}>
                                                    <img src={TrashCan} onClick={() => {
                                                        setResumeData(row)
                                                        setOpenModal(true)
                                                    }} className='data-table-icon' />
                                                </Tooltip>
                                                <Tooltip tooltip='Download' style={{ marginRight: '.5vw' }}>
                                                    <img src={DownloadIcon} className='data-table-icon' onClick={() => {
                                                        setLoading(true)
                                                        setOpenModal(true)
                                                        setIsPdf(true)
                                                        setResumeData(row)
                                                        setDownload(true)
                                                    }} />
                                                </Tooltip>
                                                <Tooltip tooltip='Publish' style={{ marginRight: '.5vw' }}>
                                                    <img src={PublishIcon} onClick={() => setPublishCV(row)} className='data-table-icon share-icon' />
                                                </Tooltip>
                                            </div>
                                            :
                                            <h4
                                                key={j}
                                                className={`data-table-row-item data-table-row-${header.value}`}
                                                style={{
                                                    width: sizes ? sizes[i] : `${100 / tableHeaders.length}%`,
                                                    color: header.value === 'published' && row.published ? calculateExpiration(row) ? 'red' : 'green' : ''
                                                }}
                                                onClick={() => {
                                                    if (modalView) {
                                                        setLoading(true)
                                                        setOpenModal(true)
                                                        setIsPdf(true)
                                                        setResumeData(row)
                                                    } else handleItem(i)
                                                }}
                                            >
                                                {header.value === 'createdAt' || header.value === 'updatedAt' ? `${new Date(row[header.value]).toDateString()} ${new Date(row[header.value]).toLocaleTimeString()}` :
                                                    header.value === 'size' ? row[header.value] > 100000 ? `${(row[header.value] * 0.000001).toFixed(2)} MB` : `${(row[header.value] * 0.001).toFixed(2)} KB` :
                                                        header.value === 'published' ? row.published ? calculateExpiration(row) ? 'Expired' : `${checkExpirationDays(row)} days left` : 'No' :
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
