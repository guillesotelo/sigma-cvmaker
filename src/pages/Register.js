import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { createUser } from '../store/reducers/user'
import SwitchBTN from '../components/SwitchBTN'
import Dropdown from '../components/Dropdown'

export default function Register(props) {
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))
  const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (!user || !user.email || !isManager) history.push('home')
  }, [])

  const {
    data,
    updateData,
    setIsNew,
    profilePic,
    managers
  } = props

  const registerUser = async () => {
    try {
      setLoading(true)
      const created = await dispatch(createUser({ ...data, profilePic, user })).then(data => data.payload)

      if (created) {
        setLoading(false)
        setIsNew(false)
        return toast.success(`User created successfully!`)
      }
      else {
        setLoading(false)
        setIsNew(false)
        return toast.error('Error registering user')
      }

    } catch (err) {
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
      <div className='register-box'>
        <div className='register-image'>
          <h4 className='register-text'>Create new user</h4>
        </div>
        <div className='register-fill'>
          <InputField
            label='Full Name'
            type='text'
            name='username'
            placeholder='Emily Beckham'
            updateData={updateData}
          />
          <InputField
            label='User Email'
            type='text'
            name='email'
            placeholder='emily.beckham@sigma.se'
            updateData={updateData}
          />
          <InputField
            label='Password'
            type='text'
            name='password'
            updateData={updateData}
            value={(data.password || data.password === '') ? data.password : generatePass()}
          />
          <Dropdown
            label='Consultant Manager'
            name='managerName'
            options={managers}
            value={data.managerName}
            updateData={updateData}
            size='100%'
          />
          <InputField
            label='Phone'
            type='text'
            name='phone'
            placeholder='+12 3456 78901'
            updateData={updateData}
          />
          <InputField
            label='Location'
            type='text'
            name='location'
            updateData={updateData}
            placeholder='Mobilvägen 10, Lund, Sweden'
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
            color={APP_COLORS.GREEN}
            handleClick={registerUser}
            disabled={!data.email || !data.email.includes('.') || !data.email.includes('@') || !data.password || !data.username}
            loading={loading}
          />
          <div style={{ margin: '.5vw' }} />
          <CTAButton
            label='Cancel'
            size='100%'
            color={APP_COLORS.GRAY}
            handleClick={() => setIsNew(false)}
          />
        </div>
      </div>
    </div>
  )
}
