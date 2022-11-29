import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import GoBackIcon from '../icons/goback-icon.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import { getUsers, updateUserData, getProfileImage } from '../store/reducers/user'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'

export default function Settings() {
  const [tab, setTab] = useState('user')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = [`CV's`, `Skills`, `Buzzwords`]

  const updateData = (key, value) => {
    setIsEdit(true)
    setData({ ...data, [key]: value })
  }

  return (
    <div className='settings-container'>
      <div className='settings-tabs'>
        {tabs.map((tabName, i) => <h4 key={i} className={tab === tabName ? 'settings-tab-selected' : 'settings-tab'} onClick={() => setTab(tabName)}>{tabName}</h4>)}
      </div>

      <div className='settings-section'>
        {
            tab === `CV's` ?
              <>
              </>
              :
              tab === `Skills` ?
                <>
                </>
                :
                tab === `Buzzwords` ?
                  <>
                  </>
                  :
                  ''
        }
      </div>
    </div>
  )
}
