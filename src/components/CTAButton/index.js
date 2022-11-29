import React from 'react'
import { SyncLoader } from 'react-spinners'
import { APP_COLORS } from '../../constants/app'
import './styles.css'

export default function CTAButton(props) {
    const {
        label,
        color,
        size,
        style,
        handleClick,
        disabled,
        loading,
        className,
        btnClass
    } = props

    const buttonStyle = {
        ...style,
        padding: '3vw',
        width: size || 'auto',
        backgroundColor: color || APP_COLORS.YELLOW,
        cursor: disabled ? 'not-allowed' : 'pointer'
    }

    const containerStyle = {
        opacity: disabled ? 0.25 : 1
    }

    return (
        <div className={className || 'cta-btn-container'} style={containerStyle}>
            {loading ?
                <SyncLoader speedMultiplier={0.8} color={color || '#E59A2F'} />
                :
                <button className={btnClass || 'cta-btn'} onClick={handleClick} style={buttonStyle} disabled={disabled || false}>
                    {label || ''}
                </button>
            }
        </div>
    )
}
