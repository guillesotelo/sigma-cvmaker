import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { logOut } from '../../store/reducers/user'
import { getImageByType } from '../../store/reducers/image'
import ProfileIcon from '../../icons/user-icon.svg'
import LogoutIcon from '../../icons/logout-icon.svg'
import ErrorIcon from '../../icons/error-icon.svg'
import BugIcon from '../../icons/bug-icon.svg'
import SigmaIso from '../../assets/logos/sigma_connectivity_iso.png'
import SearchBar from '../SearchBar'
import './styles.css'

export default function Header({ setSearch }) {
  const [words, setWords] = useState([])
  const [profilePic, setProfilePic] = useState({})

  const dispatch = useDispatch()
  const history = useHistory()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || !user.email) return history.push('/')
    getPreview(user.email)
  }, [])

  const logOutUser = async () => {
    try {
      const loggedOut = await dispatch(logOut()).then(data => data.payload)
      if (loggedOut) {
        toast.success('See you later!')
        setTimeout(() => history.push('/'), 1500)
      }
    } catch (err) { return toast.error('An error has occurred') }
  }

  const handleSearch = e => {
    if (e.key === 'Enter') {
      triggerSearch()
    } else {
      const _words = e.target.value ? e.target.value.split(' ') : []
      setWords(_words)
    }
  }

  const triggerSearch = () => {
    if (words.length) {
      setSearch(words)
      history.push('/search')
    }
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

  return (
    <>
      <ToastContainer autoClose={1500} />
      <div className='header-container'>
        <div className='header-logo-search'>
          <img src={SigmaIso} className='header-logo' onClick={() => history.push('/home')} loading='lazy' />
          {/* <div className='header-logo-container' onClick={() => history.push('/')}> */}
          {/* <h4 className='header-text'>CV Maker</h4> */}
          {/* </div> */}
          <SearchBar
            handleChange={e => handleSearch(e)}
            placeholder='Search'
            onKeyPress={handleSearch}
            triggerSearch={triggerSearch}
            style={{ width: '20vw' }}
          />
        </div>
        {user && user.email ?
          <div className='header-right-icons'>
            <img src={BugIcon} className='error-icon' onClick={() => history.push('/report')} />
            {/* <img src={LogoutIcon} className='logout-icon' onClick={logOutUser} /> */}
            {profilePic.image ?
              <img
                src={profilePic.image}
                className='header-profile-image'
                onClick={() => history.push('account')}
                loading='lazy'
              />
              : <img
                src={ProfileIcon}
                className='header-profile-svg'
                onClick={() => history.push('account')}
              />}
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}
