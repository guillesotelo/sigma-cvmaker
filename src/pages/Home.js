import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ActionCard from '../components/ActionCard'
import { TOOLTIPS } from '../constants/tooltips'

export default function Home() {
  const [user, setUser] = useState({})
  const [tooltip, setTooltip] = useState('')
  const [tooltipStyle, setTooltipStyle] = useState({ color: 'transparent', transition: '.5s' })
  const history = useHistory()

  useEffect(() => {
    const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
    if (!localUser || !localUser.email) history.push('/login')
    setUser(localUser)
  }, [])

  return (
    <div className='home-container'>
      <div className='home-welcome'>
        <h1 className='home-welcome-title'>Welcome to Sigma CV Maker</h1>
        <p className='home-welcome-text'>Here you can create, review and edit CVs, as well as manage user data within the app.</p>
        <p className='home-welcome-text'>Select an action to start</p>
        <p className='home-welcome-comment'>NOTE: This application is currently in a <b>Beta Stage</b>.
        This means that new features are currently being added and some things may change without notice.
        <br/>If you run into a problem, you can submit a report and help us fix it as soon as possible. Check the ( ! ) sign for this.
        Any questions regarding this? You can follow the contact in the right corner.</p>
      </div>
      <div className='home-tooltip-container' style={tooltipStyle}>
        <h4 className='home-tooltip'>{tooltip || ''}</h4>
      </div>
      <div className='home-action-cards'>
        <ActionCard
          label='My CVs'
          details="Show consultant's CVs"
          color='white'
          onClick={() => history.push('/myResumes')}
          onMouseEnter={() => {
            setTooltipStyle({
              color: '#6D0E00',
              transition: '.5s',
              borderRight: '1px solid #6D0E00'
            })
            setTooltip(TOOLTIPS.my_cvs)
          }}
          onMouseLeave={() => {
            setTooltipStyle({
              color: 'transparent',
              border: 'none',
              transition: '.5'
            })
            setTooltip('')
          }}
        />
        {user.isManager ?
          <ActionCard
            label='All CVs'
            details="Show all submitted CVs"
            color='white'
            onClick={() => history.push('/allResumes')}
            onMouseEnter={() => {
              setTooltipStyle({
                color: '#6D0E00',
                transition: '.5s',
                borderRight: '1px solid #6D0E00'
              })
              setTooltip(TOOLTIPS.all_cvs)
            }}
            onMouseLeave={() => {
              setTooltipStyle({
                color: 'transparent',
                border: 'none',
                transition: '.5s'
              })
              setTooltip('')
            }}
          />
          : ''}
        <ActionCard
          label='New CV'
          details="Create a new CV"
          color='white'
          onClick={() => history.push('/createResume')}
          onMouseEnter={() => {
            setTooltipStyle({
              color: '#6D0E00',
              transition: '.5s',
              borderRight: '1px solid #6D0E00'
            })
            setTooltip(TOOLTIPS.create_cv)
          }}
          onMouseLeave={() => {
            setTooltipStyle({
              color: 'transparent',
              border: 'none',
              transition: '.5s'
            })
            setTooltip('')
          }}
        />
        <ActionCard
          label='Create User'
          details="Register a new User"
          color='white'
          onClick={() => history.push('/register')}
          onMouseEnter={() => {
            setTooltipStyle({
              color: '#6D0E00',
              transition: '.5s',
              borderRight: '1px solid #6D0E00'
            })
            setTooltip(TOOLTIPS.create_user)
          }}
          onMouseLeave={() => {
            setTooltipStyle({
              color: 'transparent',
              border: 'none',
              transition: '.5s'
            })
            setTooltip('')
          }}
        />
        <ActionCard
          label='Account'
          details="Change user data"
          color='white'
          onClick={() => history.push('/account')}
          onMouseEnter={() => {
            setTooltipStyle({
              color: '#6D0E00',
              transition: '.5s',
              borderRight: '1px solid #6D0E00'
            })
            setTooltip(TOOLTIPS.account)
          }}
          onMouseLeave={() => {
            setTooltipStyle({
              color: 'transparent',
              border: 'none',
              transition: '.5s'
            })
            setTooltip('')
          }}
        />
        <ActionCard
          label='App Settings'
          details="Adjust App configurations"
          color='white'
          onClick={() => history.push('/settings')}
          onMouseEnter={() => {
            setTooltipStyle({
              color: '#6D0E00',
              transition: '.5s',
              borderRight: '1px solid #6D0E00'
            })
            setTooltip(TOOLTIPS.settings)
          }}
          onMouseLeave={() => {
            setTooltipStyle({
              color: 'transparent',
              border: 'none',
              transition: '.5s'
            })
            setTooltip('')
          }}
        />
      </div>
    </div>
  )
}
