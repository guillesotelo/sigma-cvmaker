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

export default function Activity() {
    const [data, setData] = useState({})
    const [logs, setLogs] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedLog, setSelectedLog] = useState(-1)

    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
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
        getAllLogs()
    }, [])

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

    return (
        <div className='activity-container'>
            <DataTable
                title='Activity'
                subtitle='Here is a list of the complete app log'
                tableData={logs}
                tableHeaders={logHeaders}
                loading={loading}
                item={selectedLog}
                setItem={setSelectedLog}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                maxRows={9}
            />
        </div>
    )
}