import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css'

export default function InputBullet(props) {
    const [dragging, setDragging] = useState(false)

    const {
        label,
        items,
        setItems,
        bulletPlaceholder,
        valuePlaceholder
    } = props

    useEffect(() => {
        if(items.length) {
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


    return (
        <div className='bullet-container'>
            <h4 className='item-label'>{label || ''}</h4>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                <Droppable droppableId="droppable">
                    {(provided, _) =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, i) =>
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
                                                <h4 className='bullet'>{item.bullet}</h4>
                                                <h4 className='bullet-text'>{item.value}</h4>
                                                <h4 onClick={() => removeItem(i)} className='item-dropdown-remove'>X</h4>
                                            </div>
                                        )}
                                    </Draggable>
                                    :
                                    !dragging ?
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