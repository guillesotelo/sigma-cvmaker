import React, { useState } from 'react'
import './styles.css'

export default function Dropdown(props) {
    const [openDrop, setOpenDrop] = useState(false)
    const {
        label,
        name,
        updateData,
        options,
        value
    } = props

    return (
        <div className='dropdown-container'>
            <h4 className='dropdown-label'>{label || ''}</h4>
            <div className='dropdown-select-section'>
                <div className='dropdown-select' style={{ border: openDrop && '1px solid #E4C69C' }} onClick={() => setOpenDrop(!openDrop)}>
                    <h4 className='dropdown-selected'>{value ? value : options.length ? options[0] : 'Select'}</h4>
                    <h4 className='dropdown-selected'>▾</h4>
                </div>
                {openDrop ?
                    <div className='dropdown-options' style={{ border: openDrop && '1px solid #E4C69C' }}>
                        {options.map((op, i) =>
                            <h4 
                            key={i} 
                            className='dropdown-option' 
                            style={{ borderTop: i === 0 && 'none' }}
                            onClick={() => {
                                updateData([name], op)
                                setOpenDrop(false)
                            }}>{op}</h4>)
                        }
                    </div>
                    : ''}
            </div>
        </div>
    )
}
