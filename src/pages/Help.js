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

export default function Help() {
    const [data, setData] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState([])
    const [modules, setModules] = useState([])
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

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

    const triggerSearch = () => {
        setLoading(true)
        if (search.length) {
            const filtered = modules.filter(module => {
                const stringLog = JSON.stringify(module)
                let matches = true
                search.forEach(word => {
                    if (!stringLog.toLowerCase().includes(word.toLowerCase())) matches = false
                })
                if (matches) return module
            })
            setModules(filtered)
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
                    <div className='help-module-section'>
                        <h4 className='help-module-title'>Getting Started</h4>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-cv`)}>Creating a new CV</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=edit-cv`)}>Editing a CV</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-consultant`)}>Creating a new Consultant</h4>
                        </div>
                    </div>
                    <div className='help-module-section'>
                        <h4 className='help-module-title'>App Data Management</h4>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=type-of-data`)}>Types of data</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=activity-and-statistics`)}>Activity & Statistics</h4>
                        </div>
                    </div>
                </div>
                <div className='help-module-col'>
                    <div className='help-module-section'>
                        <h4 className='help-module-title'>Image Management</h4>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-image`)}>Upload a new image</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=image-styling`)}>Edit image styling</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=tips-profile`)}>Tips for a nice profile image</h4>
                        </div>
                    </div>
                    <div className='help-module-section'>
                        <h4 className='help-module-title'>Troubleshooting</h4>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=common-errors`)}>Common errors</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=sumbit-report`)}>Submit a report</h4>
                        </div>
                    </div>
                </div>
                <div className='help-module-col'>
                    <div className='help-module-section'>
                        <h4 className='help-module-title'>User Management</h4>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=new-account`)}>Create a new account (Manager or Consultant)</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=edit-user`)}>Edit user data</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=what-to-know-consultant-data`)}>What to know when updating consultant data</h4>
                        </div>
                    </div>
                    <div className='help-module-section'>
                        <h4 className='help-module-title'>Contact Information</h4>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=hr-info`)}>HR Coordinator</h4>
                        </div>
                        <div className='help-module-page'>
                            <img src={PageIcon} className='help-page-svg' />
                            <h4 className='help-module-link' onClick={() => history.push(`/helpPage?module=development-info`)}>App Development</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}