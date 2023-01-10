import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import PolarChart from '../components/PolarChart'
import { PALETTE } from '../constants/app'
import { getAppData } from '../store/reducers/appData'
import { getImages } from '../store/reducers/image'
import { getResumes } from '../store/reducers/resume'
import { getLogs, getUsers } from '../store/reducers/user'

export default function Statistics() {
    const [data, setData] = useState({})
    const [search, setSearch] = useState([])
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [logsModule, setLogsModule] = useState({ labels: [], datasets: [] })
    const [logsAction, setLogsAction] = useState({ labels: [], datasets: [] })
    const [totalCount, setTotalCount] = useState({ labels: [], datasets: [] })
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const history = useHistory()
    const dispatch = useDispatch()
    const modules = ['CV', 'Image', 'AppData', 'User']
    const actions = [
        'CV created',
        'CV exported',
        'CV updated',
        'CV moved to trash',
        'CV removed permanently',
        'CV restored',
        'Image updated',
        'Image moved to trash',
        'Image removed permanently',
        'Image restored',
        'New login',
        'Failed login attempt',
        'User logged out',
        'User moved to trash',
        'User restored',
        'User updated',
        'New App Data created',
        'App Data updated',
        'Report created',
        'Report updated',
    ]
    const countLabels = [
        'CVs',
        'Users',
        'Images',
        'App Data',
    ]

    useEffect(() => {
        if (!user || !user.email || !isManager) history.push('home')
        getAllLogs()
    }, [])

    useEffect(() => {
        setChartsData()
    }, [logs])

    const setChartsData = async () => {
        const colorPattern = logs.map(_ => randomColors(PALETTE)[0])
        const countPattern = countLabels.map(_ => randomColors(PALETTE)[0])

        setLogsModule({
            labels: modules,
            datasets: [{
                data: modules.map(module => countLogsByModule(module, 'module')),
                backgroundColor: colorPattern
            }]
        })

        setLogsAction({
            labels: actions,
            datasets: [{
                data: actions.map(action => countLogsByAction(action, 'details')),
                backgroundColor: colorPattern
            }]
        })

        setTotalCount({
            labels: countLabels,
            datasets: [{
                data: await getCountByLabel(countLabels),
                backgroundColor: countPattern
            }]
        })
    }

    useEffect(() => {
        if (!search.length) {
            getAllLogs()
        }
    }, [search.length])

    const getCountByLabel = async () => {
        try {
            setLoading(true)
            let data = []
            const cvs = await dispatch(getResumes({ ...user, getAll: true })).then(data => data.payload)
            const users = await dispatch(getUsers(user)).then(data => data.payload)
            const images = await dispatch(getImages()).then(data => data.payload)
            const appDatas = await dispatch(getAppData({ email: user.email })).then(data => data.payload)

            if (cvs && cvs.length) data[0] = cvs.length
            if (users && users.length) data[1] = users.length
            if (images && images.length) data[2] = images.length
            if (appDatas && appDatas.length) data[3] = appDatas.length

            setLoading(false)
            return data
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const countLogsByAction = (value, col) => {
        let count = 0
        logs.forEach(log => {
            if (log[col] && log[col].toLowerCase().includes(value.toLowerCase())) count += 1
        })
        return count
    }

    const countLogsByModule = (value, col) => {
        let count = 0
        logs.forEach(log => {
            if (log[col] === value) count += 1
        })
        return count
    }

    const randomColors = array => {
        return array.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    const getAllLogs = async () => {
        setLoading(true)
        const _logs = await (dispatch(getLogs(user))).then(data => data.payload)
        if (_logs) setLogs(_logs)
        setLoading(false)
    }

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    return (
        <div className='statistics-container'>
            <div className='statistics-section'>
                <h4 className='page-title'>Statistics</h4>
                {loading ? <div style={{ alignSelf: 'center', display: 'flex', marginTop: '5vw' }}><MoonLoader color='#E59A2F' /></div>
                    :
                    <div className='statistics-graphrow'>
                        <BarChart chartData={logsAction} position='y' title='Logs by action' />
                        <PolarChart chartData={logsModule} title='Logs by module' size={200} />
                        <PieChart chartData={totalCount} title='Total count' size={200} />
                    </div>
                }
            </div>
        </div>
    )
}