import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ProfileIcon from '../icons/profile-icon.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import Dropdown from '../components/Dropdown'
import {
    getUsers,
    updateUserData,
    getProfileImage,
    getAllManagers,
    deleteUser,
    createUser
} from '../store/reducers/user'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'

export default function Users() {
    const [tab, setTab] = useState('user')
    const [users, setUsers] = useState([])
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isNew, setIsNew] = useState(false)
    const [selectedUser, setSelectedUser] = useState(-1)
    const [contrast, setContrast] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const [userEdit, setUserEdit] = useState(false)
    const [removeModal, setRemoveModal] = useState(false)
    const [profilePic, setProfilePic] = useState({})
    const [managers, setManagers] = useState([])
    const [allManagers, setAllManagerrs] = useState([])
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const history = useHistory()
    const dispatch = useDispatch()
    const userHeaders = [
        {
            name: 'ADDED',
            value: 'createdAt'
        },
        {
            name: 'FULL NAME',
            value: 'username'
        },
        {
            name: 'EMAIL',
            value: 'email'
        },
        {
            name: 'MANAGER',
            value: 'managerName'
        },
        {
            name: 'IS MANAGER',
            value: 'isManager'
        },
        {
            name: 'IS ADMIN',
            value: 'isAdmin'
        }
    ]

    useEffect(() => {
        if (!user || !user.email || !isManager) history.push('home')
        getAllUsers()
        getManagers()
    }, [])

    useEffect(() => {
        if (data.managerName) {
            let managerEmail = ''
            allManagers.forEach(manager => {
                if (manager.username === data.managerName) managerEmail = manager.email
            })
            updateData('managerEmail', managerEmail)
        }
    }, [data.managerName])

    useEffect(() => {
        setProfilePic({
            ...profilePic,
            style: {
                filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`,
                brightness,
                contrast,
                grayscale
            }
        })
    }, [contrast, brightness, grayscale])

    useEffect(() => {
        if (selectedUser > -1) {
            setData({ ...data, ...users[selectedUser] })
            getPreview(users[selectedUser].email)
        }
    }, [selectedUser])

    const getManagers = async () => {
        try {
            const _managers = await dispatch(getAllManagers(user)).then(data => data.payload)
            if (_managers && Array.isArray(_managers)) {
                setAllManagerrs(_managers)
                setManagers(_managers.map(manager => manager.username))
            }
        } catch (err) { console.error(err) }
    }

    const getPreview = async email => {
        try {
            const image = await dispatch(getProfileImage({ email })).then(data => data.payload)
            if (image) {
                setProfilePic({ image: image.data, style: image.style ? JSON.parse(image.style) : {} })
                if (image.style) {
                    const imageStyles = JSON.parse(image.style)
                    setBrightness(imageStyles.brightness >= 0 ? imageStyles.brightness : 100)
                    setContrast(imageStyles.contrast >= 0 ? imageStyles.contrast : 100)
                    setGrayscale(imageStyles.grayscale || 0)
                }
            }
            else setProfilePic({})
        } catch (err) {
            console.error(err)
        }
    }

    const getAllUsers = async () => {
        try {
            setLoading(true)
            const _users = await dispatch(getUsers(user)).then(data => data.payload)
            if (_users) setUsers(_users)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error(err)
        }
    }

    const saveUserData = async () => {
        try {
            setLoading(true)
            if (checkData()) {
                if (isNew) {
                    const saved = await dispatch(createUser({ ...data, profilePic, user })).then(data => data.payload)
                    if (!saved) return toast.error('Error saving user')
                    toast.success('User saved successfully')
                } else {
                    const updated = await dispatch(updateUserData({ _id: users[selectedUser]._id, profilePic, newData: data, user })).then(data => data.payload)
                    if (updated) toast.success('User data saved successfully')
                    else toast.error('Error saving changes')
                }
                getAllUsers()
            } else {
                setLoading(false)
                return toast.error('Check the fields')
            }

            setLoading(false)
            setIsEdit(false)
            setIsNew(false)
        } catch (err) {
            setLoading(false)
            setIsEdit(false)
            setIsNew(false)
            toast.error('Error saving changes')
        }
    }

    const updateData = (key, value) => {
        setIsEdit(true)
        setData({ ...data, [key]: value })
    }

    const checkData = () => {
        if (!data.username || !data.username.includes(' ') || !data.email || !data.email.includes('@') || !data.email.includes('.')) return false
        if (data.manager && (!data.manager.includes('@') || !data.manager.includes('.'))) return false
        // if (!data.password || !data.password2) return false
        return true
    }

    const removeUser = async () => {
        try {
            setLoading(true)
            const removed = await dispatch(deleteUser({ ...user, userData: data })).then(data => data.payload)
            if (removed) toast.success('User removed successfully')
            else toast.error('Error removing user')

            setRemoveModal(false)
            setLoading(false)
            getAllUsers()
        } catch (err) {
            setLoading(false)
            setRemoveModal(false)
            console.error(err)
            toast.error('Error removing user')
        }
    }

    const generatePass = () => {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const passwordLength = 8
        let password = ""
        for (let i = 0; i < passwordLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }
        return updateData('password', password, true)
    }

    return (
        <div className='users-container'>
            <div className='users-column'>
                {removeModal ?
                    <div className='remove-modal'>
                        <h4 style={{ textAlign: 'center' }}>Are you sure you want to delete <br />{data.username}?</h4>
                        <div className='remove-modal-btns'>
                            <CTAButton
                                label='Cancel'
                                handleClick={() => {
                                    setRemoveModal(false)
                                }}
                                color={APP_COLORS.GRAY}
                            />
                            <CTAButton
                                label='Confirm'
                                handleClick={removeUser}
                                color={APP_COLORS.RED}
                            />
                        </div>
                    </div> : ''}
                <div className='settings-new-skill-btn' style={{ filter: removeModal && 'blur(10px)' }}>
                    <CTAButton
                        label='Create User'
                        handleClick={() => {
                            setSelectedUser(-1)
                            setIsEdit(false)
                            setProfilePic({})
                            setData({})
                            setIsNew(true)
                        }}
                        color={APP_COLORS.GREEN}
                        disabled={isNew}
                    />
                    {selectedUser !== -1 ?
                        <CTAButton
                            label='Delete'
                            handleClick={() => setRemoveModal(true)}
                            color={APP_COLORS.RED}
                        /> : ''}
                </div>
                <DataTable
                    title='Users'
                    subtitle='Here is a list of all users in the system'
                    maxRows={9}
                    tableData={users}
                    tableHeaders={userHeaders}
                    loading={loading}
                    item={selectedUser}
                    setItem={setSelectedUser}
                    isEdit={userEdit}
                    setIsEdit={setUserEdit}
                    style={{ filter: removeModal && 'blur(10px)' }}
                />
            </div>
            {selectedUser !== -1 ?
                <div className='users-select-section' style={{ filter: removeModal && 'blur(10px)' }}>
                    <div className='users-image-section'>
                        <div className='users-image-input'>
                            {profilePic.image ?
                                <img
                                    src={profilePic.image}
                                    style={profilePic.style}
                                    className='account-profile-image'
                                    onClick={() => document.getElementById('image').click()}
                                    loading='lazy'
                                />
                                : <img
                                    src={ProfileIcon}
                                    style={profilePic.style}
                                    className='account-profile-image-svg'
                                    onClick={() => document.getElementById('image').click()}
                                />}
                            <InputField
                                label=''
                                type='file'
                                name='image'
                                filename='image'
                                image={profilePic}
                                setImage={setProfilePic}
                                setIsEdit={setIsEdit}
                                style={{ color: 'rgb(71, 71, 71)' }}
                            />
                        </div>
                        {profilePic.image ?
                            <div className='color-users'>
                                <Slider
                                    value={contrast}
                                    setValue={setContrast}
                                    setIsEdit={setIsEdit}
                                    label='Contrast'
                                    max={200}
                                    sign='%'
                                />
                                <Slider
                                    value={brightness}
                                    setValue={setBrightness}
                                    setIsEdit={setIsEdit}
                                    label='Brightness'
                                    max={200}
                                    sign='%'
                                />
                                <Slider
                                    value={grayscale}
                                    setValue={setGrayscale}
                                    setIsEdit={setIsEdit}
                                    label='Gray Scale'
                                    max={100}
                                    sign='%'
                                />
                            </div> : ''}
                    </div>

                    <div className='users-details'>
                        <InputField
                            label='Full Name'
                            type='text'
                            name='username'
                            placeholder='Emily Beckham'
                            updateData={updateData}
                            style={{ color: 'rgb(71, 71, 71)' }}
                            value={data.username || ''}
                        />
                        <InputField
                            label='Email'
                            type='text'
                            name='email'
                            placeholder='emily.beckham@sigma.se'
                            updateData={updateData}
                            style={{ color: 'rgb(71, 71, 71)' }}
                            value={data.email || ''}
                        />
                        <Dropdown
                            label='Consultant Manager'
                            name='managerName'
                            options={managers}
                            value={data.managerName}
                            updateData={updateData}
                            size='95%'
                        />
                        <InputField
                            label='Phone'
                            type='text'
                            name='phone'
                            placeholder='+12 3456 78901'
                            updateData={updateData}
                            value={data.phone || ''}
                        />
                        <InputField
                            label='Location'
                            type='text'
                            name='location'
                            updateData={updateData}
                            placeholder='Mobilvägen 10, Lund, Sweden'
                            value={data.location || ''}
                        />
                        <InputField
                            label='Login Password'
                            type='text'
                            name='password'
                            updateData={updateData}
                            placeholder='Write new password'
                            style={{ color: 'rgb(71, 71, 71)', marginBottom: '1vw' }}
                        />
                        <SwitchBTN
                            label='Is Manager?'
                            sw={data.isManager || false}
                            onChangeSw={() => updateData('isManager', !data.isManager)}
                            style={{ transform: 'scale(0.75)', width: '100%', margin: '1.5vw 0' }}
                        />
                    </div>
                    <div className='users-btns'>
                        {isEdit ?
                            <CTAButton
                                label='Discard'
                                handleClick={() => {
                                    setSelectedUser(-1)
                                    setIsEdit(false)
                                }}
                                color={APP_COLORS.GRAY}
                                disabled={!isEdit}
                            />
                            : ''}
                        <CTAButton
                            label='Save'
                            handleClick={saveUserData}
                            color={APP_COLORS.GREEN}
                            loading={loading}
                            disabled={!isEdit}
                        />
                    </div>
                </div>
                :
                isNew ?
                    <div className='users-select-section' style={{ filter: removeModal && 'blur(10px)' }}>
                        <div className='users-image-section'>
                            <div className='users-image-input'>
                                {profilePic.image ?
                                    <img
                                        src={profilePic.image}
                                        style={profilePic.style}
                                        className='account-profile-image'
                                        onClick={() => document.getElementById('image').click()}
                                        loading='lazy'
                                    />
                                    : <img
                                        src={ProfileIcon}
                                        style={profilePic.style}
                                        className='account-profile-image-svg'
                                        onClick={() => document.getElementById('image').click()}
                                    />}
                                <InputField
                                    label=''
                                    type='file'
                                    name='image'
                                    filename='image'
                                    image={profilePic}
                                    setImage={setProfilePic}
                                    setIsEdit={setIsEdit}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                />
                            </div>
                            {profilePic.image ?
                                <div className='color-users'>
                                    <Slider
                                        value={contrast}
                                        setValue={setContrast}
                                        setIsEdit={setIsEdit}
                                        label='Contrast'
                                        max={200}
                                        sign='%'
                                    />
                                    <Slider
                                        value={brightness}
                                        setValue={setBrightness}
                                        setIsEdit={setIsEdit}
                                        label='Brightness'
                                        max={200}
                                        sign='%'
                                    />
                                    <Slider
                                        value={grayscale}
                                        setValue={setGrayscale}
                                        setIsEdit={setIsEdit}
                                        label='Gray Scale'
                                        max={100}
                                        sign='%'
                                    />
                                </div> : ''}
                        </div>

                        <div className='users-details'>
                            <InputField
                                label='Full Name'
                                type='text'
                                name='username'
                                placeholder='Emily Beckham'
                                updateData={updateData}
                                style={{ color: 'rgb(71, 71, 71)' }}
                                value={data.username || ''}
                            />
                            <InputField
                                label='Email'
                                type='text'
                                name='email'
                                placeholder='emily.beckham@sigma.se'
                                updateData={updateData}
                                style={{ color: 'rgb(71, 71, 71)' }}
                                value={data.email || ''}
                            />
                            <Dropdown
                                label='Consultant Manager'
                                name='managerName'
                                options={managers}
                                value={data.managerName}
                                updateData={updateData}
                                size='95%'
                            />
                            <InputField
                                label='Phone'
                                type='text'
                                name='phone'
                                placeholder='+12 3456 78901'
                                updateData={updateData}
                                value={data.phone || ''}
                            />
                            <InputField
                                label='Location'
                                type='text'
                                name='location'
                                updateData={updateData}
                                placeholder='Mobilvägen 10, Lund, Sweden'
                                value={data.location || ''}
                            />
                            <InputField
                                label='Login Password'
                                type='text'
                                name='password'
                                updateData={updateData}
                                value={data.password || data.password === '' ? data.password : generatePass()}
                                style={{ color: 'rgb(71, 71, 71)', marginBottom: '1vw' }}
                            />
                            <SwitchBTN
                                label='Is Manager?'
                                sw={data.isManager || false}
                                onChangeSw={() => updateData('isManager', !data.isManager)}
                                style={{ transform: 'scale(0.75)', width: '100%', margin: '1.5vw 0' }}
                            />
                        </div>
                        <div className='users-btns'>
                            {isEdit ?
                                <CTAButton
                                    label='Discard'
                                    handleClick={() => {
                                        setSelectedUser(-1)
                                        setIsEdit(false)
                                    }}
                                    color={APP_COLORS.GRAY}
                                    disabled={!isEdit}
                                />
                                : ''}
                            <CTAButton
                                label='Save'
                                handleClick={saveUserData}
                                color={APP_COLORS.GREEN}
                                loading={loading}
                                disabled={!isEdit}
                            />
                        </div>
                    </div>
                    : ''
            }
        </div>
    )
}
