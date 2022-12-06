import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAppData } from '../../store/reducers/appData'
import Dropdown from '../Dropdown'
import './styles.css'

export default function PostSection(props) {

    const [data, setData] = useState({})
    const [editPost, seteditPost] = useState(false)
    const [selected, setSelected] = useState({})
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [appData, setAppData] = useState([])
    const [allTools, setAllTools] = useState([])
    const [filteredTools, setFilteredTools] = useState([])
    const [tools, setTools] = useState([])
    const [fields, setFields] = useState([])
    const dispatch = useDispatch()

    const {
        label,
        items,
        setItems
    } = props

    useEffect(() => {
        const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        pullAppData(localUser.email)
    }, [])

    useEffect(() => {
        if (data.field && allTools.length) {
            const _filtered = allTools.map(tool => {
                if (tool.field === data.field || tool.type === data.field) return tool.name
            })
            setFilteredTools([...new Set(_filtered)])
        }
    }, [data.field])

    useEffect(() => {
        if (appData.length) {
            let _tools = []
            appData.forEach(data => {
                if (data.type === 'tools') _tools = JSON.parse(data.data) || []
            })
            setAllTools(_tools)
            const _fields = _tools.map(t => t.field).concat(_tools.map(t => t.type))
            setFields([...new Set(_fields)])
            setFilteredTools(_tools.map(t => t.name))
        }
    }, [appData])

    const pullAppData = async email => {
        try {
            const _appData = await dispatch(getAppData({ email })).then(data => data.payload)
            if (_appData) setAppData(_appData)
        } catch (err) { console.error(err) }
    }

    const addNewItem = () => {
        if (items[items.length - 1].role) {
            const newTools = [...tools]
            handleChange('tools', newTools, items.length - 1)
            setItems(items.concat({ bullets: [''] }))
            setTools([])
        }
    }

    const addNewBullet = (index, subindex) => {
        if (editPost) {
            if (selected.bullets[subindex]) {
                const newItem = { ...selected }
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
            const newItem = { ...selected }
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
        const newTools = [...tools]
        newItemsArr[selectedIndex] = selected
        newItemsArr[selectedIndex].tools = newTools
        setItems(newItemsArr)
        setTools([])
    }

    const bullets = ({ bullets }, index) => (
        <div className='bullet-container'>
            <h4 className='post-item-label'>Key responsibilities:</h4>
            {bullets && bullets.length ?
                bullets.map((item, subindex) =>
                    item && subindex !== bullets.length - 1 ?
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

    const removeTool = index => {
        let newTools = [...tools]
        newTools.splice(index, 1)
        setTools(newTools)
    }

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

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
                    <div className='post-tools'>
                        <h4 className='post-tools-title'>Tools & Tech</h4>
                        <div className='post-tools-row'>
                            <Dropdown
                                label='Select Field'
                                name='field'
                                options={fields}
                                value={data.field}
                                updateData={updateData}
                            />
                            <Dropdown
                                label='Add Tool'
                                name='tools'
                                options={filteredTools}
                                items={tools}
                                setItems={setTools}
                                value='Select'
                                updateData={updateData}
                            />
                            <input
                                className='post-manual-input'
                                onKeyDown={e => {
                                    if (e.key === 'Enter') setTools([...new Set(tools.concat(e.target.value))])
                                }}
                                placeholder='Add manually...'
                                type='text'
                            />
                        </div>
                        {tools.length ?
                            <div className='post-tools-list'>
                                {tools.map((tool, i) =>
                                    <div key={i} className='post-tool-div'>
                                        <h4 className='post-tool'>{tool}</h4>
                                        <h4 className='post-remove-tool' onClick={() => removeTool(i)}>X</h4>
                                    </div>
                                )}
                            </div> : ''}
                    </div>
                </div>
                <div className='section-item-btns'>
                    <h4 onClick={() => {
                        setSelected(null)
                        setSelectedIndex(null)
                        seteditPost(false)
                        setTools([])
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
                                    <div className='post-tools-and-tech'>
                                        <h4 className='post-technologies-text'>Tools & Tech:</h4>
                                        {item.tools && item.tools.length ?
                                            <div className='post-tools-and-tech-list'>
                                                {item.tools.map((tool, t) => <h4 key={t} className='post-tools-and-tech-div'>{tool}</h4>)}
                                            </div>
                                            : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='section-item-btns'>
                                <h4 onClick={() => {
                                    setSelected(item)
                                    setSelectedIndex(i)
                                    seteditPost(true)
                                    setTools(item.tools && item.tools.length ? item.tools : [])
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
                                <div className='post-tools'>
                                    <h4 className='post-tools-title'>Tools & Tech</h4>
                                    <div className='post-tools-row'>
                                        <Dropdown
                                            label='Select Field'
                                            name='field'
                                            options={fields}
                                            value={data.field}
                                            updateData={updateData}
                                        />
                                        <Dropdown
                                            label='Add Tool'
                                            name='tools'
                                            options={filteredTools}
                                            items={tools}
                                            setItems={setTools}
                                            value='Select'
                                            updateData={updateData}
                                        />
                                        <input
                                            className='post-manual-input'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') setTools([...new Set(tools.concat(e.target.value))])
                                            }}
                                            placeholder='Add manually...'
                                            type='text'
                                        />
                                    </div>
                                    {tools.length ?
                                        <div className='post-tools-list'>
                                            {tools.map((tool, i) =>
                                                <div key={i} className='post-tool-div'>
                                                    <h4 className='post-tool'>{tool}</h4>
                                                    <h4 className='post-remove-tool' onClick={() => removeTool(i)}>X</h4>
                                                </div>
                                            )}
                                        </div> : ''}
                                </div>
                            </div>
                            <h4 onClick={() => addNewItem()} className='section-item-new'>Add</h4>
                        </div>
                ) : ''}
        </div>

}
