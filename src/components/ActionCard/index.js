import React from 'react'
import './styles.css'

export default function ActionCard(props) {

    const {
        label,
        details,
        color,
        onClick
    } = props

    return (
        <div className='action-card-container' onClick={onClick} style={{ backgroundColor: color || '#696869' }}>
            <h4 className='action-card-label'>{label || ''}</h4>
            <h5 className='action-card-details'>{details || ''}</h5>
        </div>
    )
}
