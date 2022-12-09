import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import './styles.css'

export default function Bullet(props) {
    const [dragging, setDragging] = useState(false)

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

    return (
        <div className='bullet-container'>
            <h4 className='bullet-label'>{label || ''}</h4>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                <Droppable droppableId="droppable">
                    {(provided, _) =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, i) =>
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
                                                <h4 onClick={() => removeItem(i)} className='bullet-remove'>X</h4>
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
                                            </div>
                                        )}
                                    </Draggable>
                                    :
                                    !dragging ?
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
        </div>
    )
}