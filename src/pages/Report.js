import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { saveReport, getAllReports, updateReport } from '../store/reducers/report'

export default function Report() {
    const [data, setData] = useState({})
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [reports, setReports] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'))
        setUser(localUser)
        setData({ ...data, ...localUser })
        getReports(localUser.email)
    }, [])

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const getReports = async email => {
        const _reports = await dispatch(getAllReports({ email })).then(data => data.payload)
        setReports(_reports || [])
    }

    const createReport = async () => {
        try {
            setLoading(true)
            const created = await dispatch(saveReport(data)).then(data => data.payload)

            if (created) {
                setData({ ...data, title: '', description: '' })
                toast.success(`Report created successfully!`)
                setTimeout(() => history.goBack(), 2000)
            }
            else {
                setData({ ...data, title: '', description: '' })
                toast.error('Error saving report')
            }
            setLoading(false)
            setTimeout(() => getReports(user.email), 200)
        } catch (err) {
            setData({ ...data, title: '', description: '' })
            setLoading(false)
            return toast.error('Error saving report')
        }
    }

    const markAsFixed = report => {
        try {
            const updated = dispatch(updateReport({ ...report, isFixed: !report.isFixed })).then(data => data.payload)
            if (updated) {
                toast.success(`Report created successfully!`)
            } else return toast.error('Error saving report')
            setTimeout(() => getReports(user.email), 200)
        } catch (err) {
            toast.error('Error saving report')
        }
    }

    return (
        <div className='report-container'>
            <ToastContainer autoClose={2000} />
            <div className='report-box'>
                <div className='report-image'>
                    <h4 className='report-title'>Report a problem</h4>
                    <h4 className='report-text'>Did you have a problem while using the app? Did you hit a bug?
                        From here you can send us a report of what has happened, and so you can help us solve it quickly</h4>
                </div>
                <div className='report-fill'>
                    <InputField
                        label='Title'
                        type='text'
                        name='title'
                        updateData={updateData}
                        placeholder='Report title'
                    />
                    <InputField
                        label='Description'
                        type='textarea'
                        name='description'
                        updateData={updateData}
                        cols={56}
                        rows={6}
                        placeholder='Desicribe what happened...'
                    />
                    <CTAButton
                        label='Create Report'
                        size='100%'
                        color={APP_COLORS.GREEN}
                        handleClick={createReport}
                        disabled={!data.title || !data.description}
                        loading={loading}
                    />
                </div>
            </div>

            {reports.length ?
                <>
                    <h4 className='report-list-title'>Submitted reports</h4>
                    <div className='report-list'>
                        {reports.map((report, i) =>
                            <div key={i} className='report-card' style={{ backgroundColor: report.isFixed && '#cbf0cb', color: report.isFixed && 'gray' }}>
                                <h4 className='report-title'>{report.title || ''}</h4>
                                <h4 className='report-email'>{report.email || ''}</h4>
                                <h4 className='report-email'>{new Date(report.date).toLocaleDateString() || ''}</h4>
                                <h4 className='report-description'>{report.description || ''}</h4>
                                <CTAButton
                                    handleClick={() => markAsFixed(report)}
                                    label={report.isFixed ? 'Mark as not fixed' : 'Mark as fixed'}
                                    size='100%'
                                    color={report.isFixed ? APP_COLORS.GRAY : APP_COLORS.GREEN}
                                    loading={loading}
                                />
                            </div>
                        )}
                    </div>
                </>
                :
                ''}
        </div>
    )
}
