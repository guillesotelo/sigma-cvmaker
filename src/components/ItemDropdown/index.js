import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import Dropdown from '../Dropdown';
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import EditIcon from '../../icons/edit-icon.svg'
import TrashCan from '../../icons/trash-icon.svg'
import './styles.css'
import { getAppData } from '../../store/reducers/appData';
import InputField from '../InputField';
import Tooltip from '../Tooltip';

export default function ItemDropdown(props) {
    const [dragging, setDragging] = useState(false)
    const [editSkills, setEditSkills] = useState(false)
    const [editItem, setEditItem] = useState({})
    const [selected, setSelected] = useState(-1)
    const [appData, setAppData] = useState([])
    const [skills, setSkills] = useState([])
    const [showDropDown, setShowDropDown] = useState(false)
    const [dropValue, setDropValue] = useState('')
    const [focus, setFocus] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const dispatch = useDispatch()
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))

    const {
        label,
        items,
        name,
        setItems,
        options,
        style,
        type,
        placeholder,
        fontSize
    } = props

    useEffect(() => {
        let isMounted = true
        pullAppData(isMounted)
        return () => { isMounted = false }
    }, [])

    useEffect(() => {
        if (!editItem.name) setShowDropDown(false)
        checkSuggestions(editItem.name)
    }, [editItem.name])

    useEffect(() => {
        renderItems(items)
        if (items.length) {
            const lastItem = items[items.length - 1]
            if (lastItem.name || lastItem.name !== '') addNewItem()
        }
    }, [items])

    useEffect(() => {
        if (appData.length) {
            let _skills = []
            appData.forEach(data => {
                if (data.type === 'skills') _skills = JSON.parse(data.data) || []
            })
            if (_skills.length) setSkills(_skills.map(skill => { if (skill.name) return skill.name }))
        }
    }, [appData])

    const pullAppData = async (isMounted) => {
        try {
            const _appData = await dispatch(getAppData({ email: user.email })).then(data => data.payload)
            if (_appData && isMounted) setAppData(_appData)
        } catch (err) { console.error(err) }
    }

    const handleChange = (type, newValue, index) => {
        let newItemsArr = items
        if (type === 'name') {
            if (!newValue) setShowDropDown(false)
            newItemsArr[index] = { ...newItemsArr[index], name: newValue }
            checkSuggestions(newValue)
        }
        if (type === 'option') newItemsArr[index] = { ...newItemsArr[index], option: newValue }
        setItems(newItemsArr)
    }

    const checkSuggestions = value => {
        if (value && skills && skills.length) {
            const matches = skills.filter(skill => skill.toLowerCase().includes(value.toLowerCase()) && skill)
            if (matches && matches.length && focus) {
                setShowDropDown(true)
                setSuggestions([...new Set(matches)])
            } else setShowDropDown(false)
        } else setShowDropDown(false)
        if (dropValue === value) setShowDropDown(false)
    }

    const addNewItem = () => {
        if (items[items.length - 1].name) {
            setItems(items.concat({ name: '' }))
            setDropValue('')
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        if (!newItemsArr.length) setItems([{ name: '' }])
        else setItems(newItemsArr)
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }

    const onDragEnd = result => {
        setDragging(false)
        if (!result.destination) return

        const orderedItems = reorder(
            items,
            result.source.index,
            result.destination.index
        )
        setItems(orderedItems)
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        background: isDragging ? "transparent" : "",
        ...draggableStyle
    })

    const hideItem = index => {
        let newItemsArr = [...items]
        newItemsArr[index] = { ...newItemsArr[index], hidden: 'true' }
        setItems(newItemsArr)
    }

    const showItem = index => {
        let newItemsArr = [...items]
        newItemsArr[index] = { ...newItemsArr[index], hidden: '' }
        setItems(newItemsArr)
    }

    const renderItems = itemsArr => {
        return (
            <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                <Droppable droppableId="droppable">
                    {(provided, _) =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {itemsArr.map((item, i) =>
                                selected === i ?
                                    <div key={i} className='item-dropdown-row'>
                                        <>
                                            <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                <input
                                                    className='item-dropdown-name'
                                                    autoComplete={item.autoComplete || null}
                                                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                                    placeholder={placeholder || ''}
                                                    type={type || 'text'}
                                                    style={{
                                                        ...style,
                                                        fontSize: fontSize ? `${fontSize - fontSize * 0.1}vw` : '.9vw'
                                                    }}
                                                    value={editItem.name || ''}
                                                />
                                            </GrammarlyEditorPlugin>
                                            <Dropdown
                                                label=''
                                                name='option'
                                                options={options}
                                                updateData={handleChange}
                                                index={i}
                                                style={{ margin: '0 .5vw' }}
                                                size='10vw'
                                            />
                                            <h4 onClick={() => {
                                                if (editItem.name) {
                                                    let newItemsArr = items
                                                    newItemsArr[i] = {
                                                        ...newItemsArr[i],
                                                        name: editItem.name || ''
                                                    }
                                                    setItems(newItemsArr)
                                                } else removeItem(i)
                                                setEditItem({})
                                                setSelected(-1)
                                            }} className='item-dropdown-new'>✓</h4>
                                        </>
                                    </div>
                                    :
                                    <div key={i} className='item-dropdown-row'>
                                        {item.name && itemsArr.length > 1 ?
                                            <Draggable key={i} draggableId={String(i)} index={i}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            ),
                                                            height: fontSize ? `${fontSize * 3}vw` : '3vw',
                                                        }}
                                                        className='item-dropdown-blocked draggable'>
                                                        <h4 className='item-dropdown-name' style={{
                                                            opacity: item.hidden && '.2',
                                                            fontSize: fontSize ? `${fontSize - fontSize * 0.1}vw` : '.9vw',
                                                            padding: fontSize ? `${fontSize / 2}vw` : '.5vw'
                                                        }}>{item.name}</h4>
                                                        <h4 className='item-dropdown-select' style={{
                                                            opacity: item.hidden && '.2',
                                                            fontSize: fontSize ? `${fontSize - fontSize * 0.1}vw` : '.9vw',
                                                            padding: fontSize ? `${fontSize / 2}vw` : '.5vw'
                                                        }}>{item.option || '-'}</h4>
                                                        <Tooltip tooltip='Edit'>
                                                            <img
                                                                src={EditIcon}
                                                                className='hide-icon-item edit-icon-item'
                                                                onClick={() => {
                                                                    setSelected(i)
                                                                    setEditItem(item)
                                                                }}
                                                            />
                                                        </Tooltip>
                                                        {item.hidden ?
                                                            <Tooltip tooltip='Show'>
                                                                <img
                                                                    src={ShwoIcon}
                                                                    className='hide-icon-item'
                                                                    onClick={() => showItem(i)}
                                                                />
                                                            </Tooltip>
                                                            :
                                                            <Tooltip tooltip='Hide'>
                                                                <img
                                                                    src={HideIcon}
                                                                    className='hide-icon-item'
                                                                    onClick={() => hideItem(i)}
                                                                />
                                                            </Tooltip>
                                                        }
                                                        <Tooltip tooltip='Remove'>
                                                            <img
                                                                src={TrashCan}
                                                                className='hide-icon-item'
                                                                onClick={() => removeItem(i)}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </Draggable>

                                            :
                                            !dragging && selected === -1 ?
                                                <div style={{ display: 'flex', marginTop: '.4vw' }}>
                                                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                        <input
                                                            className='item-dropdown-name'
                                                            autoComplete={item.autoComplete || null}
                                                            onChange={e => handleChange('name', e.target.value, i)}
                                                            placeholder={placeholder || ''}
                                                            type={type || 'text'}
                                                            style={{ ...style, padding: '.6vw' }}
                                                        />
                                                    </GrammarlyEditorPlugin>
                                                    <Dropdown
                                                        label=''
                                                        name='option'
                                                        options={options}
                                                        updateData={handleChange}
                                                        index={i}
                                                        style={{ margin: '0 .5vw', height: '2vw' }}
                                                        size='9vw'
                                                    />
                                                    <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                                                </div>
                                                :
                                                ''
                                        }
                                    </div>
                            )}
                            {provided.placeholder}
                        </div>
                    }
                </Droppable>
            </DragDropContext>
        )
    }

    const renderSkills = itemsArr => {
        return editSkills ?
            <div className='skills-section-blocked'>
                <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                    <Droppable droppableId="droppable">
                        {(provided, _) =>
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {itemsArr.map((item, i) =>
                                    selected === i ?
                                        <div key={i} className='skill-edit-row'>
                                            <div className='item-dropdown-suggestions'>
                                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                    <input
                                                        className='item-dropdown-name'
                                                        autoComplete={item.autoComplete || null}
                                                        onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                                        placeholder={placeholder || ''}
                                                        type={type || 'text'}
                                                        style={{ ...style, height: '1.2vw' }}
                                                        value={editItem.name || ''}
                                                    />
                                                </GrammarlyEditorPlugin>
                                                {showDropDown ?
                                                    <div className='input-dropdown-options' style={{ width: '9vw' }}>
                                                        {suggestions.map((suggestion, j) =>
                                                            <h4
                                                                key={j}
                                                                className='dropdown-option'
                                                                style={{ borderTop: j === 0 && 'none', width: 'inherit' }}
                                                                onClick={() => {
                                                                    setEditItem({ ...editItem, name: suggestion })
                                                                    setShowDropDown(false)
                                                                }}>{suggestion}</h4>
                                                        )}
                                                    </div> : ''}
                                            </div>
                                            <Dropdown
                                                label=''
                                                name='option'
                                                type='skill'
                                                options={options}
                                                updateData={handleChange}
                                                index={i}
                                                style={{ margin: '0 .5vw' }}
                                                size='10vw'
                                            />
                                            <h4 onClick={() => {
                                                if (editItem.name) {
                                                    let newItemsArr = itemsArr
                                                    newItemsArr[i] = {
                                                        ...newItemsArr[i],
                                                        name: editItem.name || ''
                                                    }
                                                    setItems(newItemsArr)
                                                } else removeItem(i)
                                                setEditItem({})
                                                setSelected(-1)
                                            }} className='item-dropdown-new'>✓</h4>
                                        </div>
                                        :
                                        <div key={i} className='item-dropdown-row'>
                                            {item.name && itemsArr[i + 1] && itemsArr.length > 1 ?
                                                <Draggable key={i} draggableId={String(i)} index={i}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                            className='item-dropdown-blocked draggable'>
                                                            <h4 className='item-dropdown-name' style={{ opacity: item.hidden && '.2' }}>{item.name}</h4>
                                                            <h4 className='item-dropdown-select' style={{ opacity: item.hidden && '.2' }}>{item.option || '-'}</h4>
                                                            <Tooltip tooltip='Edit'>
                                                                <img
                                                                    src={EditIcon}
                                                                    className='hide-icon-item edit-icon-item'
                                                                    onClick={() => {
                                                                        setSelected(i)
                                                                        setEditItem(item)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            {item.hidden ?
                                                                <Tooltip tooltip='Show'>
                                                                    <img
                                                                        src={ShwoIcon}
                                                                        className='hide-icon-item'
                                                                        onClick={() => showItem(i)}
                                                                    />
                                                                </Tooltip>
                                                                :
                                                                <Tooltip tooltip='Hide'>
                                                                    <img
                                                                        src={HideIcon}
                                                                        className='hide-icon-item'
                                                                        onClick={() => hideItem(i)}
                                                                    />
                                                                </Tooltip>
                                                            }
                                                            <Tooltip tooltip='Remove'>
                                                                <img
                                                                    src={TrashCan}
                                                                    className='hide-icon-item'
                                                                    onClick={() => removeItem(i)}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </Draggable>
                                                :
                                                !dragging && selected === -1 ?
                                                    <div className='item-dropdown-suggestions'>
                                                        <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                            <input
                                                                className='item-dropdown-name'
                                                                autoComplete={item.autoComplete || null}
                                                                onChange={e => {
                                                                    handleChange('name', e.target.value, i)
                                                                    setDropValue(e.target.value)
                                                                }}
                                                                placeholder={placeholder || ''}
                                                                type={type || 'text'}
                                                                style={{ ...style, height: '1.2vw' }}
                                                                onFocus={() => setFocus(true)}
                                                                value={dropValue}
                                                            />
                                                        </GrammarlyEditorPlugin>
                                                        {showDropDown ?
                                                            <div className='input-dropdown-options' style={{ width: '9vw' }}>
                                                                {suggestions.map((suggestion, j) =>
                                                                    <h4
                                                                        key={j}
                                                                        className='dropdown-option'
                                                                        style={{ borderTop: j === 0 && 'none', width: 'inherit' }}
                                                                        onClick={() => {
                                                                            handleChange('name', suggestion, i)
                                                                            setDropValue(suggestion)
                                                                            setShowDropDown(false)
                                                                        }}>{suggestion}</h4>
                                                                )}
                                                            </div> : ''}
                                                        <Dropdown
                                                            label=''
                                                            name='option'
                                                            type='skill'
                                                            options={options}
                                                            updateData={handleChange}
                                                            index={i}
                                                            style={{ margin: '0 .5vw' }}
                                                            size='12vw'
                                                        />
                                                        <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                )}
                                {provided.placeholder}
                            </div>
                        }
                    </Droppable>
                </DragDropContext>
                <h4 onClick={() => {
                    setEditSkills(false)
                    addNewItem()
                }} className='section-item-remove'>Done</h4>
            </div>
            :
            <div className='skills-section-blocked'>
                <div className='skills-wrapper'>
                    {itemsArr.map((item, i) => item.name && !item.hidden ?
                        <div className='skill-wrap-item' key={i} style={{
                            paddingTop: fontSize ? `${fontSize / 2}vw` : '.5vw',
                            paddingBottom: fontSize ? `${fontSize}vw` : '1vw'
                        }}>
                            <h4 className='skill-wrap-name' style={{ fontSize: fontSize ? `${fontSize}vw` : '.9vw' }}>{item.name}</h4>
                            <h4 className='skill-wrap-option' style={{ fontSize: fontSize ? `${fontSize}vw` : '.9vw' }}>{item.option || '-'}</h4>
                        </div>
                        : null
                    )}
                </div>
                <h4 onClick={() => setEditSkills(true)} className='section-item-remove'>{itemsArr.length > 1 && itemsArr[0].name ? 'Edit Skills' : 'Add Skills'}</h4>
            </div>
    }

    return (
        <div className='item-dropdown'>
            <h4 className='item-label' style={{ fontSize: fontSize ? `${fontSize * 0.9}vw` : '.8vw' }}>{label || ''}</h4>
            {name === 'skills' ? renderSkills(items) : renderItems(items)}
        </div>
    )
}
