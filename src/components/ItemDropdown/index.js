import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Dropdown from '../Dropdown';
import './styles.css'

export default function ItemDropdown(props) {
    const [dragging, setDragging] = useState(false)

    const {
        label,
        items,
        setItems,
        options,
        style,
        type,
        placeholder
    } = props

    useEffect(() => {
        renderItems(items)
        if (items.length) {
            const lastItem = items[items.length - 1]
            if (lastItem.name || lastItem.name !== '') addNewItem()
        }
    }, [items])

    const handleChange = (type, newValue, index) => {
        let newItemsArr = items
        if (type === 'name') newItemsArr[index] = { ...newItemsArr[index], name: newValue }
        if (type === 'option') newItemsArr[index] = { ...newItemsArr[index], option: newValue }
        setItems(newItemsArr)
    }

    const addNewItem = () => {
        if (items[items.length - 1].name) {
            setItems(items.concat({ name: '' }))
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

    const renderItems = itemsArr => {
        return (
            <DragDropContext onDragEnd={onDragEnd} onDragStart={() => setDragging(true)}>
                <Droppable droppableId="droppable">
                    {(provided, _) =>
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {itemsArr.map((item, i, fullArr) =>
                                <div key={i} className='item-dropdown-row'>
                                    {item.name && fullArr.length > 1 ?
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
                                                    <h4 className='item-dropdown-name'>{item.name}</h4>
                                                    <h4 className='item-dropdown-select'>{item.option || '-'}</h4>
                                                    <h4 onClick={() => removeItem(i)} className='item-dropdown-remove'>X</h4>
                                                </div>
                                            )}
                                        </Draggable>

                                        :
                                        !dragging ?
                                            <>
                                                <input
                                                    className='item-dropdown-name'
                                                    autoComplete={item.autoComplete || null}
                                                    onChange={e => handleChange('name', e.target.value, i)}
                                                    placeholder={placeholder || ''}
                                                    type={type || 'text'}
                                                    style={style || null}
                                                />
                                                <Dropdown
                                                    label=''
                                                    name='option'
                                                    options={options}
                                                    updateData={handleChange}
                                                    index={i}
                                                    style={{ margin: '0 .5vw' }}
                                                />

                                                {/* <select className='item-dropdown-select' defaultValue='Select one' onChange={e => handleChange('option', e.target.value, i)}>
                                                    <option value="" hidden>Select one</option>
                                                    {options && options.length ? options.map((op, j) =>
                                                        <option key={j} defaultValue='Select one' className='item-dropdown-option'>{op}</option>)
                                                        : ''}
                                                </select> */}
                                                <h4 onClick={() => addNewItem()} className='item-dropdown-new'>✓</h4>
                                            </>
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

    return (
        <div className='item-dropdown'>
            <h4 className='item-label'>{label || ''}</h4>
            {renderItems(items)}
        </div>
    )
}
