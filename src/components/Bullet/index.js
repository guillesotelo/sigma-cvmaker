import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
        placeholder
    } = props

    useEffect(() => {
        if(items.length) {
            const lastItem = items[items.length - 1]
            if (lastItem || lastItem !== '') addNewItem()
        }
    }, [items])

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
                                item ?
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
                                                <h4 className='bullet'>{bullets[type] || '•'}</h4>
                                                <h4 className='bullet-text'>{item || ''}</h4>
                                                <h4 onClick={() => removeItem(i)} className='item-dropdown-remove'>X</h4>
                                            </div>
                                        )}
                                    </Draggable>
                                    :
                                    !dragging ?
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