import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { logOut } from '../../store/reducers/user'
import LogoutIcon from '../../icons/logout-icon.svg'
import ErrorIcon from '../../icons/error-icon.svg'
import './styles.css'

export default function Header() {

  const dispatch = useDispatch()
  const history = useHistory()

  const user = JSON.parse(localStorage.getItem('user'))

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
    <>
      <ToastContainer autoClose={1500} />
      <div className='header-container'>
        <div className='header-logo-container' onClick={() => history.push('/')}>
          <img src='https://images.squarespace-cdn.com/content/v1/5b07d207b27e39fe2cf2070c/1536149156741-FR68IVVJ8Q362PWO3FSC/Sigma_connectivity_footer-logo.png' className='header-logo'/>
          <h4 className='header-text'>CV Maker</h4>
        </div>
        {user && user.email ?
          <div>
            <img src={ErrorIcon} className='error-icon' onClick={() => history.push('/report')}/>
            <img src={LogoutIcon} className='logout-icon' onClick={logOutUser}/>
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}
