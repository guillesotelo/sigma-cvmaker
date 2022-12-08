import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProfileIcon from '../icons/user-icon.svg'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { getProfileImage, updateUserData, logOut } from '../store/reducers/user'
import GoBackIcon from '../icons/goback-icon.svg'

export default function Account() {

  const [data, setData] = useState({})
  const [profilePic, setProfilePic] = useState({})
  const [updateDetails, setUpdateDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatePass, setUpdatePass] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || {}

  useEffect(() => {
    setData({ ...data, ...user })
    getPreview(user.email)
  }, [])

  const updateData = (key, value) => {
    setData({ ...data, [key]: value })
  }

  const saveUserData = async () => {
    try {
      setLoading(true)
      if (checkData()) {
        const updated = await dispatch(updateUserData({
          _id: user._id,
          newData: data,
          profilePic
        })).then(data => data.payload)

        if (updated) {
          setData({ ...data, ...updated.data })
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
      const image = await dispatch(getProfileImage({ email })).then(data => data.payload)
      if (image) {
        setProfilePic({ profileImage: image.data, style: image.style ? JSON.parse(image.style) : {} })
      }
      else setProfilePic({})
    } catch (err) {
      console.error(err)
    }
  }

  const logOutUser = async () => {
    try {
      const loggedOut = await dispatch(logOut()).then(data => data.payload)
      if (loggedOut) {
        toast.success('See you later!')
        setTimeout(() => history.push('/login'), 1500)
      }
    } catch (err) { return toast.error('An error has occurred') }
  }

  return (
    <div className='account-container'>
      <h1 className='page-title' style={{ filter: updateDetails || updatePass ? 'blur(10px)' : '' }}>My Account</h1>
      <div className='account-details' style={{ filter: updateDetails || updatePass ? 'blur(10px)' : '' }}>
        <div className='account-item'>
          <h4 className='account-item-name'>Full Name</h4>
          <h4 className='account-item-value'>{user.username}</h4>
        </div>
        <div className='account-item'>
          <h4 className='account-item-name'>Email</h4>
          <h4 className='account-item-value'>{user.email}</h4>
        </div>
        <div className='account-item'>
          <h4 className='account-item-name'>Manager</h4>
          <h4 className='account-item-value'>{user.isManager ? 'Yes' : 'No'}</h4>
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
          {profilePic.profileImage ?
            <img
              src={profilePic.profileImage}
              style={profilePic.style}
              className='account-profile-image'
              onClick={() => document.getElementById('profileImage').click()}
            />
            : <img
              src={ProfileIcon}
              style={profilePic.style}
              className='account-profile-image-svg'
              onClick={() => document.getElementById('profileImage').click()}
            />}
          <InputField
            label=''
            type='file'
            name='profileImage'
            filename='profileImage'
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
          <InputField
            label='Manager Email'
            type='text'
            name='manager'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
            value={data.manager || ''}
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

      <h4 className='account-note' style={{ filter: updateDetails || updatePass ? 'blur(10px)' : '' }}>
        If you need to change your permissions, you must ask your manager or HR manager to do so.
      </h4>
    </div>
  )
}