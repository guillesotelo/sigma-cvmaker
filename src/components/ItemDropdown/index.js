import React, { useState } from 'react'
import './styles.css'

export default function ItemDropdown(props) {

    const {
        label,
        name,
        options,
        updateData,
        items,
        setItems
    } = props

    const handleChange = (newValue) => {
        const { value } = newValue.target
        updateData(label, { [name]: value })
    }

    const addNewItem = () => {
        const newItemsArr = items
        newItemsArr.push({ 
            name: 'New',
            op: 'op'
        })
        setItems(newItemsArr)
    }

    return (
        <div className='item-dropdown'>
            <h4 className='item-dropdown-label'>{label}</h4>
            {name ?
                <div className='item-dropdown-row'>
                    <h4 className='item-dropdown-name'>{name}:</h4>
                    <select className='item-dropdown-select' onChange={handleChange}>
                        {options && options.length ? options.map((op, i) =>
                            <option key={i} className='item-dropdown-option'>{op}</option>)
                            : ''}
                    </select>
                </div>
                :
                <div onClick={addNewItem} className='item-dropdown-row' style={{ cursor: 'pointer' }}>
                    Add new
                </div>
            }
        </div>
    )
}
