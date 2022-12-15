import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import EditIcon from '../../icons/edit-icon.svg'
import TrashCan from '../../icons/trash-icon.svg'
import './styles.css'

export default function Bullet(props) {
    const [dragging, setDragging] = useState(false)
    const [editTools, setEditTools] = useState(false)
    const [editItem, setEditItem] = useState({})
    const [selected, setSelected] = useState(-1)

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
        placeholder,
        id
    } = props

    useEffect(() => {
        if (items.length) {
            const lastItem = items[items.length - 1]
            if (lastItem.value || lastItem.value !== '') addNewItem()
        }
    }, [items])

    const addNewItem = () => {
        if (items[items.length - 1].value) {
            setItems(items.concat({ value: '' }))
        }
    }

    const removeItem = (index) => {
        const newItemsArr = [...items]
        newItemsArr.splice(index, 1)
        setItems(newItemsArr)
    }

    const handleChange = (newValue, index) => {
        let newItemsArr = items
        newItemsArr[index] = { ...newItemsArr[index], value: newValue }
        setItems(newItemsArr)
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

    const renderBullets = () => {
        return <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
            <Droppable droppableId="droppable">
                {(provided, _) =>
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items.map((item, i) =>
                            selected === i ?
                                <div className='bullet-edit-row'>
                                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                        <input
                                            className='bullet-name'
                                            onChange={e => setEditItem({ ...editItem, value: e.target.value })}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    if (editItem.value) handleChange(editItem.value, selected)
                                                    else removeItem(selected)
                                                    setEditItem({})
                                                    setSelected(-1)
                                                }
                                            }}
                                            placeholder={placeholder || ''}
                                            type='text'
                                            id={id}
                                            value={editItem.value || ''}
                                        />
                                    </GrammarlyEditorPlugin>
                                    <h4 onClick={() => {
                                        if (editItem.value) handleChange(editItem.value, selected)
                                        else removeItem(selected)
                                        setEditItem({})
                                        setSelected(-1)
                                    }} className='bullet-new'>✓</h4>
                                </div>
                                :
                                item.value && item.value !== '' ?
                                    <Draggable key={i} draggableId={String(i)} index={i} disabled={items.length === 2}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                                className='bullet-row' key={i}>
                                                <h4 className='bullet' style={{ opacity: item.hidden && '.2' }}>{bullets[type] || '•'}</h4>
                                                <h4 className='bullet-text' style={{ opacity: item.hidden && '.2' }}>{item.value || ''}</h4>
                                                <img
                                                    src={EditIcon}
                                                    className='hide-icon-item edit-icon-item'
                                                    onClick={() => {
                                                        setSelected(i)
                                                        setEditItem(item)
                                                    }}
                                                />
                                                {item.hidden ?
                                                    <img
                                                        src={ShwoIcon}
                                                        className='hide-icon-item'
                                                        onClick={() => showItem(i)}
                                                    />
                                                    :
                                                    <img
                                                        src={HideIcon}
                                                        className='hide-icon-item'
                                                        onClick={() => hideItem(i)}
                                                    />
                                                }
                                                <img
                                                    src={TrashCan}
                                                    className='hide-icon-item'
                                                    onClick={() => removeItem(i)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                    :
                                    !dragging && selected === -1 ?
                                        <div className='bullet-row' key={i}>
                                            <h4 className='bullet'>{bullets[type]}</h4>
                                            <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                <input
                                                    className='bullet-name'
                                                    onChange={e => handleChange(e.target.value, i)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            addNewItem()
                                                            setTimeout(() => document.getElementById(id).focus(), 250)
                                                        }
                                                    }}
                                                    placeholder={placeholder || ''}
                                                    type='text'
                                                    id={id}
                                                />
                                            </GrammarlyEditorPlugin>
                                            <h4 onClick={() => addNewItem()} className='bullet-new'>✓</h4>
                                        </div>
                                        : ''
                        )}
                        {provided.placeholder}
                    </div>
                }
            </Droppable>
        </DragDropContext>
    }

    const renderTools = () => {
        return editTools ?
            <div className='skills-section-blocked'>
                <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                    <Droppable droppableId="droppable">
                        {(provided, _) =>
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {items.map((item, i) =>
                                    selected === i ?
                                        <div className='bullet-edit-row'>
                                            <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                <input
                                                    className='bullet-name'
                                                    onChange={e => setEditItem({ ...editItem, value: e.target.value })}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            if (editItem.value) handleChange(editItem.value, selected)
                                                            else removeItem(selected)
                                                            setEditItem({})
                                                            setSelected(-1)
                                                        }
                                                    }}
                                                    placeholder={placeholder || ''}
                                                    type='text'
                                                    id={id}
                                                    value={editItem.value || ''}
                                                />
                                            </GrammarlyEditorPlugin>
                                            <h4 onClick={() => {
                                                if (editItem.value) handleChange(editItem.value, selected)
                                                else removeItem(selected)
                                                setEditItem({})
                                                setSelected(-1)
                                            }} className='bullet-new'>✓</h4>
                                        </div>
                                        :
                                        item.value && item.value !== '' ?
                                            <Draggable key={i} draggableId={String(i)} index={i} disabled={items.length === 2}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                        className='bullet-row' key={i}>
                                                        <h4 className='bullet' style={{ opacity: item.hidden && '.2' }}>{bullets[type] || '•'}</h4>
                                                        <h4 className='bullet-text' style={{ opacity: item.hidden && '.2' }}>{item.value || ''}</h4>
                                                        <img
                                                            src={EditIcon}
                                                            className='hide-icon-item edit-icon-item'
                                                            onClick={() => {
                                                                setSelected(i)
                                                                setEditItem(item)
                                                            }}
                                                        />
                                                        {item.hidden ?
                                                            <img
                                                                src={ShwoIcon}
                                                                className='hide-icon-item'
                                                                onClick={() => showItem(i)}
                                                            />
                                                            :
                                                            <img
                                                                src={HideIcon}
                                                                className='hide-icon-item'
                                                                onClick={() => hideItem(i)}
                                                            />
                                                        }
                                                        <img
                                                            src={TrashCan}
                                                            className='hide-icon-item'
                                                            onClick={() => removeItem(i)}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                            :
                                            !dragging && selected === -1 ?
                                                <div className='bullet-row' key={i}>
                                                    <h4 className='bullet'>{bullets[type]}</h4>
                                                    <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                        <input
                                                            className='bullet-name'
                                                            onChange={e => handleChange(e.target.value, i)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    addNewItem()
                                                                    setTimeout(() => document.getElementById(id).focus(), 250)
                                                                }
                                                            }}
                                                            placeholder={placeholder || ''}
                                                            type='text'
                                                            id={id}
                                                        />
                                                    </GrammarlyEditorPlugin>
                                                    <h4 onClick={() => addNewItem()} className='bullet-new'>✓</h4>
                                                </div>
                                                : ''
                                )}
                                {provided.placeholder}
                            </div>
                        }
                    </Droppable>
                </DragDropContext>
                <h4 onClick={() => setEditTools(false)} className='section-item-remove'>Done</h4>
            </div>
            :
            <div className='tools-section-blocked'>
                <div className='tools-wrapper'>
                    {items.map((item, i) => item.value && !item.hidden ?
                        <h4 className='tool-wrap-name' key={i}>{item.value}</h4>
                        : null
                    )}
                </div>
                <h4 onClick={() => setEditTools(true)} className='section-item-remove'>Edit</h4>
            </div>
    }

    return (
        <div className='bullet-container'>
            <h4 className='bullet-label'>{label || ''}</h4>
            {id === 'otherTools' ? renderTools() : renderBullets()}
        </div>
    )
}

