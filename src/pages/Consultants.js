import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ProfileIcon from '../icons/profile-icon.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import {
    getUsers,
    updateUserData,
    createUser,
    deleteUser,
    getAllManagers
} from '../store/reducers/user'
import { getImageByType } from '../store/reducers/image'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import Dropdown from '../components/Dropdown'
import { userHeaders } from '../constants/tableHeaders'
import Tooltip from '../components/Tooltip'

export default function Consultants() {
    const [users, setUsers] = useState([])
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isNew, setIsNew] = useState(false)
    const [removeModal, setRemoveModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(-1)
    const [scale, setScale] = useState(1)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const [rotate, setRotate] = useState(0)
    const [contrast, setContrast] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const [userEdit, setUserEdit] = useState(false)
    const [profilePic, setProfilePic] = useState({})
    const [managers, setManagers] = useState([])
    const [allManagers, setAllManagerrs] = useState([])
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const history = useHistory()
    const dispatch = useDispatch()

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
                transform: `scale(${scale}) translate(${translateX}%, ${translateY}%) rotate(${rotate}deg)`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`,
                s: scale,
                x: translateX,
                y: translateY,
                r: rotate,
                brightness,
                contrast,
                grayscale
            }
        })
    }, [scale, translateX, translateY, rotate, contrast, brightness, grayscale])

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
            const image = await dispatch(getImageByType({ email, type: 'Profile' })).then(data => data.payload)
            if (image) {
                setProfilePic({ image: image.data, style: image.style ? JSON.parse(image.style) : {} })
                if (image.style) {
                    const imageStyles = JSON.parse(image.style)
                    setTranslateX(imageStyles.x || 0)
                    setTranslateY(imageStyles.y || 0)
                    setScale(imageStyles.s || 1)
                    setRotate(imageStyles.r || 0)
                    setBrightness(imageStyles.brightness >= 0 && imageStyles.brightness || 100)
                    setContrast(imageStyles.contrast >= 0 && imageStyles.contrast || 100)
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
                    const saved = await dispatch(createUser({ ...data, profilePic, user })).then(data => data.payload)
                    if (saved) toast.success('User data saved successfully')
                    else toast.error('Error saving changes')
                    getAllUsers()
                } else {
                    const updated = await dispatch(updateUserData({ _id: data._id, profilePic, user, newData: data })).then(data => data.payload)

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
        if (!data.managerName) return false
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
            if (removed) toast.success('Consultant removed successfully')
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
                </div>
                <div className='settings-skills-container' style={{ filter: removeModal && 'blur(10px)' }}>
                    <DataTable
                        title='Consultants'
                        subtitle='Here is a list of all consultants in the system'
                        maxRows={9}
                        tableData={users}
                        setTableData={setUsers}
                        tableHeaders={userHeaders.concat({ name: 'ACTIONS', value: 'icons' })}
                        loading={loading}
                        item={selectedUser}
                        setItem={setSelectedUser}
                        isEdit={userEdit}
                        setIsEdit={setUserEdit}
                        handleDelete={() => setRemoveModal(true)}
                    />
                    {selectedUser !== -1 ?
                        <div className='users-select-section'>
                            <div className='users-image-section'>
                                <div className='users-image-input'>
                                    {profilePic.image ?
                                        <Tooltip tooltip='Change image'>
                                            <div className='profile-image-cover'>
                                                <img
                                                    src={profilePic.image}
                                                    style={profilePic.style}
                                                    className='profile-image'
                                                    onClick={() => document.getElementById('image').click()}
                                                    loading='lazy'
                                                />
                                            </div>
                                        </Tooltip>
                                        :
                                        <Tooltip tooltip='Upload image'>
                                            <img
                                                src={ProfileIcon}
                                                style={profilePic.style}
                                                className='account-profile-image-svg'
                                                onClick={() => document.getElementById('image').click()}
                                            />
                                        </Tooltip>
                                    }
                                    <InputField
                                        label=''
                                        type='image'
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
                                            label='Position X'
                                            sign='%'
                                            value={translateX}
                                            setValue={setTranslateX}
                                            setIsEdit={setIsEdit}
                                            min={-100}
                                            max={100}
                                        />
                                        <Slider
                                            label='Position Y'
                                            sign='%'
                                            value={translateY}
                                            setValue={setTranslateY}
                                            setIsEdit={setIsEdit}
                                            min={-100}
                                            max={100}
                                        />
                                        <Slider
                                            label='Scale'
                                            sign=''
                                            value={scale}
                                            setValue={setScale}
                                            setIsEdit={setIsEdit}
                                            min={0}
                                            max={3}
                                            step={0.01}
                                        />
                                        <Slider
                                            label='Rotate'
                                            sign='°'
                                            value={rotate}
                                            setValue={setRotate}
                                            setIsEdit={setIsEdit}
                                            min={0}
                                            max={360}
                                        />
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
                                    placeholder='Richard Newton'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.username || ''}
                                />
                                <InputField
                                    label='Email'
                                    type='text'
                                    name='email'
                                    placeholder='user.email@sigma.se'
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
                                    size='16.2vw'
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
                                    style={{ marginBottom: '1vw' }}
                                    value={data.location || ''}
                                />
                            </div>
                            <div className='users-btns'>
                                {isEdit ?
                                    <CTAButton
                                        label='Cancel'
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
                                        {profilePic.image ?
                                            <Tooltip tooltip='Change image'>
                                                <img
                                                    src={profilePic.image}
                                                    style={profilePic.style}
                                                    className='account-profile-image'
                                                    onClick={() => document.getElementById('image').click()}
                                                    loading='lazy'
                                                />
                                            </Tooltip>
                                            :
                                            <Tooltip tooltip='Upload image'>
                                                <img
                                                    src={ProfileIcon}
                                                    style={profilePic.style}
                                                    className='account-profile-image-svg'
                                                    onClick={() => document.getElementById('image').click()}
                                                />
                                            </Tooltip>
                                        }
                                        <InputField
                                            label=''
                                            type='image'
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
                                        placeholder='Richard Newton'
                                        updateData={updateData}
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                        value={data.username || ''}
                                    />
                                    <InputField
                                        label='Email'
                                        type='text'
                                        name='email'
                                        placeholder='user.email@sigma.se'
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
                                        size='16.2vw'
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
                                        style={{ color: 'rgb(71, 71, 71)' }}
                                        value={data.password || data.password === '' ? data.password : generatePass()}
                                    />
                                </div>
                                <div className='users-btns'>
                                    <CTAButton
                                        label='Cancel'
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