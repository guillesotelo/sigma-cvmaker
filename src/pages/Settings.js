import React from 'react'
import { useHistory } from 'react-router-dom'
import GoBackIcon from '../icons/goback-icon.svg'

export default function Settings() {

  const history = useHistory()

  return (
    <div className='settings-container'>
      <img src={GoBackIcon} className='goback-icon' onClick={() => history.goBack()} />

      <h1 className='page-title'>App Settings [Development]</h1>

    </div>
  )
}
