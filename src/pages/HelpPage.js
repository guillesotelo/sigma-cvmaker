import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { HELP } from '../constants/help'

export default function HelpPage() {
    const [page, setPage] = useState('')
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user || !user.email) return history.push('/login')

        if (user.app && user.app !== 'cvmaker') {
            localStorage.clear()
            return history.push('/login')
        }
    }, [])

    useEffect(() => {
        const module = new URLSearchParams(document.location.search).get('module')
        if (module) setPage(module)
    }, [module])

    return (
        HELP[page] ?
            <div className='help-page-container'>
                <div className='help-page-col1'>
                    <h1 className='help-page-title'>{HELP[page].title}</h1>
                    {HELP[page].description ? HELP[page].description.split('\n').map((description, i) =>
                        <h4 key={i} className='help-page-description' dangerouslySetInnerHTML={{ __html: description }}></h4>)
                        : <h4 className='help-page-description'>*Work in progress 🤓*</h4>}
                </div>
                <div className='help-page-col2'>
                    {HELP[page].images.length ? HELP[page].images.map((image, i) =>
                        <img
                            key={i}
                            src={image}
                            className='help-page-image'
                            alt='Create CV Image'
                        />) : ''}
                </div>
            </div>
            : ''
    )
}