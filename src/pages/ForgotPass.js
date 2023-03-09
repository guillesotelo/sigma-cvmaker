import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import MoonLoader from "react-spinners/MoonLoader"
import { sendEmailResetPass } from '../store/reducers/user'

export default function ForgotPass() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const resetPassword = async () => {
        try {
            setLoading(true)
            const reset = await dispatch(sendEmailResetPass(data)).then(data => data.payload)

            if (reset) {
                setLoading(false)
                toast.success(`Please check your email for login instructions`)
                setTimeout(() => history.push('/'), 4000)
            } else {
                setData({ ...data, email: '' })
                setLoading(false)
                return toast.error('Error checking email')
            }
        } catch (err) {
            setData({ ...data, email: '' })
            setLoading(false)
            console.error(err)
            return toast.error('Error checking email')
        }
    }

    return (
        <div className='landing-container'>
            <div className='landing-wallpaper'>
                <img className='landing-image' src='https://i.postimg.cc/Pqz0B7RF/smartmockups-ldvjxl5u.jpg' alt='Dashboard Image' />
            </div>
            <div className='landing-login'>
                <ToastContainer autoClose={4000} />
                <div className='login-box landing-login-box'>
                    <div className='login-image'>
                        <img
                            src='https://sigmait.pl/wp-content/uploads/2021/12/sigma-logo-black.png'
                            className='login-logo'
                            loading='lazy'
                        />
                    </div>
                    {loading ?
                        <div style={{ alignSelf: 'center', display: 'flex' }}><MoonLoader color='#E59A2F' /></div>
                        :
                        <div className='login-fill'>
                            <h4 className='login-title'>Update password with your email</h4>
                            <InputField
                                label='Email'
                                type='text'
                                name='email'
                                placeholder='user@email.com'
                                updateData={updateData}
                                style={{ width: '95%', marginBottom: '1vw' }}
                                noGrammar={true}
                            />
                            <CTAButton
                                label='Reset Password'
                                size='100%'
                                color={APP_COLORS.GREEN}
                                handleClick={resetPassword}
                                disabled={!data.email || !data.email.includes('.') || !data.email.includes('@')}
                            />
                            <h4 style={{ margin: '.4vw 0' }}></h4>
                            <CTAButton
                                label='Go back'
                                size='100%'
                                color={APP_COLORS.GRAY}
                                handleClick={() => history.push('/')}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
