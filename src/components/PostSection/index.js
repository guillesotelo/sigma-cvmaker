import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAppData } from '../../store/reducers/appData'
import Dropdown from '../Dropdown'
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import { APP_COLORS } from '../../constants/app'
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import UpIcon from '../../icons/up-icon.svg'
import DownIcon from '../../icons/down-icon.svg'
import './styles.css'

export default function PostSection(props) {
    const [data, setData] = useState({})
    const [editPost, seteditPost] = useState(false)
    const [selected, setSelected] = useState({})
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [appData, setAppData] = useState([])
    const [allTools, setAllTools] = useState([])
    const [filteredTools, setFilteredTools] = useState([])
    const [tech, setTech] = useState([])
    const [fields, setFields] = useState([])
    const dispatch = useDispatch()

    const {
        label,
        items,
        setItems,
        hidden,
        setHidden,
        id
    } = props

    // console.log("hidden", hidden)

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
            const newTech = [...tech]
            handleChange('technologies', newTech, items.length - 1)
            setItems(items.concat({ bullets: [''] }))
            setTech([])
        }
    }

    const addNewBullet = (index, subindex) => {
        if (editPost) {
            if (selected.bullets[subindex]) {
                const newItem = { ...selected }
                newItem.bullets = newItem.bullets.concat([{ value: '' }])
                setSelected(newItem)
            }
        } else {
            if (items[index].bullets[subindex]) {
                const newItems = [...items]
                newItems[index].bullets = newItems[index].bullets.concat([{ value: '' }])
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
                newBullets[subindex] = { ...newBullets[subindex], value: newValue }
                const newItem = { ...selected, [type]: newBullets }
                setSelected(newItem)
            } else {
                const newBullets = newItemsArr[index].bullets
                newBullets[subindex] = { ...newBullets[subindex], value: newValue }
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
            newBullets[subindex] = { ...newBullets[subindex], value: newValue }
            newItem = { ...newItem, [type]: newBullets }
            setSelected(newItem)
        } else {
            newItem = { ...newItem, [type]: newValue }
            setSelected(newItem)
        }
    }

    const saveUpdatedItem = () => {
        const newItemsArr = items
        const newTech = [...tech]
        newItemsArr[selectedIndex] = selected
        newItemsArr[selectedIndex].technologies = newTech
        setItems(newItemsArr)
        setTech([])
    }

    const hideItem = (index, item) => {
        if (item) {
            const _hidden = { ...hidden }
            _hidden.postSection[index] = Array.isArray(_hidden.postSection[index]) ? _hidden.postSection[index].concat(item) : [item]
            setHidden(_hidden)
        }
    }

    const showItem = (index, item) => {
        if (item) {
            const _hidden = { ...hidden }
            _hidden.postSection[index] = _hidden.postSection[index].filter(value => value !== item)
            setHidden(_hidden)
        }
    }

    const hideBullet = (index, subindex) => {
        let newItemsArr = [...items]
        const newBullets = newItemsArr[index].bullets
        newBullets[subindex] = { ...newBullets[subindex], hidden: 'true' }
        newItemsArr[index] = { ...newItemsArr[index], bullets: newBullets }
        setItems(newItemsArr)
    }

    const showBullet = (index, subindex) => {
        let newItemsArr = [...items]
        const newBullets = newItemsArr[index].bullets
        newBullets[subindex] = { ...newBullets[subindex], hidden: '' }
        newItemsArr[index] = { ...newItemsArr[index], bullets: newBullets }
        setItems(newItemsArr)
    }

    const bullets = ({ bullets }, index) => (
        <div className='bullet-container'>
            <h4 className='post-item-label'>Key responsibilities:</h4>
            {bullets && bullets.length ?
                bullets.map((item, subindex) =>
                    item.value && subindex !== bullets.length - 1 ?
                        <div className='bullet-row' key={subindex}>
                            <h4 className='bullet' style={{ opacity: item.hidden && '.2' }}>●</h4>
                            <h4 className='bullet-text' style={{ opacity: item.hidden && '.2' }}>{item.value || ''}</h4>
                            <h4 onClick={() => removeBullet(index, subindex)} className='item-dropdown-remove'>X</h4>
                            {item.hidden ?
                                <img
                                    src={ShwoIcon}
                                    className='hide-icon-item'
                                    onClick={() => showBullet(index, subindex)}
                                />
                                :
                                <img
                                    src={HideIcon}
                                    className='hide-icon-item'
                                    onClick={() => hideBullet(index, subindex)}
                                />
                            }
                        </div>
                        :
                        <div className='bullet-row' key={subindex} style={{ marginTop: '1vw' }}>
                            <h4 className='bullet'>●</h4>
                            <input
                                className='item-dropdown-name'
                                onChange={e => handleChange('bullets', e.target.value, index, subindex)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && e.target.value) {
                                        addNewBullet(index, subindex)
                                        setTimeout(() => document.getElementById(id).focus(), 250)
                                    }
                                }} placeholder='Write responsibilty'
                                type='text'
                                id={id}
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

    const removeTech = index => {
        let newTech = [...tech]
        newTech.splice(index, 1)
        setTech(newTech)
    }

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const moveSection = (fromIndex, toIndex) => {
        let newArr = [...items]

        if (toIndex >= 0 && toIndex < newArr.length - 1) {
            if (checkHiddenPost(toIndex)) {
                if (toIndex > fromIndex && toIndex + 1 < newArr.length - 1) {
                    let count = 1
                    while (checkHiddenPost(toIndex + count) && toIndex + count < newArr.length - 1) count++
                    if (count !== 0 && Object.keys(newArr[toIndex + count]).length > 1) {
                        [newArr[fromIndex], newArr[toIndex + count]] = [newArr[toIndex + count], newArr[fromIndex]]
                    }
                } else if (toIndex < fromIndex && toIndex - 1 >= 0) {
                    let count = -1
                    while (checkHiddenPost(toIndex + count) && toIndex + count >= 0) count--
                    if (count !== 0 && newArr[toIndex + count]) {
                        [newArr[fromIndex], newArr[toIndex + count]] = [newArr[toIndex + count], newArr[fromIndex]]
                    }
                }
            } else {
                [newArr[fromIndex], newArr[toIndex]] = [newArr[toIndex], newArr[fromIndex]]
            }
            setItems(newArr)
        }
    }

    const hidePostSection = index => {
        const { postSection } = hidden
        postSection.sections = { ...postSection.sections, [index]: 'true' }
        setHidden({ ...hidden, postSection })
    }

    const showPostSection = index => {
        const { postSection } = hidden
        postSection.sections = { ...postSection.sections, [index]: '' }
        setHidden({ ...hidden, postSection })
    }

    const checkHiddenPost = index => {
        const { postSection } = hidden
        return postSection && postSection.sections && postSection.sections[index]
    }

    return editPost ?
        <div className='post-container'>
            <h4 className='post-item-label'>{label || ''}</h4>
            <div className='post-column'>
                <div className='post-col-dif'>
                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                        <h4 style={{ color: APP_COLORS.GRAY, opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Period') && '.2' }} className='post-label'>Period</h4>
                        <div className='input-hide-row'>
                            <input
                                className='section-item-name'
                                onChange={e => handleUpdate('period', e.target.value)}
                                placeholder='2020 - 2022'
                                type='text'
                                value={selected.period || ''}
                                style={{ opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Period') && '.2' }}
                            />
                            {hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Period') ?
                                <img
                                    src={ShwoIcon}
                                    className='hide-icon-post'
                                    onClick={() => showItem(selectedIndex, 'Period')}
                                />
                                :
                                <img
                                    src={HideIcon}
                                    className='hide-icon-post'
                                    onClick={() => hideItem(selectedIndex, 'Period')}
                                />
                            }
                        </div>
                    </GrammarlyEditorPlugin>
                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                        <h4 style={{ color: APP_COLORS.GRAY, opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Company name') && '.2' }} className='post-label'>Company name</h4>
                        <div className='input-hide-row'>
                            <input
                                className='section-item-name'
                                onChange={e => handleUpdate('company', e.target.value)}
                                placeholder='Sigma Connectivity Engineering'
                                type='text'
                                value={selected.company || ''}
                                style={{ opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Company name') && '.2' }}
                            />
                            {hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Company name') ?
                                <img
                                    src={ShwoIcon}
                                    className='hide-icon-post'
                                    onClick={() => showItem(selectedIndex, 'Company name')}
                                />
                                :
                                <img
                                    src={HideIcon}
                                    className='hide-icon-post'
                                    onClick={() => hideItem(selectedIndex, 'Company name')}
                                />
                            }
                        </div>
                    </GrammarlyEditorPlugin>
                </div>
                <div className='post-col-dif'>
                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                        <h4 style={{ color: APP_COLORS.GRAY, opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Role title') && '.2' }} className='post-label'>Role title</h4>
                        <div className='input-hide-row'>
                            <input
                                className='section-item-name'
                                onChange={e => handleUpdate('role', e.target.value)}
                                placeholder='Android Developer'
                                type='text'
                                value={selected.role || ''}
                                style={{ opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Role title') && '.2' }}
                            />
                            {hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Role title') ?
                                <img
                                    src={ShwoIcon}
                                    className='hide-icon-post'
                                    onClick={() => showItem(selectedIndex, 'Role title')}
                                />
                                :
                                <img
                                    src={HideIcon}
                                    className='hide-icon-post'
                                    onClick={() => hideItem(selectedIndex, 'Role title')}
                                />
                            }
                        </div>
                    </GrammarlyEditorPlugin>
                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                        <h4 style={{ color: APP_COLORS.GRAY, opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Job / Tasks description') && '.2' }} className='post-label'>Job / Tasks description</h4>
                        <div className='input-hide-row'>
                            <textarea
                                className='section-item-name'
                                onChange={e => handleUpdate('description', e.target.value)}
                                placeholder='As a Android Developer, Anna was a part of a great team of.. and made...'
                                type='textarea'
                                cols={10}
                                rows={10}
                                value={selected.description || ''}
                                style={{ opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Job / Tasks description') && '.2' }}
                            />
                            {hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes('Job / Tasks description') ?
                                <img
                                    src={ShwoIcon}
                                    className='hide-icon-post-textarea'
                                    onClick={() => showItem(selectedIndex, 'Job / Tasks description')}
                                />
                                :
                                <img
                                    src={HideIcon}
                                    className='hide-icon-post-textarea'
                                    onClick={() => hideItem(selectedIndex, 'Job / Tasks description')}
                                />
                            }
                        </div>
                    </GrammarlyEditorPlugin>
                </div>
                <div className='post-col-dif'>
                    {bullets(selected, selectedIndex)}
                </div>
                <div className='post-col-dif'>
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
                                label='Select Tool'
                                name='tools'
                                options={filteredTools}
                                items={tech}
                                setItems={setTech}
                                value='Select'
                                updateData={updateData}
                            />
                            <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                                <h4 style={{ color: APP_COLORS.GRAY }} className='post-label'>Add manually</h4>
                                <input
                                    className='post-manual-input'
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && e.target.value) setTech([...new Set(tech.concat(e.target.value))])
                                    }}
                                    placeholder='e.g: C++'
                                    type='text'
                                />
                            </GrammarlyEditorPlugin>
                        </div>
                        {Array.isArray(tech) ?
                            <div className='post-tools-list'>
                                {tech.map((tool, i) =>
                                    <div key={i} className='post-tool-div' style={{ backgroundColor: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes(tool) && '#fafafa' }}>
                                        <h4 className='post-tool' style={{ opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes(tool) && '.2' }}>{tool}</h4>
                                        <h4 className='post-remove-tool' style={{ opacity: hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes(tool) && '.2' }} onClick={() => removeTech(i)}>X</h4>
                                        {hidden.postSection[selectedIndex] && hidden.postSection[selectedIndex].includes(tool) ?
                                            <img
                                                src={ShwoIcon}
                                                className='hide-icon-tool'
                                                onClick={() => showItem(selectedIndex, tool)}
                                            />
                                            :
                                            <img
                                                src={HideIcon}
                                                className='hide-icon-tool'
                                                onClick={() => hideItem(selectedIndex, tool)}
                                            />
                                        }
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
                        setTech([])
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
                                {hidden.postSection[i] && hidden.postSection[i].includes('Period') ? <h4 className='post-period'> </h4> : <h4 className='post-period' style={{ display: checkHiddenPost(i) && 'none' }}>{item.period}</h4>}
                                <div className='post-column' style={{ display: checkHiddenPost(i) && 'none' }}>
                                    {hidden.postSection[i] && hidden.postSection[i].includes('Company name') ? '' : <h4 className='post-company'>{item.company}</h4>}
                                    {hidden.postSection[i] && hidden.postSection[i].includes('Role title') ? '' : <h4 className='post-role'>{item.role}</h4>}
                                    {hidden.postSection[i] && hidden.postSection[i].includes('Job / Tasks description') ? '' : <h4 className='post-description'>{item.description}</h4>}
                                    <div className='post-responsabilities'>
                                        <h4 className='post-responsabilities-text'>Key Responsibilities:</h4>
                                        {item.bullets.map((bullet, j) =>
                                            bullet.value && <h4 className='post-responsability' key={j} style={{ display: bullet.hidden && 'none' }}>● {bullet.value}</h4>
                                        )}
                                    </div>
                                    <div className='post-tools-and-tech'>
                                        <h4 className='post-technologies-text'>Tools & Tech:</h4>
                                        {item.technologies && Array.isArray(item.technologies) ?
                                            <div className='post-tools-and-tech-list'>
                                                {item.technologies.map((tec, t) =>
                                                    hidden.postSection[i] && hidden.postSection[i].includes(tec) ? ''
                                                        : <h4 key={t} className='post-tools-and-tech-div'>{tec}</h4>)}
                                            </div>
                                            : ''
                                        }
                                    </div>
                                </div>
                                <div className='post-control-btns'>
                                    {!checkHiddenPost(i) ?
                                        <img
                                            src={UpIcon}
                                            className='post-control-icon'
                                            onClick={() => moveSection(i, i - 1)}
                                        />
                                        : ''}
                                    {checkHiddenPost(i) ?
                                        <img
                                            src={ShwoIcon}
                                            className='post-control-icon'
                                            onClick={() => showPostSection(i)}
                                        />
                                        :
                                        <img
                                            src={HideIcon}
                                            className='post-control-icon'
                                            onClick={() => hidePostSection(i)}
                                        />}
                                    {!checkHiddenPost(i) ?
                                        <img
                                            src={DownIcon}
                                            className='post-control-icon'
                                            onClick={() => moveSection(i, i + 1)}
                                        />
                                        : ''}
                                </div>
                            </div>
                            <div className='section-item-btns' style={{ display: checkHiddenPost(i) && 'none' }}>
                                <h4 onClick={() => {
                                    setSelected(item)
                                    setSelectedIndex(i)
                                    seteditPost(true)
                                    setTech(item.technologies && item.technologies.length ? item.technologies : [])
                                }}
                                    className='section-item-remove'>Edit</h4>
                                <h4 onClick={() => removeItem(i)} className='section-item-remove'>Remove</h4>
                            </div>
                        </div>
                        :
                        <div className='post-column' key={i} style={experienceItem(i)}>
                            <div className='post-col-dif'>
                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                                    <h4 style={{ color: APP_COLORS.GRAY }} className='post-label'>Period</h4>
                                    <input
                                        className='section-item-name'
                                        onChange={e => handleChange('period', e.target.value, i)}
                                        placeholder='2020 - 2022'
                                        type='text'
                                    />
                                </GrammarlyEditorPlugin>
                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                                    <h4 style={{ color: APP_COLORS.GRAY }} className='post-label'>Company name</h4>
                                    <input
                                        className='section-item-name'
                                        onChange={e => handleChange('company', e.target.value, i)}
                                        placeholder='Sigma Connectivity Engineering'
                                        type='text'
                                    />
                                </GrammarlyEditorPlugin>
                            </div>
                            <div className='post-col-dif'>
                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                                    <h4 style={{ color: APP_COLORS.GRAY }} className='post-label'>Role title</h4>
                                    <input
                                        className='section-item-name'
                                        onChange={e => handleChange('role', e.target.value, i)}
                                        placeholder='Android Developer'
                                        type='text'
                                    />
                                </GrammarlyEditorPlugin>
                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                                    <h4 style={{ color: APP_COLORS.GRAY }} className='post-label'>Job / Tasks description</h4>
                                    <textarea
                                        className='section-item-name'
                                        onChange={e => handleChange('description', e.target.value, i)}
                                        placeholder='As a Android Developer, Anna was a part of a great team of.. and made...'
                                        type='textarea'
                                        cols={10}
                                        rows={10}
                                    />
                                </GrammarlyEditorPlugin>
                            </div>
                            <div className='post-col-dif'>
                                {bullets(item, i)}
                            </div>
                            <div className='post-col-dif'>
                                <div className='post-tools'>
                                    <h4 className='post-tools-title'>Tools & Tech</h4>
                                    <div className='post-tools-row'>
                                        <Dropdown
                                            label='Select Field'
                                            name='field'
                                            options={fields}
                                            value={data.field}
                                            updateData={updateData}
                                            size='10vw'
                                        />
                                        <Dropdown
                                            label='Add Tool'
                                            name='tools'
                                            options={filteredTools}
                                            items={tech}
                                            setItems={setTech}
                                            value='Select'
                                            updateData={updateData}
                                            size='10vw'
                                        />
                                        <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "20%" }}>
                                            <input
                                                className='post-manual-input'
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && e.target.value) {
                                                        setTech([...new Set(tech.concat(e.target.value))])
                                                        e.target.value = ''
                                                    }
                                                }}
                                                placeholder='e.g: C++'
                                                type='text'
                                            />
                                        </GrammarlyEditorPlugin>
                                    </div>
                                    {tech.length ?
                                        <div className='post-tools-list'>
                                            {tech.map((tec, i) =>
                                                <div key={i} className='post-tool-div' style={{ backgroundColor: hidden.postSection[i] && hidden.postSection[i].includes(tec) && '#e5e5e5' }}>
                                                    <h4 className='post-tool' style={{ opacity: hidden.postSection[i] && hidden.postSection[i].includes(tec) && '.2' }}>{tec}</h4>
                                                    <h4 className='post-remove-tool' style={{ opacity: hidden.postSection[i] && hidden.postSection[i].includes(tec) && '.2' }} onClick={() => removeTech(i)}>X</h4>
                                                    {hidden.postSection[i] && hidden.postSection[i].includes(tec) ?
                                                        <img
                                                            src={ShwoIcon}
                                                            className='hide-icon-tool'
                                                            onClick={() => showItem(i, tec)}
                                                        />
                                                        :
                                                        <img
                                                            src={HideIcon}
                                                            className='hide-icon-tool'
                                                            onClick={() => hideItem(i, tec)}
                                                        />
                                                    }
                                                </div>
                                            )}
                                        </div> : ''}
                                </div>
                            </div>
                            <h4 onClick={() => addNewItem()} className='section-item-new'>Add experience</h4>
                        </div>
                ) : ''}
        </div>

}
