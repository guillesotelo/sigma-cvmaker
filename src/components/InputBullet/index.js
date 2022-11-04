import React from 'react'
import './styles.css'

export default function InputBullet(props) {

    const {
        label,
        items,
        setItems,
        bulletPlaceholder,
        valuePlaceholder
    } = props

    const addNewItem = () => {
        if (items[items.length - 1]) {
            setItems(items.concat({ bullet: '', value: '' }))
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        setItems(newItemsArr)
    }

    const handleChange = (type, newValue, index) => {
        let newItemsArr = items
        if (type === 'bullet') newItemsArr[index] = { ...newItemsArr[index], bullet: newValue }
        if (type === 'value') newItemsArr[index] = { ...newItemsArr[index], value: newValue }
        setItems(newItemsArr)
    }

    return (
        <div className='bullet-container'>
            <h4 className='item-label'>{label || ''}</h4>
            {items && items.length ?
                items.map((item, i) =>
                    item.bullet ?
                        <div className='bullet-row' key={i}>
                            <h4 className='bullet'>{item.bullet}</h4>
                            <h4 className='bullet-text'>{item.value}</h4>
                            <h4 onClick={() => removeItem(i)} className='item-dropdown-remove'>X</h4>
                        </div>
                        :
                        <div className='bullet-row' key={i}>
                            <input
                                className='item-dropdown-name'
                                onChange={e => handleChange('bullet', e.target.value, i)}
                                placeholder={bulletPlaceholder || ''}
                                type='text'
                            />                            <input
                                className='item-dropdown-name'
                                onChange={e => handleChange('value', e.target.value, i)}
                                placeholder={valuePlaceholder || ''}
                                type='text'
                            />
                            <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                        </div>
                ) : ''}
        </div>
    )
}
