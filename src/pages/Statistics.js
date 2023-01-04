import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import GoBackIcon from '../icons/goback-icon.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import { getLogs } from '../store/reducers/user'
import SearchBar from '../components/SearchBar'

export default function Statistics() {
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
    const logHeaders = [
        {
            name: 'DATE',
            value: 'updatedAt'
        },
        {
            name: 'DETAILS',
            value: 'details'
        },
        {
            name: 'USER',
            value: 'username'
        },
        {
            name: 'USER EMAIL',
            value: 'email'
        },
        {
            name: 'MODULE',
            value: 'module'
        },
        {
            name: 'ID',
            value: 'itemId'
        }
    ]

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
        <div className='statistics-container'>
            
        </div>
    )
}