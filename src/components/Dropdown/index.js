import React, { useState } from 'react'
import './styles.css'

export default function Dropdown(props) {
    const [openDrop, setOpenDrop] = useState(false)
    const [selected, setSelected] = useState(null)
    const {
        label,
        name,
        updateData,
        options,
        value,
        index,
        style
    } = props

    return (
        <div className='dropdown-container' style={style}>
            <h4 className='dropdown-label'>{label || ''}</h4>
            <div className='dropdown-select-section'>
                <div className='dropdown-select' style={{ border: openDrop && '1px solid #E4C69C' }} onClick={() => setOpenDrop(!openDrop)}>
                    <h4 className='dropdown-selected'>{value ? value : selected ? selected : 'Select'}</h4>
                    <h4 className='dropdown-selected'>▾</h4>
                </div>
                {openDrop ?
                    <div className='dropdown-options' style={{ border: openDrop && '1px solid #E4C69C' }}>
                        {options.map((option, i) =>
                            <h4
                                key={i}
                                className='dropdown-option'
                                style={{ borderTop: i === 0 && 'none' }}
                                onClick={() => {
                                    updateData(name, option, index)
                                    setSelected(option)
                                    setOpenDrop(false)
                                }}>{option}</h4>
                        )}
                    </div>
                    : ''}
            </div>
        </div>
    )
}
