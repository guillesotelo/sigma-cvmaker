import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { logOut } from '../../store/reducers/user'
import LogoutIcon from '../../icons/logout-icon.svg'
import ErrorIcon from '../../icons/error-icon.svg'
import SigmaIso from '../../assets/logos/sigma_connectivity_iso.png'
import SearchBar from '../SearchBar'
import './styles.css'

export default function Header() {
  const [search, setSearch] = useState([])

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

  const handleSearch = e => {
    if (e.key === 'Enter') {
      triggerSearch()
    } else {
      const words = e.target.value ? e.target.value.split(' ') : []
      setSearch(words)
    }
  }

  const triggerSearch = () => {
    // setLoading(true)
    // if (search.length) {
    //   const filtered = resumes.filter(res => {
    //     let matches = true
    //     search.forEach(word => {
    //       if (!JSON.stringify(res).toLowerCase().includes(word.toLowerCase())) matches = false
    //     })
    //     if (matches) return res
    //   })
    //   setFilteredRes(filtered)
    // }
    // setLoading(false)
  }

  return (
    <>
      <ToastContainer autoClose={1500} />
      <div className='header-container'>
        <div className='header-logo-search'>
            <img src={SigmaIso} className='header-logo' onClick={() => history.push('/')}/>
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
          <div>
            <img src={ErrorIcon} className='error-icon' onClick={() => history.push('/report')} />
            <img src={LogoutIcon} className='logout-icon' onClick={logOutUser} />
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}
