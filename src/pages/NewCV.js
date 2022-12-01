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
import { editResume, getLogo, saveResume } from '../store/reducers/resume'
import { getProfileImage } from '../store/reducers/user'
import PostSection from '../components/PostSection'

export default function NewCV() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [languages, setLanguages] = useState([{ name: '' }])
    const [skills, setSkills] = useState([{ name: '' }])
    const [education, setEducation] = useState([{ bullet: '', value: '' }])
    const [certifications, setCertifications] = useState([{ bullet: '', value: '' }])
    const [experience, setExperience] = useState([{ bullets: [''] }])
    const [strengths, setStrengths] = useState([''])
    const [expertise, setExpertise] = useState([''])
    const [tags, setTags] = useState([''])
    const [profilePic, setProfilePic] = useState({})
    const [cvLogo, setcvLogo] = useState({})
    const [user, setUser] = useState({})
    const localResumes = useSelector(state => state.resume && state.resume.allResumes || [])
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
                        setData({ ...resData, ...resume })
                        setLanguages(resData.languages)
                        setSkills(resData.skills)
                        setEducation(resData.education)
                        setCertifications(resData.certifications)
                        setExperience(resData.experience)
                        setStrengths(resData.strengths)
                        setExpertise(resData.expertise)
                        setTags(resData.tags && resData.tags.length ? resData.tags : [''])
                        getPreview(resume)
                        setIsEdit(true)
                    }
                })
            }
        }

        else if (user.username && user.email && user.isManager) {
            setData({ ...data, footer_contact: user.username, footer_email: user.email })
        }

        getCVLogo()
        setLoading(false)
    }, [])

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
            resumeData.tags = tags
            resumeData.footer_contact = data.footer_contact || '-'
            resumeData.footer_email = data.footer_email || '-'
            resumeData.footer_phone = data.footer_phone || '-'
            resumeData.footer_location = data.footer_location || 'Mobilvägen 10, Lund, Sweden'

            const strData = JSON.stringify(resumeData)
            resumeData.data = strData
            resumeData.date = new Date()
            resumeData.username = `${data.name} ${data.middlename ? data.middlename : ''} ${data.surname}` || ''
            resumeData.manager = user.manager || user.email
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
                        {profilePic.profileImage ? <img src={profilePic.profileImage} style={profilePic.style} className='profile-image' /> : ''}
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
                        cols={70}
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
                        cols={70}
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
                    <div className='new-resume-fill'>
                        <div className='resume-fill-col1'>
                            <h2 className='section-title'>Keywords (Internal use)</h2>
                        </div>
                        <div className='resume-fill-col2'>
                            <Bullet
                                label=''
                                type='big'
                                items={tags}
                                setItems={setTags}
                                placeholder='Add keyword...'
                            />
                        </div>
                    </div>
                </>}

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
