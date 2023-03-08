import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import MoonLoader from "react-spinners/MoonLoader"
import { changePassword } from '../store/reducers/user'

export default function ResetPass() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()


    useEffect(() => {
        const userEmail = new URLSearchParams(document.location.search).get('userEmail')
        if (!userEmail) return history.push('/')
        setData({ userEmail })
    }, [])

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const updatePassword = async () => {
        try {
            setLoading(true)
            const updated = await dispatch(changePassword(data)).then(data => data.payload)

            if (updated) {
                setLoading(false)
                toast.success(`Password updated successfully`)
                setTimeout(() => history.push('/'), 2000)
            } else {
                setData({})
                setLoading(false)
                return toast.error('Error updating password')
            }
        } catch (err) {
            setData({})
            setLoading(false)
            console.error(err)
            return toast.error('Error updating password')
        }
    }

    const checkData = () => {
        return (data.password
            && data.password2
            && data.password === data.password2
            && data.password.length > 4)
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
                            <InputField
                                label='New password'
                                type='password'
                                name='password'
                                updateData={updateData}
                                style={{ width: '92%' }}
                                noGrammar={true}
                            />
                            <InputField
                                label='Re-enter password'
                                type='password'
                                name='password2'
                                updateData={updateData}
                                style={{ width: '92%', marginBottom: '1vw' }}
                                noGrammar={true}
                            />
                            <CTAButton
                                label='Update Password'
                                size='100%'
                                color={APP_COLORS.GREEN}
                                handleClick={updatePassword}
                                disabled={!checkData()}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}