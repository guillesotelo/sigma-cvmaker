import React from 'react'
import './styles.css'

export default function CVHeader(props) {

    const { data, cvLogo } = props

    const fullName = (data.name ? data.name : '') + (data.middlename ? `${' ' + data.middlename}` : '')

    return (
        <div className='cv-header-main'>
            <div className='cv-header-container'>
                <div className='cv-header-col'>
                    <img src={cvLogo || 'https://i.imgur.com/i0PwKWi.png'} className='cv-header-logo' />
                </div>
                <div className='cv-header-col'>
                    <h1 className='cv-header-name'>{fullName && fullName.toUpperCase() || 'FULL NAME'}</h1>
                    <h1 className='cv-header-surname'>{data.surname && data.surname.toUpperCase() || 'SURNAME'}</h1>
                    <h2 className='cv-header-role'>{data.role && data.role.toUpperCase() || 'ROLE'}</h2>
                </div>
            </div>
        </div>
    )
}
