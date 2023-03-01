import React from 'react'
import SearchIcon from '../../icons/search-icon.svg'
import Tooltip from '../Tooltip'
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
        <div className='search-bar-container' style={style || null}>
            <Tooltip tooltip='Search' inline={true}>
                <img src={SearchIcon} className='search-icon' onClick={triggerSearch} />
            </Tooltip>
            <input
                className='search-input'
                onChange={handleChange}
                onKeyPress={onKeyPress}
                placeholder={placeholder || ''}
                type='text'
                value={value}
            />
        </div>
    )
}