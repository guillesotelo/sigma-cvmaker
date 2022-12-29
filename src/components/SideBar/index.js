import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../../constants/app'
import { VERSION } from '../../constants/app'
import ChartPie from '../../icons/chart-pie.svg'
import DocText from '../../icons/document-text.svg'
import UsersIcon from '../../icons/users.svg'
import ServerIcon from '../../icons/server.svg'
import TruckIcon from '../../icons/truck.svg'
import Newspaper from '../../icons/newspaper.svg'
import UserGroup from '../../icons/user-group.svg'
import ConfIcon from '../../icons/cog.svg'
import QuestionIcon from '../../icons/question-mark-circle.svg'
import Chevron from '../../icons/chevron-down.svg'
import './styles.css'
import { getUserPermission } from '../../store/reducers/user'

export default function SdideBar() {
    const [page, setPage] = useState('')
    const [isManager, setIsManager] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null

    useEffect(() => {
        if (!user || !user.email) return history.push('login')
        checkUserPermissions()
    }, [])

    const checkUserPermissions = async () => {
        const permissions = await dispatch(getUserPermission({ email: user.email })).then(data => data.payload)
        if (permissions) setIsManager(permissions.isManager)
    }

    return (
        <div className='sidebar-container'>
            <div className='sidebar-section' style={{ borderBottom: '1px solid #E4E7EB', paddingBottom: '.5vw', marginBottom: '.5vw' }}>
                <div className='sidebar-module' style={{ backgroundColor: page === 'new-cv' && '#F3F4F6' }} onClick={() => {
                    setPage('new-cv')
                    history.push('/new-cv')
                }}>
                    <div className='sidebar-col1'>
                        <img src={ChartPie} className='sidebar-svg' onClick={() => { }} />
                        <h4 className='sidebar-label color-orange'>Create new CV</h4>
                    </div>
                </div>

                <div className='sidebar-module' style={{ backgroundColor: page === 'cvs' && '#F3F4F6' }} onClick={() => {
                    setPage('cvs')
                    if (isManager) history.push('/cvs')
                    else history.push('/my-cvs')
                }}>
                    <div className='sidebar-col1'>
                        <img src={DocText} className='sidebar-svg' onClick={() => { }} />
                        <h4 className='sidebar-label'>{isManager ? `All CV's` : `My CV's`}</h4>
                    </div>
                </div>

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: page === 'consultants' && '#F3F4F6' }} onClick={() => {
                        setPage('consultants')
                        history.push('/consultants')
                    }}>
                        <div className='sidebar-col1'>
                            <img src={UsersIcon} className='sidebar-svg' onClick={() => { }} />
                            <h4 className='sidebar-label'>Consultants</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: page === 'clients' && '#F3F4F6' }} onClick={() => {
                        setPage('clients')
                        history.push('/clients')
                    }}>
                        <div className='sidebar-col1'>
                            <img src={ServerIcon} className='sidebar-svg' onClick={() => { }} />
                            <h4 className='sidebar-label'>Clients</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: page === 'tools-and-tech' && '#F3F4F6' }} onClick={() => {
                        setPage('tools-and-tech')
                        history.push('/tools-and-tech')
                    }}>
                        <div className='sidebar-col1'>
                            <img src={TruckIcon} className='sidebar-svg' onClick={() => { }} />
                            <h4 className='sidebar-label'>Tools & Tech</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: page === 'activity' && '#F3F4F6' }} onClick={() => {
                        setPage('activity')
                        history.push('/activity')
                    }}>
                        <div className='sidebar-col1'>
                            <img src={Newspaper} className='sidebar-svg' onClick={() => { }} />
                            <h4 className='sidebar-label'>Activity</h4>
                        </div>
                    </div> : ''}
            </div>

            <div className='sidebar-section'>
                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: page === 'users' && '#F3F4F6' }} onClick={() => {
                        setPage('users')
                        history.push('/users')
                    }}>
                        <div className='sidebar-col1'>
                            <img src={UserGroup} className='sidebar-svg' onClick={() => { }} />
                            <h4 className='sidebar-label'>Users</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: page === 'settings' && '#F3F4F6' }} onClick={() => {
                        setPage('settings')
                        history.push('/settings')
                    }}>
                        <div className='sidebar-col1'>
                            <img src={ConfIcon} className='sidebar-svg' onClick={() => { }} />
                            <h4 className='sidebar-label'>Settings</h4>
                        </div>
                    </div> : ''}

                <div className='sidebar-module' style={{ backgroundColor: page === 'help' && '#F3F4F6' }} onClick={() => {
                    setPage('help')
                    history.push('/help')
                }}>
                    <div className='sidebar-col1'>
                        <img src={QuestionIcon} className='sidebar-svg' onClick={() => { }} />
                        <h4 className='sidebar-label'>Help</h4>
                    </div>
                </div>
            </div>
            <h4 className='sidebar-version'>{VERSION}</h4>
        </div>
    )
}
