import React, { useState } from 'react'
import './styles.css'

export default function Tooltip({ tooltip, children, inline }) {
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <div className="tooltip-container" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <p id={inline ? 'tooltip-text-inline' : 'tooltip-text'} style={{ display: showTooltip ? 'block' : 'none' }}>{tooltip}</p>
            {children}
        </div>
    )
}
