import React from 'react'
import Dropdown from '../Dropdown'
import InputField from '../InputField'
import './styles.css'

export default function CVFooter(props) {

  const {
    updateData,
    data,
    managers,
    manager
  } = props

  return (
    <div className='cv-footer-main'>
      <div className='cv-footer-manager'>
        <Dropdown
          label='Consultant Manager'
          name='manager'
          options={managers}
          value={manager}
          updateData={updateData}
          size='15vw'
        />
      </div>
      <div className='cv-footer-container'>
        <div className='cv-footer-col'>
          <div className='cv-footer-row'>
            <h4 className='cv-footer-label'>Contact:</h4>
            <InputField
              label=''
              value={data.footer_contact || ''}
              type='text'
              name='footer_contact'
              placeholder='Manager Full Name'
              updateData={updateData}
              style={{ color: 'rgb(71, 71, 71)' }}
            />
          </div>
          <div className='cv-footer-row'>
            <h4 className='cv-footer-label'>Email:</h4>
            <InputField
              label=''
              value={data.footer_email || ''}
              type='text'
              name='footer_email'
              placeholder='manager.email@sigma.se'
              updateData={updateData}
              style={{ color: 'rgb(71, 71, 71)' }}
            />
          </div>
        </div>
        <div className='cv-footer-col'>
          <div className='cv-footer-row'>
            <h4 className='cv-footer-label'>Phone:</h4>
            <InputField
              label=''
              value={data.footer_phone || ''}
              type='text'
              name='footer_phone'
              placeholder='+12 345 67 89 01'
              updateData={updateData}
              style={{ color: 'rgb(71, 71, 71)' }}
            />
          </div>
          <div className='cv-footer-row'>
            <h4 className='cv-footer-label'>Location:</h4>
            <InputField
              label=''
              value={data.footer_location || ''}
              type='text'
              name='footer_location'
              placeholder='Mobilvägen 10, Lund, Sweden'
              updateData={updateData}
              style={{ color: 'rgb(71, 71, 71)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
