import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { createUser } from '../store/reducers/user'
import SwitchBTN from '../components/SwitchBTN'
import MoonLoader from "react-spinners/MoonLoader"
import ItemDropdown from '../components/ItemDropdown'
import Bullet from '../components/Bullet'
import InputBullet from '../components/InputBullet'
import CVFooter from '../components/CVFooter'
import CVHeader from '../components/CVHeader'
import { editResume, getProfileImage, saveResume } from '../store/reducers/resume'
import PostSection from '../components/PostSection'

export default function NewResume() {
    const [data, setData] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [languages, setLanguages] = useState([{ name: '' }])
    const [skills, setSkills] = useState([{ name: '' }])
    const [education, setEducation] = useState([{ bullet: '', value: '' }])
    const [certifications, setCertifications] = useState([{ bullet: '', value: '' }])
    const [experience, setExperience] = useState([{ bullets: [''] }])
    const [strengths, setStrengths] = useState([''])
    const [expertise, setExpertise] = useState([''])
    const [profilePic, setProfilePic] = useState({})
    const [user, setUser] = useState({})
    const localResumes = useSelector(state => state.resume)
    const dispatch = useDispatch()
    const history = useHistory()

    const fullName = `${data.name || ''} ${data.middlename || ''} ${data.surname || ''}`

    useEffect(() => {
        setLoading(true)
        const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!localUser || !localUser.email) history.push('/login')
        setUser(localUser)

        const { edit } = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })

        if (edit) {
            if (localResumes && localResumes.length) {
                localResumes.forEach(resume => {
                    if (resume._id === edit) {
                        const resData = JSON.parse(resume.data)
                        setData(resData)
                        setLanguages(resData.languages)
                        setSkills(resData.skills)
                        setEducation(resData.education)
                        setCertifications(resData.certifications)
                        setExperience(resData.experience)
                        setStrengths(resData.strengths)
                        setExpertise(resData.expertise)
                        getPreview(resume)
                        setIsEdit(true)
                    }
                })
            }
        }

        else if (user.username && user.email && user.isManager) {
            setData({ ...data, footer_contact: user.username, footer_email: user.email })
        }

        setLoading(false)
    }, [])

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const getPreview = async resData => {
        try {
            const image = await dispatch(getProfileImage(resData)).then(data => data.payload)
            if (image) setProfilePic({ profileImage: image.data })
        } catch (err) {
            console.error(err)
        }
    }
    const onSaveResume = async () => {
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
            resumeData.footer_contact = data.footer_contact || '-'
            resumeData.footer_email = data.footer_email || '-'
            resumeData.footer_phone = data.footer_phone || '-'
            resumeData.footer_location = data.footer_location || 'Mobilvägen 10, Lund, Sweden'

            const strData = JSON.stringify(resumeData)
            resumeData.data = strData
            resumeData.date = new Date()
            resumeData.username = user.username
            resumeData.manager = user.email
            resumeData.email = data.email || ''
            if (profilePic && profilePic.profileImage) resumeData.profilePic = profilePic.profileImage

            let saved = {}

            if (isEdit) saved = await dispatch(editResume(resumeData)).then(data => data.payload)
            else saved = await dispatch(saveResume(resumeData)).then(data => data.payload)

            if (saved) {
                setLoading(false)
                toast.success('Resume saved successfully! Redirecting...')
                setTimeout(() => history.goBack(), 2500)
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
            <h4 className='go-back-btn' onClick={() => history.goBack()}>Go back</h4>
            <h2 className='page-title'>New Resume</h2>
            <CVHeader data={data} />
            <div className='separator'></div>
            <h2 className='section-title-row'>Personal Information</h2>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    <>
                        {profilePic.profileImage ? <img src={profilePic.profileImage} className='profile-image'/> : ''}
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
                    />
                    <InputField
                        label='Middle Name'
                        type='text'
                        name='middlename'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.middlename || ''}
                    />
                    <InputField
                        label='Surname'
                        type='text'
                        name='surname'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.surname || ''}
                    />
                    <InputField
                        label='Role / Title'
                        type='text'
                        name='role'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.role || ''}
                    />
                    <InputField
                        label='Gender'
                        placeholder='Male, Female...'
                        type='text'
                        name='gender'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.gender || ''}
                    />
                    <InputField
                        label='Location'
                        type='text'
                        name='location'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.location || ''}
                    />
                    <ItemDropdown
                        label='Languages'
                        name='languages'
                        options={['Basic', 'Intermediate', 'Fluent', 'Native']}
                        items={languages}
                        setItems={setLanguages}
                        placeholder='Add new language...'
                    />
                </div>
                <div className='resume-fill-col2'>
                    <InputField
                        label='Short Description'
                        type='textarea'
                        cols={10}
                        rows={15}
                        name='description'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        placeholder="Write a short description about yourself..."
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
                        bulletPlaceholder='Year...'
                        valuePlaceholder='Title...'
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
                        bulletPlaceholder='Year...'
                        valuePlaceholder='Title...'
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
                        options={Array.from({ length: 10 }, (_, i) => `${i + 1} ${i > 0 ? 'Years' : 'Year'}`).concat('>10 Years')}
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
                    <h2 className='section-title'>Tools</h2>
                </div>
                <div className='resume-fill-col2'>
                    <InputField
                        label=''
                        type='textarea'
                        cols={10}
                        rows={6}
                        name='tools'
                        updateData={updateData}
                        placeholder="Describe tools you've been using..."
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.tools || ''}
                    />
                </div>
            </div>

            {user.isManager &&
                <>
                    <div className='separator'></div>
                    <CVFooter
                        updateData={updateData}
                        user={user}
                        data={data}
                    />
                </>
            }
            {!loading ?
                <div className='new-resume-btns'>
                    <CTAButton
                        label='Discard'
                        size='100%'
                        color={APP_COLORS.GRAY}
                        handleClick={() => history.goBack()}
                    />
                    <CTAButton
                        label='Save'
                        size='100%'
                        color={APP_COLORS.MURREY}
                        handleClick={onSaveResume}
                    />
                </div>
                :
                <div style={{ alignSelf: 'center', display: 'flex' }}><MoonLoader color='#6D0E00' /></div>
            }
        </div>
    )
}
