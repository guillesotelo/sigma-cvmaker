import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { logIn } from '../store/reducers/user'
import MoonLoader from "react-spinners/MoonLoader"

export default function Login() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (user && user.email) history.push('/')
    })

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const loginUser = async () => {
        try {
            setLoading(true)
            const logged = await dispatch(logIn(data)).then(data => data.payload)

            if (logged) {
                setData({ ...data, password: '', email: '' })
                setLoading(false)
                console.log("logged", logged)
                toast.success(`Welcome back, ${logged.username.split(' ')[0]}!`)
                return setTimeout(() => history.push('/'), 2500)
            } else {
                setData({ ...data, password: '', email: '' })
                setLoading(false)
                return toast.error('Error logging in')
            }
        } catch (err) {
            setData({ ...data, password: '', email: '' })
            setLoading(false)
            console.error(err)
            return toast.error('Error logging in')
        }
    }

    return (
        <div className='login-container'>
            <ToastContainer autoClose={2000} />
            <div className='login-box'>
                <div className='login-image'>
                    <img src='https://marstrand-innovation.dk/wp-content/uploads/2015/03/Sigma.png' className='login-logo' />
                    <h4 className='login-text'>CV Maker</h4>
                </div>
                {loading ?
                    <div style={{ alignSelf: 'center', display: 'flex' }}><MoonLoader color='#6D0E00' /></div>
                    :
                    <div className='login-fill'>
                        <InputField
                            label='User Email'
                            type='text'
                            name='email'
                            updateData={updateData}
                        />
                        <InputField
                            label='Password'
                            type='password'
                            name='password'
                            updateData={updateData}
                            style={{ marginBottom: '2vw' }}
                        />
                        <CTAButton
                            label='Login'
                            size='100%'
                            color={APP_COLORS.MURREY}
                            handleClick={loginUser}
                            disabled={!data.email || !data.email.includes('.') || !data.email.includes('@') || !data.password}
                        />
                    </div>
                }
            </div>
        </div>
    )
}
