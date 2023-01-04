import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../../constants/app'
import { VERSION } from '../../constants/app'
import DocText from '../../icons/document-text.svg'
import CVIcon from '../../icons/cv-icon.svg'
import ArchiveIcon from '../../icons/archive-icon.svg'
import UsersIcon from '../../icons/users.svg'
import ServerIcon from '../../icons/server.svg'
import ChartPie from '../../icons/chart-pie.svg'
import HandShakeIcon from '../../icons/handshake-icon.svg'
import ToolsIcon from '../../icons/tools-icon.svg'
import ActivityIcon from '../../icons/activity-icon.svg'
import UserGroup from '../../icons/user-group.svg'
import ConfIcon from '../../icons/cog.svg'
import QuestionIcon from '../../icons/question-mark-circle.svg'
import Chevron from '../../icons/chevron-down.svg'
import './styles.css'
import { getUserPermission } from '../../store/reducers/user'

export default function SdideBar() {
    const [isManager, setIsManager] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
    const filterClicked = 'invert(79%) sepia(13%) saturate(5839%) hue-rotate(339deg) brightness(96%) contrast(87%)'
    const isEdit = new URLSearchParams(document.location.search).get('edit')

    useEffect(() => {
        if (!user || !user.email) return history.push('login')
        checkUserPermissions()
    }, [])

    const getPage = page => {
        return history.location.pathname === page
    }

    const checkUserPermissions = async () => {
        const permissions = await dispatch(getUserPermission({ email: user.email })).then(data => data.payload)
        if (permissions) setIsManager(permissions.isManager)
    }

    return (
        <div className='sidebar-container'>
            <div className='sidebar-section' style={{ borderBottom: '1px solid #E4E7EB', paddingBottom: '.5vw', marginBottom: '.5vw' }}>
                <div className='sidebar-module' style={{ backgroundColor: getPage('/new-cv') && '#F3F4F6' }} onClick={() => !isEdit && history.push('/new-cv')}>
                    <div className='sidebar-col1'>
                        <img src={CVIcon} className='sidebar-new-cv' style={{ filter: getPage('/new-cv') && filterClicked }} />
                        <h4 className='sidebar-label'>{isEdit ? 'Edit CV' : 'Create new CV'}</h4>
                    </div>
                </div>

                <div className='sidebar-module' style={{ backgroundColor: (getPage('/cvs') || getPage('/my-cvs')) && '#F3F4F6' }} onClick={() => {
                    if (isManager) history.push('/cvs')
                    else history.push('/my-cvs')
                }}>
                    <div className='sidebar-col1'>
                        <img src={ArchiveIcon} className='sidebar-svg' style={{ filter: (getPage('/cvs') || getPage('/my-cvs')) && filterClicked }} />
                        <h4 className='sidebar-label'>{isManager ? `All CV's` : `My CV's`}</h4>
                    </div>
                </div>

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/consultants') && '#F3F4F6' }} onClick={() => history.push('/consultants')}>
                        <div className='sidebar-col1'>
                            <img src={UsersIcon} className='sidebar-svg' style={{ filter: getPage('/consultants') && filterClicked }} />
                            <h4 className='sidebar-label'>Consultants</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/clients') && '#F3F4F6' }} onClick={() => history.push('/clients')}>
                        <div className='sidebar-col1'>
                            <img src={HandShakeIcon} className='sidebar-svg' style={{ filter: getPage('/clients') && filterClicked }} />
                            <h4 className='sidebar-label'>Clients</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/tools-and-tech') && '#F3F4F6' }} onClick={() => history.push('/tools-and-tech')}>
                        <div className='sidebar-col1'>
                            <img src={ToolsIcon} className='sidebar-svg' style={{ filter: getPage('/tools-and-tech') && filterClicked }} />
                            <h4 className='sidebar-label'>Tools & Tech</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/activity') && '#F3F4F6' }} onClick={() => history.push('/activity')}>
                        <div className='sidebar-col1'>
                            <img src={ActivityIcon} className='sidebar-svg' style={{ filter: getPage('/activity') && filterClicked }} />
                            <h4 className='sidebar-label'>Activity</h4>
                        </div>
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/statistics') && '#F3F4F6' }} onClick={() => history.push('/statistics')}>
                        <div className='sidebar-col1'>
                            <img src={ChartPie} className='sidebar-svg' style={{ filter: getPage('/statistics') && filterClicked }} />
                            <h4 className='sidebar-label'>Statistics</h4>
                        </div>
                    </div> : ''}
            </div>

            <div className='sidebar-section'>
                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/users') && '#F3F4F6' }} onClick={() => history.push('/users')}>
                        <div className='sidebar-col1'>
                            <img src={UserGroup} className='sidebar-svg' style={{ filter: getPage('/users') && filterClicked }} />
                            <h4 className='sidebar-label'>Users</h4>
                        </div>
                        {/* <img src={Chevron} className='sidebar-arrow' onClick={() => { }} /> */}
                    </div> : ''}

                {isManager ?
                    <div className='sidebar-module' style={{ backgroundColor: getPage('/settings') && '#F3F4F6' }} onClick={() => history.push('/settings')}>
                        <div className='sidebar-col1'>
                            <img src={ConfIcon} className='sidebar-svg' style={{ filter: getPage('/settings') && filterClicked }} />
                            <h4 className='sidebar-label'>Settings</h4>
                        </div>
                    </div> : ''}

                <div className='sidebar-module' style={{ backgroundColor: getPage('/help') && '#F3F4F6' }} onClick={() => history.push('/help')}>
                    <div className='sidebar-col1'>
                        <img src={QuestionIcon} className='sidebar-svg' style={{ filter: getPage('/help') && filterClicked }} />
                        <h4 className='sidebar-label'>Help</h4>
                    </div>
                </div>
            </div>

            <h4 className='sidebar-version'>{VERSION}</h4>
        </div>
    )
}
