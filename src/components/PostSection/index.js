import React from 'react'
import './styles.css'

export default function PostSection(props) {

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
        if (items[index].bullets[subindex]) {
            const newItems = [...items]
            newItems[index].bullets = newItems[index].bullets.concat([''])
            setItems(newItems)
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        setItems(newItemsArr)
    }

    const removeBullet = (index, subindex) => {
        const newItemsArr = [...items]
        newItemsArr[index].bullets.splice(subindex, 1)
        setItems(newItemsArr)
    }

    const handleChange = (type, newValue, index, subindex) => {
        let newItemsArr = items
        if (type === 'bullets') {
            const newBullets = newItemsArr[index].bullets
            newBullets[subindex] = newValue
            newItemsArr[index] = { ...newItemsArr[index], [type]: newBullets }
            setItems(newItemsArr)
        } else {
            newItemsArr[index] = { ...newItemsArr[index], [type]: newValue }
            setItems(newItemsArr)
        }
    }

    const bullets = ({ bullets }, index) => (
        <div className='bullet-container'>
            <h4 className='item-label'>Key responsibilities:</h4>
            {bullets && bullets.length ?
                bullets.map((item, subindex) =>
                    item ?
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

    return (
        <div className='post-container'>
            <h4 className='item-label'>{label || ''}</h4>
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
                            <h4 onClick={() => removeItem(i)} className='section-item-remove'>Remove</h4>
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
    )
}
