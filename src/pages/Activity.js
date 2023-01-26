import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/DataTable'
import { getLogs } from '../store/reducers/log'
import SearchBar from '../components/SearchBar'
import { logHeaders } from '../constants/tableHeaders'

export default function Activity() {
    const [data, setData] = useState({})
    const [logs, setLogs] = useState([])
    const [search, setSearch] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedLog, setSelectedLog] = useState(-1)

    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user || !user.email || !isManager) history.push('home')
        getAllLogs()
    }, [])

    useEffect(() => {
        if (!search.length) {
            getAllLogs()
        }
    }, [search.length])

    const getAllLogs = async () => {
        setLoading(true)
        const _logs = await (dispatch(getLogs(user))).then(data => data.payload)
        if (_logs) setLogs(_logs)
        setLoading(false)
    }

    const updateData = (key, value) => {
        setIsEdit(true)
        setData({ ...data, [key]: value })
    }

    const handleSearch = e => {
        if (e.key === 'Enter') {
            triggerSearch()
        } else {
            const words = e.target.value ? e.target.value.split(' ') : []
            setSearch(words)
        }
    }

    const triggerSearch = () => {
        setLoading(true)
        if (search.length) {
            const filtered = logs.filter(log => {
                const stringLog = JSON.stringify(log)
                let matches = true
                search.forEach(word => {
                    if (!stringLog.toLowerCase().includes(word.toLowerCase())) matches = false
                })
                if (matches) return log
            })
            setLogs(filtered)
        }
        setLoading(false)
    }

    return (
        <div className='activity-container'>
            <div className='activity-column'>
                <SearchBar
                    handleChange={e => handleSearch(e)}
                    placeholder='Search by words or text...'
                    style={{ width: '20vw' }}
                    onKeyPress={handleSearch}
                    triggerSearch={triggerSearch}
                    setData={setLogs}
                />
                <DataTable
                    title='Activity'
                    subtitle='Here is a list of the complete app log'
                    tableData={logs}
                    setTableData={setLogs}
                    tableHeaders={logHeaders}
                    loading={loading}
                    item={selectedLog}
                    setItem={setSelectedLog}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    maxRows={8}
                    style={{ width: '97.5%' }}
                />
            </div>
        </div>
    )
}