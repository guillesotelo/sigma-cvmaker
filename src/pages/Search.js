import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getAppData } from '../store/reducers/appData'
import { getImages } from '../store/reducers/image'
import { getResumes } from '../store/reducers/resume'
import { getLogs } from '../store/reducers/log'
import { getUsers } from '../store/reducers/user'
import {
    cvHeaders,
    imageHeaders,
    userHeaders,
    appDataHeaders,
    logHeaders
} from '../constants/tableHeaders'
import DataTable from '../components/DataTable'
import { PuffLoader } from 'react-spinners'

export default function Search({ search }) {
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedCV, setSelectedCV] = useState(false)
    const [selectedUser, setSelectedUser] = useState(false)
    const [selectedImage, setSelectedImage] = useState(false)
    const [selectedData, setSelectedData] = useState(false)
    const [selectedLog, setSelectedLog] = useState(false)
    const [cvs, setCVs] = useState([])
    const [users, setUsers] = useState([])
    const [images, setImages] = useState([])
    const [appDatas, setAppDatas] = useState([])
    const [logs, setLogs] = useState([])
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user || !user.email) return history.push('/login')

        if (user.app && user.app !== 'cvmaker') {
            localStorage.clear()
            return history.push('/login')
        }
    }, [])

    useEffect(() => {
        if (search.length) getData()
        else history.push('/home')
    }, [search])

    const getData = async () => {
        try {
            setLoading(true)

            const cvs = await dispatch(getResumes({ ...user, getAll: true })).then(data => data.payload) || []
            const users = await dispatch(getUsers(user)).then(data => data.payload) || []
            const images = await dispatch(getImages()).then(data => data.payload) || []
            const appDatas = await dispatch(getAppData({ email: user.email })).then(data => data.payload) || []
            const logs = await dispatch(getLogs(user)).then(data => data.payload) || []

            setUsers(filterData(users))
            setCVs(filterData(cvs))
            setImages(filterData(images))
            setAppDatas(filterData(appDatas))
            setLogs(filterData(logs))
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const organizeAppData = data => {
        let newItems = []
        data.forEach(item => {
            const parsed = JSON.parse(item.data)
            parsed.forEach(appData => {
                let newData = {
                    ...item,
                    module: item.type || '',
                    name: appData.name || '',
                    itemType: appData.type || '',
                    field: appData.field || ''
                }
                newItems.push(newData)
            })
        })
        return newItems
    }

    const filterData = data => {
        if (data && data.length) {
            const filtered = data.filter(item => {
                if (!item.removed) {
                    const string = JSON.stringify({ ...item, data: item.size ? '' : item.data || '' })
                    let matches = true
                    search.forEach(word => {
                        if (!string.toLowerCase().includes(word.toLowerCase())) matches = false
                    })
                    if (matches) return item
                }
            })
            return filtered
        }
    }

    return (
        <div className='elastic-search-container'>
            <div className='elastic-search-section'>
                <h4 className='page-title'>Results for: <span className='elastic-words'>"{search.join(' ')}"</span></h4>
                {loading ? <div style={{ alignSelf: 'center', display: 'flex', marginTop: '5vw' }}><PuffLoader size='10vw' color='#E59A2F' /></div>
                    :
                    <div className='elastic-table-container'>
                        {users.length ?
                            <DataTable
                                title='Users'
                                subtitle=''
                                tableData={users}
                                setTableData={setUsers}
                                tableHeaders={userHeaders}
                                loading={loading}
                                item={selectedUser}
                                setItem={setSelectedUser}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                maxRows={4}
                                style={{ width: 'unset' }}
                            /> : ''}
                        {cvs.length ?
                            <DataTable
                                title='CVs'
                                subtitle=''
                                tableData={cvs}
                                setTableData={setCVs}
                                tableHeaders={cvHeaders}
                                loading={loading}
                                item={selectedCV}
                                setItem={setSelectedCV}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                maxRows={4}
                                style={{ width: 'unset' }}
                            /> : ''}
                        {images.length ?
                            <DataTable
                                title='Images'
                                subtitle=''
                                tableData={images}
                                setTableData={setImages}
                                tableHeaders={imageHeaders}
                                loading={loading}
                                item={selectedImage}
                                setItem={setSelectedImage}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                maxRows={4}
                                style={{ width: 'unset' }}
                            /> : ''}
                        {appDatas.length ?
                            <DataTable
                                title='App Data'
                                subtitle=''
                                tableData={appDatas}
                                setTableData={setAppDatas}
                                tableHeaders={appDataHeaders}
                                loading={loading}
                                item={selectedData}
                                setItem={setSelectedData}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                maxRows={4}
                                style={{ width: 'unset' }}
                            /> : ''}
                        {logs.length ?
                            <DataTable
                                title='Logs'
                                subtitle=''
                                tableData={logs}
                                setTableData={setLogs}
                                tableHeaders={logHeaders}
                                loading={loading}
                                item={selectedLog}
                                setItem={setSelectedLog}
                                isEdit={isEdit}
                                setIsEdit={setIsEdit}
                                maxRows={4}
                                style={{ width: 'unset' }}
                            /> : ''}
                    </div>
                }
            </div>
        </div>
    )
}