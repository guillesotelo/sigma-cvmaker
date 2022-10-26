import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { createUser } from '../store/reducers/user'
import SwitchBTN from '../components/SwitchBTN'
import MoonLoader from "react-spinners/MoonLoader"
import ItemDropdown from '../components/ItemDropdown'

export default function NewResume() {
    const [data, setData] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const [languages, setLanguages] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))

    console.log("New Resume Data", data)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!user || !user.email) history.push('/login')
    })

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    return (
        <div className='new-resume-container'>
            <ToastContainer autoClose={2000} />
            <CTAButton
                label='Go back'
                handleClick={() => history.goBack()}
                style={{ alignSelf: 'flex-start' }}
                color={APP_COLORS.GRAY}
            />
            <h2 className='page-title' style={{ filter: openModal && 'blur(10px)' }}>NEW RESUME</h2>
            <div className='new-resume-fill'>
                <div className='resume-fill-col'>
                    <InputField
                        label='Name'
                        type='text'
                        name='name'
                        updateData={updateData}
                    />
                    <InputField
                        label='Surname'
                        type='text'
                        name='surname'
                        updateData={updateData}
                    />
                    <InputField
                        label='Role'
                        type='text'
                        name='role'
                        updateData={updateData}
                    />
                    <InputField
                        label='Gender'
                        type='text'
                        name='gender'
                        updateData={updateData}
                    />
                    <InputField
                        label='Location'
                        type='text'
                        name='location'
                        updateData={updateData}
                    />
                    <ItemDropdown
                        label='Language'
                        name=''
                        options={['Basic', 'Intermediate', 'Fluent', 'Native']}
                        updateData={updateData}
                        items={languages}
                        setItems={setLanguages}
                    />
                </div>
            </div>
        </div>
    )
}
