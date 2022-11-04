import React from 'react'
import './styles.css'

export default function Bullet(props) {

    const bullets = {
        normal: '•',
        small: '·',
        big: '●',
        square: '∙',
        bigsquare: '■',
        eye: '⊙',
        bigeye: '◉'
    }

    const {
        label,
        type,
        items,
        setItems,
        placeholder
    } = props

    const addNewItem = () => {
        if (items[items.length - 1]) {
            setItems(items.concat(''))
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        setItems(newItemsArr)
    }

    const handleChange = (newValue, index) => {
        let newItemsArr = items
        newItemsArr[index] = newValue
        setItems(newItemsArr)
    }

    return (
        <div className='bullet-container'>
            <h4 className='item-label'>{label || ''}</h4>
            {items && items.length ?
                items.map((item, i) =>
                    item ?
                        <div className='bullet-row' key={i}>
                            <h4 className='bullet'>{bullets[type] || '•'}</h4>
                            <h4 className='bullet-text'>{item || ''}</h4>
                            <h4 onClick={() => removeItem(i)} className='item-dropdown-remove'>X</h4>
                        </div>
                        :
                        <div className='bullet-row' key={i}>
                            <h4 className='bullet'>{bullets[type]}</h4>
                            <input
                                className='item-dropdown-name'
                                onChange={e => handleChange(e.target.value, i)}
                                placeholder={placeholder || ''}
                                type='text'
                            />
                            <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                        </div>
                ) : ''}
        </div>
    )
}
