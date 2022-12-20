import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import EditIcon from '../../icons/edit-icon.svg'
import TrashCan from '../../icons/trash-icon.svg'
import './styles.css'

export default function InputBullet(props) {
    const [dragging, setDragging] = useState(false)
    const [editItem, setEditItem] = useState({})
    const [selected, setSelected] = useState(-1)

    const {
        label,
        items,
        setItems,
        bulletPlaceholder,
        valuePlaceholder,
        id
    } = props

    useEffect(() => {
        if (items.length) {
            const lastItem = items[items.length - 1]
            if (lastItem.bullet || lastItem.bullet !== '') addNewItem()
        }
    }, [items])

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

    return (
        <div className='bullet-container'>
            <h4 className='item-label'>{label || ''}</h4>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                <Droppable droppableId="droppable">
                    {(provided, _) =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, i) =>
                                selected === i ?
                                    <div className='bullet-edit-row' key={i}>
                                        <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                            <input
                                                className='item-dropdown-name'
                                                onChange={e => setEditItem({ ...editItem, bullet: e.target.value })}
                                                placeholder={bulletPlaceholder || ''}
                                                type='text'
                                                id={id}
                                                value={editItem.bullet || ''}
                                            />
                                        </GrammarlyEditorPlugin>
                                        <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                            <input
                                                className='item-dropdown-name'
                                                onChange={e => setEditItem({ ...editItem, value: e.target.value })}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        if (editItem.value) {
                                                            let newItemsArr = items
                                                            newItemsArr[i] = {
                                                                ...newItemsArr[i],
                                                                value: editItem.value || '',
                                                                bullet: editItem.bullet || ''
                                                            }
                                                            setItems(newItemsArr)
                                                        }
                                                        setEditItem({})
                                                        setSelected(-1)
                                                    }
                                                }}
                                                placeholder={valuePlaceholder || ''}
                                                type='text'
                                                value={editItem.value || ''}
                                            />
                                        </GrammarlyEditorPlugin>
                                        <h4 onClick={() => {
                                            if (editItem.value) {
                                                let newItemsArr = items
                                                newItemsArr[i] = {
                                                    ...newItemsArr[i],
                                                    value: editItem.value || '',
                                                    bullet: editItem.bullet || ''
                                                }
                                                setItems(newItemsArr)
                                            }
                                            setEditItem({})
                                            setSelected(-1)
                                        }} className='bullet-new'>✓</h4>
                                    </div>
                                    :
                                    item.bullet ?
                                        <Draggable key={i} draggableId={String(i)} index={i}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                    className='bullet-row draggable' key={i}>
                                                    <h4 className='bullet' style={{ opacity: item.hidden && '.2' }}>{item.bullet}</h4>
                                                    <h4 className='bullet-text' style={{ opacity: item.hidden && '.2' }}>{item.value}</h4>
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
                                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                    <input
                                                        className='input-bullet-period'
                                                        onChange={e => handleChange('bullet', e.target.value, i)}
                                                        placeholder={bulletPlaceholder || ''}
                                                        type='text'
                                                        id={id}
                                                    />
                                                </GrammarlyEditorPlugin>
                                                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID}>
                                                    <input
                                                        className='input-bullet-name'
                                                        onChange={e => handleChange('value', e.target.value, i)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') {
                                                                addNewItem()
                                                                setTimeout(() => document.getElementById(id).focus(), 250)
                                                            }
                                                        }}
                                                        placeholder={valuePlaceholder || ''}
                                                        type='text'
                                                    />
                                                </GrammarlyEditorPlugin>
                                                <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                                            </div>
                                            : ''
                            )}
                            {provided.placeholder}
                        </div>
                    }
                </Droppable>
            </DragDropContext>
        </div>
    )
}