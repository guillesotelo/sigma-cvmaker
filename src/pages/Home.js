import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { logIn } from '../store/reducers/user'
import MoonLoader from "react-spinners/MoonLoader"
import ActionCard from '../components/ActionCard'
import { getAllResumes } from '../store/services/reduxServices'

export default function Home() {
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
    if (!user || !user.email) history.push('/login')
  })

  return (
    <div className='home-container'>
      <div className='home-action-cards'>
        <ActionCard
          label='My Resumes'
          details="Show consultant's CVs"
          color={APP_COLORS.SPACE}
          onClick={() => history.push('/myResumes')}
        />
        <ActionCard
          label='New Resume'
          details="Create a new Resume"
          color={APP_COLORS.SPACE}
          onClick={() => history.push('/createResume')}
        />
        <ActionCard
          label='Create User'
          details="Register a new User"
          color={APP_COLORS.SPACE}
          onClick={() => history.push('/register')}
        />
      </div>
    </div>
  )
}
