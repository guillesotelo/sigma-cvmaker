import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProfileIcon from '../icons/user-icon.svg'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { updateUserData, logOut, getAllManagers } from '../store/reducers/user'
import { getImageByType } from '../store/reducers/image'
import Dropdown from '../components/Dropdown'
import Tooltip from '../components/Tooltip'

export default function Account() {

  const [data, setData] = useState({})
  const [profilePic, setProfilePic] = useState({})
  const [updateDetails, setUpdateDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatePass, setUpdatePass] = useState(false)
  const [managers, setManagers] = useState([])
  const [allManagers, setAllManagerrs] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || {}

  useEffect(() => {
    if (!user || !user.email) history.push('/')
    setData({ ...data, ...user })
    getPreview(user.email)
    getManagers()
  }, [])

  useEffect(() => {
    if (data.managerName) {
      allManagers.forEach(manager => {
        if (manager.username === data.managerName) updateData('managerEmail', manager.email)
      })
    }
  }, [data.managerName])

  const updateData = (key, value) => {
    setData({ ...data, [key]: value })
  }

  const getManagers = async () => {
    try {
      const _managers = await dispatch(getAllManagers(user)).then(data => data.payload)
      if (_managers && Array.isArray(_managers)) {
        setAllManagerrs(_managers)
        setManagers(_managers.map(manager => manager.username))
      }
    } catch (err) { console.error(err) }
  }

  const saveUserData = async () => {
    try {
      setLoading(true)
      if (checkData()) {
        const updated = await dispatch(updateUserData({
          _id: user._id,
          newData: data,
          profilePic,
          user
        })).then(data => data.payload)

        if (updated) {
          setData({ ...data, ...updated })
          localStorage.setItem('user', JSON.stringify(updated))
          toast.success('User data saved successfully')
        }
        else toast.error('Error saving changes')
      } else {
        setLoading(false)
        return toast.error('Check the fields')
      }

      setLoading(false)
      setUpdateDetails(false)
      setUpdatePass(false)
    } catch (err) {
      toast.error('Error saving changes')
    }
  }

  const checkData = () => {
    if (updateDetails) {
      if (!data.username || !data.username.includes(' ') || !data.email || !data.email.includes('@') || !data.email.includes('.')) return false
      if (data.manager && (!data.manager.includes('@') || !data.manager.includes('.'))) return false
    }
    if (updatePass) {
      if (!data.password || !data.password2) return false
    }
    return true
  }

  const getPreview = async email => {
    try {
      const image = await dispatch(getImageByType({ email, type: 'Profile' })).then(data => data.payload)
      if (image) {
        setProfilePic({ image: image.data, style: image.style ? JSON.parse(image.style) : {} })
      }
      else setProfilePic({})
    } catch (err) {
      console.error(err)
    }
  }

  const logOutUser = async () => {
    try {
      const loggedOut = await dispatch(logOut(user)).then(data => data.payload)
      if (loggedOut) {
        toast.success('See you later!')
        setTimeout(() => history.push('/'), 1500)
      }
    } catch (err) { return toast.error('An error has occurred') }
  }

  return (
    <div className='account-container'>
      <h1 className='page-title' style={{ filter: updateDetails || updatePass ? 'blur(10px)' : '' }}>My Account</h1>
      <div className='account-details' style={{ filter: updateDetails || updatePass ? 'blur(10px)' : '' }}>
        {profilePic.image ?
          <div className='account-profile-image-cover'>
            <img
              src={profilePic.image}
              style={profilePic.style}
              className='profile-image'
              loading='lazy'
            />
          </div> : ''}
        <div className='account-info'>
          <div className='account-item'>
            <h4 className='account-item-name'>Full Name</h4>
            <h4 className='account-item-value'>{user.username}</h4>
          </div>
          <div className='account-item'>
            <h4 className='account-item-name'>Email</h4>
            <h4 className='account-item-value'>{user.email}</h4>
          </div>
          {user.isManager ?
            <div className='account-item'>
              <h4 className='account-item-name'>Manager</h4>
              <h4 className='account-item-value'>{user.isManager ? 'Yes' : ''}</h4>
            </div> : ''}
        </div>
      </div>
      <div className='account-btns' style={{ filter: updateDetails || updatePass ? 'blur(10px)' : '' }}>
        <CTAButton
          label='Change details'
          handleClick={() => setUpdateDetails(true)}
          color={APP_COLORS.GREEN}
          disabled={updatePass}
        />
        <CTAButton
          label='Change password'
          handleClick={() => setUpdatePass(true)}
          color={APP_COLORS.GREEN}
          disabled={updateDetails}
        />
        <CTAButton
          label='Logout'
          handleClick={logOutUser}
          color={APP_COLORS.GRAY}
          loading={loading}
        />
      </div>
      {updateDetails ?
        <div className='account-update-details'>
          {profilePic.image ?
            <Tooltip tooltip='Change image'>
              <img
                src={profilePic.image}
                style={profilePic.style}
                className='account-profile-image'
                onClick={() => document.getElementById('image').click()}
                loading='lazy'
              />
            </Tooltip>
            :
            <Tooltip tooltip='Upload image'>
              <img
                src={ProfileIcon}
                style={profilePic.style}
                className='account-profile-image-svg'
                onClick={() => document.getElementById('image').click()}
              />
            </Tooltip>
          }
          <InputField
            label=''
            type='image'
            name='image'
            filename='image'
            image={profilePic}
            setImage={setProfilePic}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
          <InputField
            label='Full Name'
            type='text'
            name='username'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
            value={data.username || ''}
          />
          <InputField
            label='Email'
            type='text'
            name='email'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
            value={data.email || ''}
          />
          <Dropdown
            label='Consultant Manager'
            name='managerName'
            options={managers}
            value={data.managerName}
            updateData={updateData}
            size='24vw'
          />
          <InputField
            label='Phone'
            type='text'
            name='phone'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
            value={data.phone || ''}
          />
          <InputField
            label='Location'
            type='text'
            name='location'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
            value={data.location || ''}
          />
          <div className='account-update-btns'>
            <CTAButton
              label='Cancel'
              handleClick={() => {
                setData({ ...user })
                setUpdateDetails(false)
              }}
              color={APP_COLORS.GRAY}
            />
            <CTAButton
              label='Save'
              handleClick={saveUserData}
              color={APP_COLORS.GREEN}
              loading={loading}
            />
          </div>
        </div>
        : ''}

      {updatePass ?
        <div className='account-update-pass'>
          <InputField
            label='New password'
            type='password'
            name='password'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
          <InputField
            label='Repeat password'
            type='password'
            name='password2'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
          <div className='account-update-btns'>
            <CTAButton
              label='Cancel'
              handleClick={() => {
                setData({ ...user })
                setUpdatePass(false)
              }}
              color={APP_COLORS.GRAY}
            />
            <CTAButton
              label='Save'
              handleClick={saveUserData}
              color={APP_COLORS.GREEN}
              loading={loading}
            />
          </div>
        </div>
        : ''}
    </div>
  )
}
