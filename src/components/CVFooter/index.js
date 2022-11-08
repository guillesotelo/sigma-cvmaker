import React from 'react'
import InputField from '../InputField'
import './styles.css'

export default function CVFooter(props) {

  const { updateData, data, user } = props
  return (
    <div className='footer-container'>
      <div className='footer-col'>
        <div className='footer-row'>
          <h4 className='inputfield-label'>Contact:</h4>
          <InputField
            label=''
            value={data.footer_contact}
            type='text'
            name='footer_contact'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
        </div>
        <div className='footer-row'>
          <h4 className='inputfield-label'>Email:</h4>
          <InputField
            label=''
            value={data.footer_email}
            type='text'
            name='footer_email'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
        </div>
      </div>
      <div className='footer-col'>
        <div className='footer-row'>
          <h4 className='inputfield-label'>Phone:</h4>
          <InputField
            label=''
            value={data.footer_phone || ''}
            type='text'
            name='footer_phone'
            placeholder='+XX XXX XX XX XX'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
        </div>
        <div className='footer-row'>
          <h4 className='inputfield-label'>Location:</h4>
          <InputField
            label=''
            value={data.footer_location || 'Mobilvägen 10, Lund, Sweden'}
            type='text'
            name='footer_location'
            updateData={updateData}
            style={{ color: 'rgb(71, 71, 71)' }}
          />
        </div>
      </div>
    </div>
  )
}
