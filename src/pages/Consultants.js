import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ProfileIcon from '../icons/profile-icon.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import { getUsers, updateUserData, getProfileImage, createUser, deleteUser } from '../store/reducers/user'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'

export default function Consultants() {
    const [tab, setTab] = useState('user')
    const [users, setUsers] = useState([])
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isNew, setIsNew] = useState(false)
    const [removeModal, setRemoveModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(-1)
    const [contrast, setContrast] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const [userEdit, setUserEdit] = useState(false)
    const [profilePic, setProfilePic] = useState({})
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()
    const tabs = [`Users`, `CV's`, `Skills`, `Buzzwords`]
    const userHeaders = [
        {
            name: 'UPDATED',
            value: 'updatedAt'
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
            name: 'MANAGER EMAIL',
            value: 'manager'
        },
        {
            name: 'MANAGER',
            value: 'isManager'
        },
        {
            name: 'ADMIN',
            value: 'isAdmin'
        }
    ]

    useEffect(() => {
        getAllUsers()
    }, [])

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
            getPreview(users[selectedUser])
        }
    }, [selectedUser])

    const getPreview = async resData => {
        try {
            const image = await dispatch(getProfileImage(resData)).then(data => data.payload)
            if (image) {
                setProfilePic({ profileImage: image.data, style: image.style ? JSON.parse(image.style) : {} })
                if (image.style) {
                    const imageStyles = JSON.parse(image.style)
                    setBrightness(imageStyles.brightness || 100)
                    setContrast(imageStyles.contrast || 100)
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
            if (_users && Array.isArray(_users)) setUsers(_users.filter(user => !user.isManager))
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
                    const saved = await dispatch(createUser(data)).then(data => data.payload)
                    if (saved) toast.success('User data saved successfully')
                    else toast.error('Error saving changes')
                    getAllUsers()
                } else {
                    const updated = await dispatch(updateUserData({ _id: data._id, profilePic, newData: data })).then(data => data.payload)

                    if (updated) toast.success('User data saved successfully')
                    else toast.error('Error saving changes')
                    getAllUsers()
                }
            } else {
                setLoading(false)
                return toast.error('Check the fields')
            }

            setLoading(false)
            setIsEdit(false)
            setIsNew(false)
            setSelectedUser(-1)
            setRemoveModal(false)
            setData({})
        } catch (err) {
            setLoading(false)
            setIsNew(false)
            setIsEdit(false)
            setSelectedUser(-1)
            setRemoveModal(false)
            setData({})
            toast.error('Error saving changes')
        }
    }

    const updateData = (key, value, newItem) => {
        if (!newItem) setIsEdit(true)
        setData({ ...data, [key]: value })
    }

    const checkData = () => {
        if (!data.username || !data.username.includes(' ') || !data.email || !data.email.includes('@') || !data.email.includes('.')) return false
        if (data.manager && (!data.manager.includes('@') || !data.manager.includes('.'))) return false
        // if (!data.password || !data.password2) return false
        return true
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

    const removeConsultant = async () => {
        try {
            setLoading(true)
            const removed = await dispatch(deleteUser({ ...user, userData: data })).then(data => data.payload)
            if (removed) return toast.success('Consultant removed successfully')
            else toast.error('Error removing Consultant')

            setRemoveModal(false)
            setLoading(false)
            getAllUsers()
        } catch (err) {
            setLoading(false)
            setRemoveModal(false)
            console.error(err)
            toast.error('Error removing Consultant')
        }
    }

    return (
        <div className='consultants-container'>
            <div className='consultants-section'>
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
                                handleClick={removeConsultant}
                                color={APP_COLORS.RED}
                            />
                        </div>
                    </div> : ''}
                <div className='settings-new-skill-btn' style={{ filter: removeModal && 'blur(10px)' }}>
                    <CTAButton
                        label='New Consultant'
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
                    {selectedUser !== -1 && !isNew ?
                        <CTAButton
                            label='Delete'
                            handleClick={() => setRemoveModal(true)}
                            color={APP_COLORS.RED}
                        /> : ''}
                </div>
                <div className='settings-skills-container' style={{ filter: removeModal && 'blur(10px)' }}>
                    <DataTable
                        title='Consultants'
                        subtitle='Here is a list of all consultants in the system'
                        maxRows={9}
                        tableData={users}
                        tableHeaders={userHeaders}
                        loading={loading}
                        item={selectedUser}
                        setItem={setSelectedUser}
                        isEdit={userEdit}
                        setIsEdit={setUserEdit}
                    />
                    {selectedUser !== -1 ?
                        <div className='users-select-section'>
                            <div className='users-image-section'>
                                <div className='users-image-input'>
                                    {profilePic.profileImage ?
                                        <img
                                            src={profilePic.profileImage}
                                            style={profilePic.style}
                                            className='profile-image'
                                            onClick={() => document.getElementById('profileImage').click()}
                                        />
                                        : <img
                                            src={ProfileIcon}
                                            style={profilePic.style}
                                            className='profile-image-sgv'
                                            onClick={() => document.getElementById('profileImage').click()}
                                        />}
                                    <InputField
                                        label=''
                                        type='file'
                                        name='profileImage'
                                        filename='profileImage'
                                        image={profilePic}
                                        setImage={setProfilePic}
                                        setIsEdit={setIsEdit}
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                    />
                                </div>
                                {profilePic.profileImage ? <div className='color-users'>
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
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.username || ''}
                                />
                                <InputField
                                    label='Email'
                                    type='text'
                                    name='email'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.email || ''}
                                />
                                <InputField
                                    label='Manager Email'
                                    type='text'
                                    name='manager'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.manager || ''}
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
                                            setIsNew(false)
                                            setData({})
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
                            <div className='users-select-section'>
                                <div className='users-image-section'>
                                    <div className='users-image-input'>
                                        {profilePic.profileImage ?
                                            <img
                                                src={profilePic.profileImage}
                                                style={profilePic.style}
                                                className='profile-image'
                                                onClick={() => document.getElementById('profileImage').click()}
                                            />
                                            : <img
                                                src={ProfileIcon}
                                                style={profilePic.style}
                                                className='profile-image-svg'
                                                onClick={() => document.getElementById('profileImage').click()}
                                            />}
                                        <InputField
                                            label=''
                                            type='file'
                                            name='profileImage'
                                            filename='profileImage'
                                            image={profilePic}
                                            setImage={setProfilePic}
                                            setIsEdit={setIsEdit}
                                            style={{ color: 'rgb(71, 71, 71)' }}
                                        />
                                    </div>
                                    {profilePic.profileImage ? <div className='color-users'>
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
                                        updateData={updateData}
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                        value={data.username || ''}
                                    />
                                    <InputField
                                        label='Email'
                                        type='text'
                                        name='email'
                                        updateData={updateData}
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                        value={data.email || ''}
                                    />
                                    <InputField
                                        label='Manager Email'
                                        type='text'
                                        name='manager'
                                        updateData={updateData}
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                        value={data.manager || ''}
                                    />
                                    <InputField
                                        label='Login Password'
                                        type='text'
                                        name='password'
                                        updateData={updateData}
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                        value={data.password || data.password === '' ? data.password : generatePass()}
                                    />
                                </div>
                                <div className='users-btns'>
                                    <CTAButton
                                        label='Discard'
                                        handleClick={() => {
                                            setSelectedUser(-1)
                                            setIsEdit(false)
                                            setIsNew(false)
                                            setData({})
                                        }}
                                        color={APP_COLORS.GRAY}
                                    />
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
            </div>
        </div>
    )
}