import React from 'react'
import { VERSION } from '../../constants/app'
import EngineeringLogo from '../../assets/logos/engineering_by_sigma.png'
import './styles.css'

export default function Footer() {
    return (
        <div className='footer-container'>
            <h4 className='footer-text'>© 2022 Sigma. All rights reserved.</h4>
            {/* <div className='footer-text'> */}
            {/* <h4 className='footer-text-row footer-hover' onClick={(e) => {
                    e.preventDefault()
                    window.open('https://www.sigmaconnectivity.com/', '_blank', 'noopener,noreferrer');
                }}>Sigma Connectivity Engineering</h4>
                <h4 className='footer-text-row'>Mobilvägen 10, 223 62 Lund, Sweden </h4> */}
            {/* </div> */}
            <h4 className='footer-version'>{VERSION}</h4>
            {/* <div className='footer-text'>
                <h4 className='footer-contact footer-hover' onClick={(e) => {
                    e.preventDefault()
                    window.location.href = 'mailto:guillermo.sotelo@sigma.se'
                }}>Contact: guillermo.sotelo@sigma.se</h4>
            </div> */}
            <div className='footer-logo-container'>
                <img src={EngineeringLogo} className='footer-logo' onClick={() => window.open('https://www.sigma.se/sv/contact/sigma-connectivity-engineering/', '_blank')} />
            </div>
        </div>
    )
}
