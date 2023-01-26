import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ActionCard from '../components/ActionCard'
import { TOOLTIPS } from '../constants/tooltips'

export default function Home() {
  const history = useHistory()
  const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null

  useEffect(() => {
    if (!localUser || !localUser.email) return history.push('/login')

    if (!localUser.token || (localUser.app && localUser.app !== 'cvmaker')) {
      localStorage.clear()
      return history.push('/login')
    }

    if (localUser.login) {
      const login = new Date(localUser.login).getTime()
      const now = new Date().getTime()

      if (now - login > 2506000000) {
        localStorage.clear()
        return history.push('/login')
      }
    }
  }, [])

  return (
    <div className='home-container'>
      <div className='home-welcome'>
        <h1 className='home-welcome-title'>Welcome to Sigma CV Maker</h1>
        <p className='home-welcome-text'>Here you can create, review and edit CVs, as well as manage all the data involved in the process.</p>
        <p className='home-welcome-text'>Select an action to start</p>
        <p className='home-welcome-comment'>NOTE: This application is currently in a <b>Beta Stage</b>.
          This means that new features are currently being added and some things may change without notice.
          <br />If you run into a problem while using the app, you can submit a report and help us fix it as soon as possible. To do this, click on the bug icon.</p>
      </div>
    </div>
  )
}
