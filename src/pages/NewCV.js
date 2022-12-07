import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import GoBackIcon from '../icons/goback-icon.svg'
import ItemDropdown from '../components/ItemDropdown'
import Bullet from '../components/Bullet'
import InputBullet from '../components/InputBullet'
import CVFooter from '../components/CVFooter'
import CVHeader from '../components/CVHeader'
import { editResume, getLogo, getResume, saveResume } from '../store/reducers/resume'
import { getAllManagers, getProfileImage } from '../store/reducers/user'
import PostSection from '../components/PostSection'
import Dropdown from '../components/Dropdown'
import ProfileIcon from '../icons/profile-icon.svg'

export default function NewCV() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [allManagers, setAllManagerrs] = useState([])
    const [managers, setManagers] = useState([])
    const [languages, setLanguages] = useState([{ name: '' }])
    const [skills, setSkills] = useState([{ name: '' }])
    const [education, setEducation] = useState([{ bullet: '', value: '' }])
    const [certifications, setCertifications] = useState([{ bullet: '', value: '' }])
    const [experience, setExperience] = useState([{ bullets: [''] }])
    const [strengths, setStrengths] = useState([''])
    const [expertise, setExpertise] = useState([''])
    const [buzzwords, setBuzzwords] = useState([''])
    const [profilePic, setProfilePic] = useState({})
    const [cvLogo, setcvLogo] = useState({})
    const [user, setUser] = useState({})
    const localResumes = useSelector(state => state.resume && state.resume.allResumes || [])
    const dispatch = useDispatch()
    const history = useHistory()
    const typeOptions = ['Master', 'Variant', 'Other']
    const genderOptions = ['Female', 'Male']
    const fullName = `${data.name || ''} ${data.middlename || ''} ${data.surname || ''}`
    const skillYears = Array.from({ length: 40 }, (_, i) => `${i + 1} ${i > 0 ? 'Years' : 'Year'}`)

    console.log("data", data)

    useEffect(() => {
        setLoading(true)
        const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!localUser || !localUser.email) history.push('/login')
        setUser(localUser)

        const { edit } = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })

        if (edit) setEditData(edit)
        else if (user.username && user.email && user.isManager) {
            setData({ ...data, footer_contact: user.username, footer_email: user.email })
        }

        getCVLogo()
        getManagers()
        setLoading(false)
    }, [])

    useEffect(() => {
        if (data.manager) {
            let manager = {}
            allManagers.forEach(_manager => {
                if (_manager.username === data.manager) manager = _manager
            })
            if (manager.username) {
                setData({
                    ...data,
                    footer_contact: manager.username || '',
                    footer_email: manager.email || '',
                    footer_location: manager.location || '',
                    footer_phone: manager.phone || '',
                })
            }
        }
    }, [data.manager])

    const getManagers = async () => {
        try {
            const _managers = await dispatch(getAllManagers(user)).then(data => data.payload)
            if (_managers && Array.isArray(_managers)) {
                setAllManagerrs(_managers)
                setManagers(_managers.map(manager => manager.username))
            }
        } catch (err) { console.error(err) }
    }

    const setEditData = async edit => {
        try {
            const cv = await getCVById(edit)
            if (localResumes && localResumes.length) {
                localResumes.forEach(resume => {
                    if (resume._id === edit) {
                        const resData = JSON.parse(cv && cv.data || {})
                        setData({ ...resData, ...resume })
                        setLanguages(resData.languages)
                        setSkills(resData.skills.length ? refreshTime(resData.skills, resume.date) : [{ name: '' }])
                        setEducation(resData.education.length ? resData.education : [{ bullet: '', value: '' }])
                        setCertifications(resData.certifications.length ? resData.certifications : [{ bullet: '', value: '' }])
                        setExperience(resData.experience.length ? resData.experience : [{ bullets: [''] }])
                        setStrengths(resData.strengths)
                        setExpertise(resData.expertise)
                        setBuzzwords(resData.buzzwords && resData.buzzwords.length ? resData.buzzwords : [''])
                        getPreview(resume)
                        setIsEdit(true)
                    }
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getCVById = async id => {
        try {
            const cv = await dispatch(getResume(id)).then(data => data.payload)
            return cv
        } catch (err) { console.error(err) }
    }

    const getCVLogo = async () => {
        try {
            const logo = await dispatch(getLogo({ type: 'cv-logo' })).then(data => data.payload)
            if (logo) setcvLogo(logo.data)
            else setcvLogo({})
        } catch (err) { console.error(err) }
    }

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const getPreview = async resData => {
        try {
            const image = await dispatch(getProfileImage(resData)).then(data => data.payload)
            if (image) setProfilePic({ profileImage: image.data, style: image.style && JSON.parse(image.style) || {} })
        } catch (err) {
            console.error(err)
        }
    }

    const calculateTime = (currentTime, date) => {
        if (currentTime && date) {
            const years = Number(currentTime.split(' ')[0])
            const now = new Date()
            const cvDate = new Date(date)
            const diff = now.getFullYear() - cvDate.getFullYear()
            return diff ? `${years + diff} Years` : currentTime
        }
        return '-'
    }

    const refreshTime = (skillArr, date) => {
        return skillArr.map(skill => {
            return {
                name: skill.name,
                option: calculateTime(skill.option, date)
            }
        })
    }

    const onSaveResume = async saveAsNew => {
        try {
            setLoading(true)

            const resumeData = { ...data }

            resumeData.languages = removeVoids(languages)
            resumeData.skills = removeVoids(skills)
            resumeData.education = removeVoids(education)
            resumeData.certifications = removeVoids(certifications)
            resumeData.experience = experience
            resumeData.strengths = strengths
            resumeData.expertise = expertise
            resumeData.buzzwords = buzzwords
            resumeData.footer_contact = data.footer_contact || '-'
            resumeData.footer_email = data.footer_email || '-'
            resumeData.footer_phone = data.footer_phone || '-'
            resumeData.footer_location = data.footer_location || 'Mobilvägen 10, Lund, Sweden'

            const strData = JSON.stringify(resumeData)
            resumeData.data = strData
            resumeData.notes = data.notes || ''
            resumeData.type = data.type || 'Master'
            resumeData.username = `${data.name}${data.middlename ? ' ' + data.middlename : ''} ${data.surname}` || ''
            resumeData.manager = data.manager || ''
            resumeData.managerEmail = data.footer_email || '-'
            resumeData.email = data.email || ''
            if (profilePic && profilePic.profileImage) resumeData.profilePic = profilePic.profileImage

            let saved = {}

            if (isEdit && !saveAsNew) saved = await dispatch(editResume(resumeData)).then(data => data.payload)
            else {
                delete resumeData._id
                saved = await dispatch(saveResume(resumeData)).then(data => data.payload)
            }

            if (saved) {
                setLoading(false)
                if (isEdit) toast.success('Resume updated successfully!')
                else toast.success('Resume saved successfully!')
                setTimeout(() => history.goBack(), 2000)
            } else {
                setLoading(false)
                return toast.error('Error saving Resume. Please try again later')
            }
        } catch (err) {
            toast.error('Error saving Resume. Please try again later')
            console.error(err)
            setLoading(false)
        }
    }

    const removeVoids = arr => {
        return arr.filter(item => item.name || item.value || item.bullet)
    }

    return (
        <div className='new-resume-container'>
            <ToastContainer autoClose={2000} />
            <CVHeader data={data} cvLogo={cvLogo} />
            <div className='separator'></div>
            <h2 className='section-title-row'>Personal Information</h2>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <>
                        {profilePic.profileImage ?
                            <img
                                src={profilePic.profileImage}
                                style={profilePic.style}
                                className='profile-image'
                                onClick={() => document.getElementById('profileImage').click()}
                            />
                            :
                            <img
                                src={ProfileIcon}
                                style={profilePic.style}
                                className='account-profile-image-svg'
                                onClick={() => document.getElementById('profileImage').click()}
                            />}
                        <InputField
                            label='Profile Image'
                            type='file'
                            name='profileImage'
                            filename='profileImage'
                            image={profilePic}
                            setImage={setProfilePic}
                            style={{ color: 'rgb(71, 71, 71)' }}
                        />
                    </>
                    <InputField
                        label='Name'
                        type='text'
                        name='name'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.name || ''}
                        placeholder='Anna'
                    />
                    <InputField
                        label='Middle Name'
                        type='text'
                        name='middlename'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.middlename || ''}
                        placeholder='Grabielle'
                    />
                    <InputField
                        label='Surname'
                        type='text'
                        name='surname'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.surname || ''}
                        placeholder='Kessler'
                    />
                    <InputField
                        label='Role / Title'
                        type='text'
                        name='role'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.role || ''}
                        placeholder='Android Developer'
                    />
                    <Dropdown
                        label='Gender'
                        name='gender'
                        options={genderOptions}
                        value={data.gender}
                        updateData={updateData}
                    />
                    <InputField
                        label='Location'
                        type='text'
                        name='location'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.location || ''}
                        placeholder='Street, city, country'
                    />
                    <ItemDropdown
                        label='Languages'
                        name='languages'
                        options={['Basic', 'Intermediate', 'Fluent', 'Native']}
                        items={languages}
                        setItems={setLanguages}
                        placeholder='Add new language...'
                        style={{ width: '6.5vw' }}
                    />
                </div>
                <div className='resume-fill-col2'>
                    <InputField
                        label='Presentation'
                        type='textarea'
                        cols={70}
                        rows={15}
                        name='description'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        placeholder="Write a personal presentation..."
                        value={data.description || ''}
                    />
                    <Bullet
                        label='Strengths'
                        type='big'
                        items={strengths}
                        setItems={setStrengths}
                        placeholder='Add new strength...'
                    />
                    <InputField
                        label='Email'
                        type='text'
                        name='email'
                        updateData={updateData}
                        placeholder='full.name@sigma.se'
                        style={{ color: 'rgb(71, 71, 71)', width: '55%', marginBottom: '1vw' }}
                        value={data.email || ''}
                    />
                    {<h4 className='signature-text'>{fullName || ''}</h4>}
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <h2 className='section-title'>Expertise</h2>
                </div>
                <div className='resume-fill-col2'>
                    <Bullet
                        label=''
                        type='big'
                        items={expertise}
                        setItems={setExpertise}
                        placeholder='Add new expertise...'
                    />
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <h2 className='section-title'>Education</h2>
                </div>
                <div className='resume-fill-col2'>
                    <InputBullet
                        label=''
                        items={education}
                        setItems={setEducation}
                        bulletPlaceholder='Period'
                        valuePlaceholder='Title'
                    />
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <h2 className='section-title'>Certifications / Courses</h2>
                </div>
                <div className='resume-fill-col2'>
                    <InputBullet
                        label=''
                        items={certifications}
                        setItems={setCertifications}
                        bulletPlaceholder='Period'
                        valuePlaceholder='Title'
                    />
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <h2 className='section-title'>Main Skills</h2>
                </div>
                <div className='resume-fill-col2'>
                    <ItemDropdown
                        label=''
                        name='skills'
                        options={skillYears}
                        items={skills}
                        setItems={setSkills}
                        placeholder='Add new skill...'
                    />
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1-dif'>
                    <h2 className='section-title'>Experience</h2>
                </div>
                <div className='resume-fill-col2-dif'>
                    <PostSection
                        label=''
                        items={experience}
                        setItems={setExperience}
                    />
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <h2 className='section-title'>Other Tools & Software</h2>
                </div>
                <div className='resume-fill-col2'>
                    <InputField
                        label=''
                        type='textarea'
                        cols={65}
                        rows={6}
                        name='tools'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        placeholder="Describe what other tools you have used..."
                        value={data.tools || ''}
                    />
                </div>
            </div>

            {user.isManager &&
                <>
                    <div className='separator'></div>
                    <Dropdown
                        label='Consultant Manager'
                        name='manager'
                        options={managers}
                        value={data.manager}
                        updateData={updateData}
                        size='15vw'
                        />
                    <CVFooter
                        updateData={updateData}
                        user={user}
                        data={data}
                    />

                    <div className='separator'></div>
                    <div className='new-resume-fill'>
                        <div className='resume-fill-col1'>
                            <h2 className='section-title'>CV Data (internal use)</h2>
                        </div>
                        <div className='resume-fill-col2'>
                            <Dropdown
                                label='Type'
                                name='type'
                                options={typeOptions}
                                value={data.type}
                                updateData={updateData}
                                size='10vw'
                            />
                            <Bullet
                                label='Buzzwords'
                                type='big'
                                items={buzzwords}
                                setItems={setBuzzwords}
                                placeholder='Add buzzword...'
                            />
                    <InputField
                        label='Note'
                        type='textarea'
                        cols={70}
                        rows={6}
                        name='note'
                        updateData={updateData}
                        placeholder="e.g: Exported January 28th for [Client Name] by [Manager Name]"
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.note || ''}
                    />
                        </div>
                    </div>
                </>
            }
            <div className='new-resume-btns'>
                <CTAButton
                    label='Discard'
                    color={APP_COLORS.GRAY}
                    handleClick={() => history.push('/cvs')}
                />
                <CTAButton
                    label={isEdit ? 'Update' : 'Save'}
                    color={APP_COLORS.GREEN}
                    handleClick={() => onSaveResume(false)}
                    loading={loading}
                />
                {isEdit ?
                    <CTAButton
                        label='Save as new'
                        color={APP_COLORS.GREEN}
                        handleClick={() => onSaveResume(true)}
                        loading={loading}
                    />
                    : ''}
            </div>
        </div>
    )
}
