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
        <div className='login-container'>
            <ToastContainer autoClose={4000} />
            <div className='login-box'>
                <div className='login-image'>
                    <img
                        src='https://images.squarespace-cdn.com/content/v1/5b07d207b27e39fe2cf2070c/1536149156741-FR68IVVJ8Q362PWO3FSC/Sigma_connectivity_footer-logo.png'
                        className='login-logo'
                        loading='lazy'
                    />
                </div>
                {loading ?
                    <div style={{ alignSelf: 'center', display: 'flex' }}><MoonLoader color='#E59A2F' /></div>
                    :
                    <div className='login-fill'>
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
    )
}
