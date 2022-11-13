import React from 'react'
import SearchIcon from '../../icons/search-icon.svg'
import './styles.css'

export default function SearchBar(props) {

    const {
        handleChange,
        triggerSearch,
        onKeyPress,
        placeholder,
        value,
        style
    } = props

    return (
        <div className='search-bar-container'>
            <input
                className='search-input'
                onChange={handleChange}
                onKeyPress={onKeyPress}
                placeholder={placeholder || ''}
                type='text'
                style={style || null}
                value={value}
            />
            <img src={SearchIcon} className='search-icon' onClick={triggerSearch}/>
        </div>
    )
}