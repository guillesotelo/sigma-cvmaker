import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import PolarChart from '../components/PolarChart'
import { PALETTE } from '../constants/app'
import { getAppData } from '../store/reducers/appData'
import { getImages } from '../store/reducers/image'
import { getResumes } from '../store/reducers/resume'
import { getLogs, getUsers } from '../store/reducers/user'
import { cvHeaders, imageHeaders, userHeaders } from '../constants/tableHeaders'

export default function Search() {
    const [words, setWords] = useState([])
    const [results, setResults] = useState({})
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

    console.log("Results", results)

    useEffect(() => {
        if (!user || !user.email) return history.push('/login')

        if (user.app && user.app !== 'cvmaker') {
            localStorage.clear()
            return history.push('/login')
        }

        const search = new URLSearchParams(document.location.search).get('search')
        if (search) setWords(search.split(','))
    }, [])

    useEffect(() => {
        if (words.length) getData()
    }, [words])

    const getData = async () => {
        try {
            setLoading(true)

            const cvs = await dispatch(getResumes({ ...user, getAll: true })).then(data => data.payload) || []
            const users = await dispatch(getUsers(user)).then(data => data.payload) || []
            const images = await dispatch(getImages()).then(data => data.payload) || []
            const appDatas = await dispatch(getAppData({ email: user.email })).then(data => data.payload) || []
            const logs = await dispatch(getLogs(user)).then(data => data.payload) || []

            setResults({
                cvs: filterData(cvs),
                users: filterData(users),
                images: filterData(images),
                appDatas: filterData(appDatas),
                logs: filterData(logs)
            })
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const filterData = data => {
        if (data && data.length) {
            const filtered = data.filter(item => {
                const string = JSON.stringify(item)
                let matches = true
                words.forEach(word => {
                    if (!string.toLowerCase().includes(word.toLowerCase())) matches = false
                })
                if (matches) return item
            })
            return filtered
        }
    }

    return (
        <div className='elastic-search-container'>
            <div className='elastic-search-section'>
                <h4 className='page-title'>Results for: <span className='elastic-words'>{words.join(' ')}</span></h4>

            </div>
        </div>
    )
}