import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { saveReport } from '../store/reducers/report'
import SwitchBTN from '../components/SwitchBTN'
import MoonLoader from "react-spinners/MoonLoader"

export default function Report() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        setData({ ...data, ...user })
    }, [])

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
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
        } catch (err) {
            setData({ ...data, title: '', description: '' })
            setLoading(false)
            return toast.error('Error saving report')
        }
    }

    return (
        <div className='report-container'>
            <ToastContainer autoClose={2000} />
            <h4 className='go-back-btn' onClick={() => history.goBack()}>Go back</h4>
            <div className='report-box'>
                <div className='report-image'>
                    <h4 className='report-title'>Report a problem</h4>
                    <h4 className='report-text'>Did you have a problem while using the app? Did you hit a bug? From here you can send us a report of what has happened, and so you can help us solve it quickly</h4>
                </div>
                <div className='report-fill'>
                    <InputField
                        label='Title'
                        type='text'
                        name='title'
                        updateData={updateData}
                    />
                    <InputField
                        label='Description'
                        type='textarea'
                        name='description'
                        updateData={updateData}
                        cols={56}
                        rows={10}
                        placeholder='Desicribe what happened...'
                    />
                    <CTAButton
                        label='Create Report'
                        size='100%'
                        color={APP_COLORS.MURREY}
                        handleClick={createReport}
                        disabled={!data.title || !data.description}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    )
}
