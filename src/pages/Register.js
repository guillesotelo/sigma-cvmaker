import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { createUser } from '../store/reducers/user'
import SwitchBTN from '../components/SwitchBTN'
import GoBackIcon from '../icons/goback-icon.svg'

export default function Register() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))

  const dispatch = useDispatch()
  const history = useHistory()

  const updateData = (key, value) => {
    setData({ ...data, [key]: value })
  }

  const registerUser = async () => {
    try {
      setLoading(true)
      const created = await dispatch(createUser(data)).then(data => data.payload)

      if (created) {
        setData({ ...data, username: '', email: '', password: '', manager: '', isManager: false })
        setLoading(false)
        return toast.success(`User created successfully!`)
      }
      else {
        setData({ ...data, username: '', email: '', password: '', manager: '', isManager: false })
        setLoading(false)
        return toast.error('Error registering user')
      }
    } catch (err) {
      setData({ ...data, username: '', email: '', password: '', manager: '', isManager: false })
      setLoading(false)
      return toast.error('Error registering user')
    }
  }

  const generatePass = () => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const passwordLength = 8
    let password = ""
    for (let i = 0; i < passwordLength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return updateData('password', password)
  }

  return (
    <div className='register-container'>
      <ToastContainer autoClose={2000} />
      <img src={GoBackIcon} className='goback-icon' onClick={() => history.goBack()}/>
      <div className='register-box'>
        <div className='register-image'>
          <h4 className='register-text'>Create new user</h4>
        </div>
        <div className='register-fill'>
          <InputField
            label='Full Name'
            type='text'
            name='username'
            updateData={updateData}
          />
          <InputField
            label='User Email'
            type='text'
            name='email'
            updateData={updateData}
          />
          <InputField
            label='Password'
            type='text'
            name='password'
            updateData={updateData}
            value={(data.password || data.password === '') ? data.password : generatePass()}
          />
          <InputField
            label='Manager email'
            type='text'
            name='manager'
            updateData={updateData}
            style={{ marginBottom: '1vw' }}
          />
          <SwitchBTN
            label='Is Manager?'
            sw={data.isManager || false}
            onChangeSw={() => updateData('isManager', !data.isManager)}
            style={{ transform: 'scale(0.7)' }}
          />
          <CTAButton
            label='Create User'
            size='100%'
            color={APP_COLORS.MURREY}
            handleClick={registerUser}
            disabled={!data.email || !data.email.includes('.') || !data.email.includes('@') || !data.password || !data.username}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
