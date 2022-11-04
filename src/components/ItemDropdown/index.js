import React, { useEffect, useState } from 'react'
import './styles.css'

export default function ItemDropdown(props) {

    const {
        label,
        items,
        setItems,
        options,
        style,
        type,
        placeholder
    } = props

    useEffect(() => {
        renderItems(items)
    }, [items])

    const handleChange = (type, newValue, index) => {
        let newItemsArr = items
        if (type === 'name') newItemsArr[index] = { ...newItemsArr[index], name: newValue }
        if (type === 'option') newItemsArr[index] = { ...newItemsArr[index], option: newValue }
        setItems(newItemsArr)
    }

    const addNewItem = () => {
        if (items[items.length - 1].name) {
            setItems(items.concat({ name: '' }))
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        if (!newItemsArr.length) setItems([{ name: '' }])
        else setItems(newItemsArr)
    }

    const renderItems = itemsArr => {
        return (
            itemsArr.map((item, i, fullArr) =>
                <div key={i} className='item-dropdown-row'>
                    {item.name && fullArr.length > 1 ?
                        <div className='item-dropdown-blocked'>
                            <h4 className='item-dropdown-name'>{item.name}</h4>
                            <h4 className='item-dropdown-select'>{item.option || '-'}</h4>
                            <h4 onClick={() => removeItem(i)} className='item-dropdown-remove'>X</h4>
                        </div>
                        :
                        <>
                            <input
                                className='item-dropdown-name'
                                autoComplete={item.autoComplete || null}
                                onChange={e => handleChange('name', e.target.value, i)}
                                placeholder={placeholder || ''}
                                type={type || 'text'}
                                style={style || null}
                            />
                            <select className='item-dropdown-select' defaultValue='Select one' onChange={e => handleChange('option', e.target.value, i)}>
                                <option value="" hidden>Select one</option>
                                {options && options.length ? options.map((op, j) =>
                                    <option key={j} defaultValue='Select one' className='item-dropdown-option'>{op}</option>)
                                    : ''}
                            </select>
                            <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                        </>
                    }
                </div>
            )
        )
    }

    return (
        <div className='item-dropdown'>
            <h4 className='item-label'>{label || ''}</h4>
            {renderItems(items)}
        </div>
    )
}
