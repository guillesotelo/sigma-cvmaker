import React, { useEffect, useState } from 'react'
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import './styles.css'

export default function Dropdown(props) {
    const [openDrop, setOpenDrop] = useState(false)
    const [selected, setSelected] = useState(null)
    const {
        label,
        name,
        updateData,
        items,
        setItems,
        options,
        value,
        index,
        style,
        size,
        hidden,
        setHidden,
        fontSize,
        placeholder
    } = props

    const hideItem = item => {
        if (item) {
            const _hidden = [...hidden]
            _hidden.push(item)
            setHidden(_hidden)
        }
    }

    const showItem = item => {
        if (item) setHidden(hidden.filter(value => value !== item))
    }

    return (
        <div className='dropdown-container' style={{ ...style, width: size ? size : '10vw' }}>
            {label ?
                <h4 className='dropdown-label' style={{
                    opacity: hidden && hidden.includes(label) && '.2',
                    fontSize: fontSize ? `${fontSize - fontSize * 0.1}vw` : '.8vw'
                }}>
                    {label || ''}
                </h4> : ''}
            <div className='dropdown-select-section'>
                <div
                    className='dropdown-select'
                    style={{
                        border: openDrop && (!hidden || !hidden.includes(label)) && '1px solid #E4C69C',
                        width: size ? size : '10vw',
                        backgroundColor: label && hidden && hidden.includes(label) && '#fafafa',
                        padding: fontSize ? `${fontSize / 2}vw` : '.5vw'
                    }}
                    onClick={() => setOpenDrop(!openDrop)}>
                    <h4 className='dropdown-selected' style={{
                        opacity: hidden && hidden.includes(label) && '.2',
                        fontSize: fontSize ? `${fontSize}vw` : '1vw'
                    }}>
                        {value ? value : selected ? selected : placeholder ? placeholder : 'Select'}
                    </h4>
                    {hidden && label && hidden.includes(label) ?
                        <img
                            src={ShwoIcon}
                            className='hide-icon-dropdown'
                            onClick={() => showItem(label)}
                        />
                        : hidden && label ?
                            <img
                                src={HideIcon}
                                className='hide-icon-dropdown'
                                onClick={() => hideItem(label)}
                            />
                            : ''}
                    < h4 className='dropdown-chevron' style={{
                        opacity: hidden && hidden.includes(label) && '.2',
                        fontSize: fontSize ? `${fontSize}vw` : '1vw'
                    }}>▾</h4>
                </div>
                {openDrop && (!hidden || !hidden.includes(label)) ?
                    <div
                        className='dropdown-options'
                        style={{
                            border: openDrop && '1px solid #E4C69C',
                            borderTop: 'none',
                            width: size ? size : '10vw',
                            marginTop: fontSize ? `${fontSize * 2.1}vw` : '2.1vw'
                        }}>
                        {options.map((option, i) =>
                            option && option !== '' &&
                            <h4
                                key={i}
                                className='dropdown-option'
                                style={{ borderTop: i === 0 && 'none' }}
                                onClick={() => {
                                    updateData(name, option, index)
                                    setSelected(option)
                                    if (items && setItems) {
                                        let newItems = items
                                        newItems.push(option)
                                        setItems([...new Set(newItems)])
                                    }
                                    setOpenDrop(false)
                                }}>{option}</h4>
                        )}
                    </div>
                    : ''}
            </div>
        </div >
    )
}
