import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import SearchBar from '../components/SearchBar'
import PageIcon from '../icons/page-icon.svg'
import { HELP } from '../constants/help'

export default function Help() {
    const [page, setPage] = useState('')
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        const module = new URLSearchParams(document.location.search).get('module')
        if (module) setPage(module)
    }, [module])

    return (
        HELP[page] ?
            <div className='help-container'>
                <h1 className='help-page-title'>{HELP[page].title}</h1>
                {HELP[page].description ? HELP[page].description.split('\n').map(description => <h4 className='help-page-description'>{description}</h4>)
                    : <h4 className='help-page-description'>*Working in progress 🤓*</h4>}
            </div>
            : ''
    )
}