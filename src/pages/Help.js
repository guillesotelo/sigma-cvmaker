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
    const [data, setData] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState([])
    const [modules, setModules] = useState(HELP ? JSON.stringify(HELP) : '')
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!search.length) setModules(HELP ? JSON.stringify(HELP) : '')
    }, [search])

    const updateData = (key, value) => {
        setIsEdit(true)
        setData({ ...data, [key]: value })
    }

    const handleSearch = e => {
        if (e.key === 'Enter') {
            triggerSearch()
        } else {
            const words = e.target.value ? e.target.value.split(' ') : []
            setSearch(words)
        }
    }

    // console.log("modules", modules)

    const triggerSearch = () => {
        setLoading(true)
        if (search.length) {
            const keys = Object.keys(HELP)
            const filtered = keys.map(key => {
                let matches = true
                const stringModule = JSON.stringify(HELP[key])
                search.forEach(word => {
                    if (!stringModule.toLowerCase().includes(word.toLowerCase())) matches = false
                })
                if (matches) return key
            })
            setModules(filtered.join(''))
        }
        setLoading(false)
    }

    return (
        <div className='help-container'>
            {/* <h4 className='page-title'>Help Center</h4> */}
            <div className='help-search-col'>
                <h4 className='help-search-title'>How can we help?</h4>
                <SearchBar
                    handleChange={e => handleSearch(e)}
                    placeholder='Search by words or text...'
                    style={{ width: '20vw' }}
                    onKeyPress={handleSearch}
                    triggerSearch={triggerSearch}
                    setData={setModules}
                />
            </div>
            <div className='help-module-row'>
                <div className='help-module-col'>
                    {modules.includes('new-cv') || modules.includes('edit-cv') || modules.includes('restore-items') ? <div className='help-module-section'>
                        <h4 className='help-module-title'>Getting Started</h4>
                        {modules.includes('new-cv') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-cv`)}>Creating a new CV</h4>
                        </div> : ''}
                        {modules.includes('edit-cv') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=edit-cv`)}>Editing a CV</h4>
                        </div> : ''}
                        {modules.includes('restore-items') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=restore-items`)}>Restore a deleted item</h4>
                        </div> : ''}
                    </div> : ''}
                    {modules.includes('type-of-data') || modules.includes('activity-and-statistics') ? <div className='help-module-section'>
                        <h4 className='help-module-title'>App Data Management</h4>
                        {modules.includes('type-of-data') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=type-of-data`)}>Types of data</h4>
                        </div> : ''}
                        {modules.includes('activity-and-statistics') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=activity-and-statistics`)}>Activity & Statistics</h4>
                        </div> : ''}
                    </div> : ''}
                </div>
                <div className='help-module-col'>
                    {modules.includes('new-image') || modules.includes('image-styling') || modules.includes('tips-profile') ? <div className='help-module-section'>
                        <h4 className='help-module-title'>Images Module</h4>
                        {modules.includes('new-image') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-image`)}>Upload a new image</h4>
                        </div> : ''}
                        {modules.includes('image-styling') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=image-styling`)}>Edit image styling</h4>
                        </div> : ''}
                        {modules.includes('tips-profile') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=tips-profile`)}>Tips for a nice profile image</h4>
                        </div> : ''}
                    </div> : ''}
                    {modules.includes('common-errors') || modules.includes('submit-report') ? <div className='help-module-section'>
                        <h4 className='help-module-title'>Troubleshooting</h4>
                        {modules.includes('common-errors') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=common-errors`)}>Common errors</h4>
                        </div> : ''}
                        {modules.includes('sumbit-report') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=sumbit-report`)}>Submit a report</h4>
                        </div> : ''}
                    </div> : ''}
                </div>
                <div className='help-module-col'>
                    {modules.includes('new-account') || modules.includes('edit-user') || modules.includes('what-to-know-consultant-data') ? <div className='help-module-section'>
                        <h4 className='help-module-title'>Users Module</h4>
                        {modules.includes('new-account') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-account`)}>Create a new account (Manager or Consultant)</h4>
                        </div> : ''}
                        {modules.includes('edit-user') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=edit-user`)}>Edit user data</h4>
                        </div> : ''}
                        {modules.includes('what-to-know-consultant-data') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=what-to-know-consultant-data`)}>What to know when updating consultant data</h4>
                        </div> : ''}
                    </div> : ''}
                    {modules.includes('hr-info') || modules.includes('development-info') ? <div className='help-module-section'>
                        <h4 className='help-module-title'>Contact Information</h4>
                        {modules.includes('hr-info') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=hr-info`)}>HR References</h4>
                        </div> : ''}
                        {modules.includes('development-info') ? <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=development-info`)}>App Development</h4>
                        </div> : ''}
                    </div> : ''}
                </div>
            </div>
        </div>
    )
}