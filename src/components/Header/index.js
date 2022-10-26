import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { logOut } from '../../store/reducers/user'
import LogoutIcon from '../../icons/logout-icon.svg'
import './styles.css'

export default function Header() {

  const dispatch = useDispatch()
  const history = useHistory()

  const user = JSON.parse(localStorage.getItem('user'))

  const logOutUser = async () => {
    try {
      const loggedOut = dispatch(logOut()).then(data => data.payload)
      if (loggedOut) {
        toast.success('See you later!')
        return setTimeout(() => history.push('/login'), 2000)
      }
    } catch (err) { return toast.error('An error has occurred') }
  }

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className='header-container'>
        <div className='header-logo-container' onClick={() => history.push('/')}>
          <img src='https://i.imgur.com/w30IOHG.png' className='header-logo'/>
          <h4 className='header-text'>CV Maker</h4>
        </div>
        {user && user.email ?
          <img src={LogoutIcon} className='logout-icon' onClick={logOutUser}/>
          :
          <></>
        }
      </div>
    </>
  )
}
