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
import { getLogo, saveLogo } from '../store/reducers/resume'

export default function Settings() {
  const [tab, setTab] = useState('user')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [cvLogo, setcvLogo] = useState({})
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = [`CV Logo`, `Skills`, `Buzzwords`]

  useEffect(() => {
    getCVLogo()
  }, [])

  const updateData = (key, value) => {
    setIsEdit(true)
    setData({ ...data, [key]: value })
  }

  const getCVLogo = async () => {
    try {
      const logo = await dispatch(getLogo({ type: 'cv-logo' })).then(data => data.payload)
      if (logo) setcvLogo({ cvImage: logo.data })
      else setcvLogo({})
    } catch (err) { console.error(err) }
  }

  const saveCVLogo = async () => {
    try {
      setLoading(true)
      const logo = await dispatch(saveLogo({ ...cvLogo, type: 'cv-logo' })).then(data => data.payload)
      if (!logo) toast.error('Error uploading logo')
      else toast.success('Logo updated successfully')
      setLoading(false)
      setIsEdit(false)
    } catch (err) {
      console.error(err)
      toast.error('Error uploading logo')
      setLoading(false)
    }
  }

  return (
    <div className='settings-container'>
      <div className='settings-tabs'>
        {tabs.map((tabName, i) => <h4 key={i} className={tab === tabName ? 'settings-tab-selected' : 'settings-tab'} onClick={() => setTab(tabName)}>{tabName}</h4>)}
      </div>

      <div className='settings-section'>
        {
          tab === `CV Logo` ?
            <>
              {cvLogo.cvImage ? <img src={cvLogo.cvImage} className='settings-cv-logo' /> : ''}
              <InputField
                label='CV Logo'
                type='file'
                name='cvImage'
                filename='cvImage'
                image={cvLogo}
                setImage={setcvLogo}
                setIsEdit={setIsEdit}
                style={{ color: 'rgb(71, 71, 71)' }}
              />
              <div className='settings-cvlogo-btns'>
                {isEdit ?
                  <CTAButton
                    label='Discard'
                    handleClick={() => {
                      getCVLogo()
                      setIsEdit(false)
                    }}
                    color={APP_COLORS.GRAY}
                    disabled={!isEdit}
                  />
                  : ''}
                <CTAButton
                  label='Save'
                  handleClick={saveCVLogo}
                  color={APP_COLORS.GREEN}
                  loading={loading}
                  disabled={!isEdit}
                />
              </div>
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
