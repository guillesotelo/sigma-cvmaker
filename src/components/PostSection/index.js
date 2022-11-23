import React, { useEffect, useState } from 'react'
import './styles.css'

export default function PostSection(props) {

    const [editPost, seteditPost] = useState(false)
    const [selected, setSelected] = useState({})
    const [selectedIndex, setSelectedIndex] = useState(null)

    const {
        label,
        items,
        setItems
    } = props

    const addNewItem = () => {
        if (items[items.length - 1].role) {
            setItems(items.concat({ bullets: [''] }))
        }
    }

    const addNewBullet = (index, subindex) => {
        if (editPost) {
            if (selected.bullets[subindex]) {
                const newItem = {...selected}
                newItem.bullets = newItem.bullets.concat([''])
                setSelected(newItem)
            }
        } else {
            if (items[index].bullets[subindex]) {
                const newItems = [...items]
                newItems[index].bullets = newItems[index].bullets.concat([''])
                setItems(newItems)
            }
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        setItems(newItemsArr)
    }

    const removeBullet = (index, subindex) => {
        if (editPost) {
            const newItem = {...selected}
            newItem.bullets.splice(subindex, 1)
            setSelected(newItem)
        } else {
            const newItemsArr = [...items]
            newItemsArr[index].bullets.splice(subindex, 1)
            setItems(newItemsArr)
        }
    }

    const handleChange = (type, newValue, index, subindex) => {
        let newItemsArr = items
        if (type === 'bullets') {
            if (editPost) {
                const newBullets = selected.bullets
                newBullets[subindex] = newValue
                const newItem = { ...selected, [type]: newBullets }
                setSelected(newItem)
            } else {
                const newBullets = newItemsArr[index].bullets
                newBullets[subindex] = newValue
                newItemsArr[index] = { ...newItemsArr[index], [type]: newBullets }
                setItems(newItemsArr)
            }
        } else {
            newItemsArr[index] = { ...newItemsArr[index], [type]: newValue }
            setItems(newItemsArr)
        }
    }

    const handleUpdate = (type, newValue, index, subindex) => {
        let newItem = selected
        if (type === 'bullets') {
            const newBullets = newItem.bullets
            newBullets[subindex] = newValue
            newItem = { ...newItem, [type]: newBullets }
            setSelected(newItem)
        } else {
            newItem = { ...newItem, [type]: newValue }
            setSelected(newItem)
        }
    }

    const saveUpdatedItem = () => {
        const newItemsArr = items
        newItemsArr[selectedIndex] = selected
        setItems(newItemsArr)
    }

    const bullets = ({ bullets }, index) => (
        <div className='bullet-container'>
            <h4 className='post-item-label'>Key responsibilities:</h4>
            {bullets && bullets.length ?
                bullets.map((item, subindex) =>
                    item && subindex !== bullets.length -1 ?
                        <div className='bullet-row' key={subindex}>
                            <h4 className='bullet'>●</h4>
                            <h4 className='bullet-text'>{item || ''}</h4>
                            <h4 onClick={() => removeBullet(index, subindex)} className='item-dropdown-remove'>X</h4>
                        </div>
                        :
                        <div className='bullet-row' key={subindex} style={{ marginTop: '1vw' }}>
                            <h4 className='bullet'>●</h4>
                            <input
                                className='item-dropdown-name'
                                onChange={e => handleChange('bullets', e.target.value, index, subindex)}
                                placeholder='Write responsibilty'
                                type='text'
                                // value={editPost ? selected.bullets[subindex] : item}
                            />
                            <h4 onClick={() => addNewBullet(index, subindex)} className='item-dropdown-new'>✓</h4>
                        </div>
                ) : ''}
        </div>
    )

    const experienceItem = (index) => index !== 0 ? {
        borderTop: '1px solid gray',
        paddingTop: '2vw',
        margin: '1vw 0'
    } : {}

    return editPost ?
        <div className='post-container'>
            <h4 className='post-item-label'>{label || ''}</h4>
            <div className='post-column'>
                <div className='post-row'>
                    <input
                        className='section-item-name'
                        onChange={e => handleUpdate('period', e.target.value)}
                        placeholder='Period'
                        type='text'
                        value={selected.period || ''}
                    />
                    <input
                        className='section-item-name'
                        onChange={e => handleUpdate('company', e.target.value)}
                        placeholder='Company Title'
                        type='text'
                        value={selected.company || ''}
                    />
                </div>
                <div className='post-row'>
                    <input
                        className='section-item-name'
                        onChange={e => handleUpdate('role', e.target.value)}
                        placeholder='Role Title'
                        type='text'
                        value={selected.role || ''}
                    />
                    <textarea
                        className='section-item-name'
                        onChange={e => handleUpdate('description', e.target.value)}
                        placeholder='Describe job / tasks'
                        type='textarea'
                        cols={10}
                        rows={10}
                        value={selected.description || ''}
                    />
                </div>
                <div className='post-row'>
                    {bullets(selected, selectedIndex)}
                </div>
                <div className='post-row'>
                    <textarea
                        className='section-item-name'
                        onChange={e => handleUpdate('technologies', e.target.value)}
                        placeholder='Technologies used'
                        type='textarea'
                        cols={10}
                        rows={3}
                        value={selected.technologies || ''}
                    />
                </div>
                <div className='section-item-btns'>
                    <h4 onClick={() => {
                        setSelected(null)
                        setSelectedIndex(null)
                        seteditPost(false)
                    }}
                        className='section-item-new'>Discard</h4>
                    <h4 onClick={() => {
                        saveUpdatedItem()
                        setSelected(null)
                        setSelectedIndex(null)
                        seteditPost(false)
                    }}
                        className='section-item-new'>Save</h4>
                </div>
            </div>
        </div>
        :
        <div className='post-container'>
            <h4 className='post-item-label'>{label || ''}</h4>
            {items && items.length ?
                items.map((item, i) =>
                    i < items.length - 1 && items.length > 1 ?
                        <div className='post-column' key={i} style={experienceItem(i)}>
                            <div className='post-row'>
                                <h4 className='post-period'>{item.period}</h4>
                                <div className='post-column'>
                                    <h4 className='post-company'>{item.company}</h4>
                                    <h4 className='post-role'>{item.role}</h4>
                                    <h4 className='post-description'>{item.description}</h4>
                                    <div className='post-responsabilities'>
                                        <h4 className='post-responsabilities-text'>Key Responsibilities:</h4>
                                        {item.bullets.map((bullet, j) =>
                                            bullet && <h4 className='post-responsability' key={j} >● {bullet}</h4>
                                        )}
                                    </div>
                                    <div className='post-row'>
                                        <h4 className='post-technologies-text'>Technologies:</h4>
                                        <h4 className='post-technologies'>{item.technologies}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className='section-item-btns'>
                                <h4 onClick={() => {
                                    setSelected(item)
                                    setSelectedIndex(i)
                                    seteditPost(true)
                                }}
                                    className='section-item-remove'>Edit</h4>
                                <h4 onClick={() => removeItem(i)} className='section-item-remove'>Remove</h4>
                            </div>
                        </div>
                        :
                        <div className='post-column' key={i} style={experienceItem(i)}>
                            <div className='post-row'>
                                <input
                                    className='section-item-name'
                                    onChange={e => handleChange('period', e.target.value, i)}
                                    placeholder='Period'
                                    type='text'
                                />
                                <input
                                    className='section-item-name'
                                    onChange={e => handleChange('company', e.target.value, i)}
                                    placeholder='Company Title'
                                    type='text'
                                />
                            </div>
                            <div className='post-row'>
                                <input
                                    className='section-item-name'
                                    onChange={e => handleChange('role', e.target.value, i)}
                                    placeholder='Role Title'
                                    type='text'
                                />
                                <textarea
                                    className='section-item-name'
                                    onChange={e => handleChange('description', e.target.value, i)}
                                    placeholder='Describe job / tasks'
                                    type='textarea'
                                    cols={10}
                                    rows={10}
                                />
                            </div>
                            <div className='post-row'>
                                {bullets(item, i)}
                            </div>
                            <div className='post-row'>
                                <textarea
                                    className='section-item-name'
                                    onChange={e => handleChange('technologies', e.target.value, i)}
                                    placeholder='Technologies used'
                                    type='textarea'
                                    cols={10}
                                    rows={3}
                                />
                            </div>
                            <h4 onClick={() => addNewItem()} className='section-item-new'>Add</h4>
                        </div>
                ) : ''}
        </div>

}
