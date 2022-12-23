import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import ItemDropdown from '../components/ItemDropdown'
import Bullet from '../components/Bullet'
import InputBullet from '../components/InputBullet'
import CVFooter from '../components/CVFooter'
import CVHeader from '../components/CVHeader'
import { editResume, getLogo, getResume, getResumes, saveResume } from '../store/reducers/resume'
import { getAllManagers, getProfileImage } from '../store/reducers/user'
import PostSection from '../components/PostSection'
import Dropdown from '../components/Dropdown'
import ProfileIcon from '../icons/profile-icon.svg'
import PlusIcon from '../icons/plus-icon.svg'
import MinusIcon from '../icons/minus-icon.svg'
import HideIcon from '../icons/hide-icon.svg'
import ShwoIcon from '../icons/show-icon.svg'
import Slider from '../components/Slider'

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
    const [experience, setExperience] = useState([{ bullets: [{ value: '' }] }])
    const [hiddenSections, setHiddenSections] = useState({ postSection: {} })
    const [strengths, setStrengths] = useState([{ value: '' }])
    const [expertise, setExpertise] = useState([{ value: '' }])
    const [otherTools, setOtherTools] = useState([{ value: '' }])
    const [buzzwords, setBuzzwords] = useState([''])
    const [profilePic, setProfilePic] = useState({})
    const [cvLogo, setcvLogo] = useState({})
    const [hiddenItems, setHiddenItems] = useState([])
    const [allResumes, setAllResumes] = useState([])
    const [scale, setScale] = useState(1)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const [rotate, setRotate] = useState(0)
    const [contrast, setContrast] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const dispatch = useDispatch()
    const history = useHistory()
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || {}
    const typeOptions = ['Master', 'Variant', 'Other']
    const genderOptions = ['Female', 'Male', 'Other', 'Prefer not to say']
    const fullName = `${data.name || ''}${data.middlename ? ` ${data.middlename} ` : ' '}${data.surname || ''}`
    const skillYears = Array.from({ length: 40 }, (_, i) => `${i + 1} ${i > 0 ? 'Years' : 'Year'}`)

    // console.log("data", data)
    // console.log("profilePic", profilePic)
    // console.log("hiddenItems", hiddenItems)

    useEffect(() => {
        setLoading(true)
        if (!user || !user.email) history.push('/login')

        getAllResumes(true)
        getCVLogo()
        getManagers()
        setLoading(false)
    }, [])

    useEffect(() => {
        if (allResumes.length) {
            const edit = new URLSearchParams(document.location.search).get('edit')
            if (edit) setEditData(edit)
        }
    }, [allResumes])

    useEffect(() => {
        setProfilePic({
            ...profilePic,
            style: {
                ...profilePic.style,
                transform: `scale(${scale}) translate(${translateX}%, ${translateY}%) rotate(${rotate}deg)`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`,
                s: scale,
                x: translateX,
                y: translateY,
                r: rotate
            }
        })
    }, [scale, translateX, translateY, rotate, contrast, brightness, grayscale])


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

    const getAllResumes = async getAll => {
        if (user && user.email) {
            try {
                const cvs = await dispatch(getResumes({ ...user, getAll })).then(data => data.payload)
                if (cvs && Array.isArray(cvs)) setAllResumes(cvs)
            } catch (err) {
                console.error(err)
            }
        }
    }

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
            if (allResumes && allResumes.length) {
                allResumes.forEach(resume => {
                    if (resume._id === edit) {
                        const resData = JSON.parse(cv && cv.data || {})

                        setIsEdit(true)
                        setData({ ...resData, ...resume })
                        setLanguages(resData.languages)
                        setSkills(resData.skills.length ? refreshTime(resData.skills, resume.date) : [{ name: '' }])
                        setEducation(resData.education.length ? resData.education : [{ bullet: '', value: '' }])
                        setCertifications(resData.certifications.length ? resData.certifications : [{ bullet: '', value: '' }])
                        setExperience(resData.experience && resData.experience.length ? resData.experience : [{ bullets: [{ value: '' }] }])
                        setHiddenSections(resData.hiddenSections ? resData.hiddenSections : { postSection: {} })
                        setHiddenItems(resData.hiddenSections.hiddenItems ? resData.hiddenSections.hiddenItems : [])
                        setStrengths(resData.strengths && resData.strengths.length ? resData.strengths : [{ value: '' }])
                        setExpertise(resData.expertise && resData.expertise.length ? resData.expertise : [{ value: '' }])
                        setOtherTools(resData.otherTools && resData.otherTools.length ? resData.otherTools : [{ value: '' }])
                        setBuzzwords(resData.buzzwords && resData.buzzwords.length ? resData.buzzwords : [''])
                        getPreview(resume.email)
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
            const logo = await dispatch(getLogo({ type: 'CV Logo' })).then(data => data.payload)
            if (logo) setcvLogo(logo.data)
            else setcvLogo({})
        } catch (err) { console.error(err) }
    }

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const getPreview = async email => {
        try {
            const image = await dispatch(getProfileImage({ email })).then(data => data.payload)
            if (image) {
                const imageStyle = image.style && JSON.parse(image.style) || {}
                setProfilePic({ image: image.data, style: imageStyle })
                setTranslateX(imageStyle.x || 0)
                setTranslateY(imageStyle.y || 0)
                setScale(imageStyle.s || 1)
                setRotate(imageStyle.r || 0)
                setBrightness(imageStyle.brightness >= 0 ? imageStyle.brightness : 100)
                setContrast(imageStyle.contrast >= 0 ? imageStyle.contrast : 100)
                setGrayscale(imageStyle.grayscale || 0)
            }
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
                option: calculateTime(skill.option, date),
                hidden: skill.hidden || ''
            }
        })
    }

    const onSaveResume = async saveAsNew => {
        try {
            setLoading(true)

            const resumeData = { ...data }

            resumeData.languages = languages
            resumeData.skills = skills
            resumeData.education = education
            resumeData.certifications = certifications
            resumeData.experience = experience
            resumeData.strengths = strengths
            resumeData.expertise = expertise
            resumeData.otherTools = otherTools
            resumeData.buzzwords = buzzwords
            resumeData.hiddenSections = { ...hiddenSections, hiddenItems }
            resumeData.footer_contact = data.footer_contact || '-'
            resumeData.footer_email = data.footer_email || '-'
            resumeData.footer_phone = data.footer_phone || '-'
            resumeData.footer_location = data.footer_location || '-'

            const strData = JSON.stringify(resumeData)
            resumeData.data = strData
            resumeData.note = data.note || `${user.username ? `Created by ${user.username}` : ''}`
            resumeData.type = data.type || 'Master'
            resumeData.username = `${data.name}${data.middlename ? ' ' + data.middlename : ''} ${data.surname || ''}`
            resumeData.managerName = data.footer_contact || ''
            resumeData.managerEmail = data.footer_email || '-'
            resumeData.email = data.email || ''
            resumeData.user = user

            if (profilePic && profilePic.image) resumeData.profilePic = profilePic

            let saved = {}

            if (isEdit && !saveAsNew) saved = await dispatch(editResume(resumeData)).then(data => data.payload)
            else {
                delete resumeData._id
                saved = await dispatch(saveResume(resumeData)).then(data => data.payload)
            }

            if (saved) {
                setLoading(false)
                if (isEdit) toast.success('Resume updated successfully!')
                else {
                    toast.success('Resume saved successfully!')
                    setTimeout(() => history.goBack(), 2000)
                }
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
                        {profilePic.image ?
                            <div className='profile-image-section'>
                                <div className='profile-image-cover'>
                                    <img
                                        src={profilePic.image}
                                        style={profilePic.style}
                                        className='profile-image'
                                        onClick={() => document.getElementById('image').click()}
                                        loading='lazy'
                                    />
                                </div>
                                <div className='profile-image-settings'>
                                    <div>
                                        <Slider
                                            label='Position X'
                                            sign='%'
                                            value={translateX}
                                            setValue={setTranslateX}
                                            min={-100}
                                            max={100}
                                        />
                                        <Slider
                                            label='Position Y'
                                            sign='%'
                                            value={translateY}
                                            setValue={setTranslateY}
                                            min={-100}
                                            max={100}
                                        />
                                        <Slider
                                            label='Scale'
                                            sign=''
                                            value={scale}
                                            setValue={setScale}
                                            min={0}
                                            max={3}
                                            step={0.01}
                                        />
                                        <Slider
                                            label='Rotate'
                                            sign='°'
                                            value={rotate}
                                            setValue={setRotate}
                                            min={0}
                                            max={360}
                                        />
                                    </div>
                                    <div>
                                        <Slider
                                            label='Contrast'
                                            sign='%'
                                            value={contrast}
                                            setValue={setContrast}
                                            min={0}
                                            max={200}
                                        />
                                        <Slider
                                            label='Brightness'
                                            sign='%'
                                            value={brightness}
                                            setValue={setBrightness}
                                            min={0}
                                            max={200}
                                        />
                                        <Slider
                                            label='Gray Scale'
                                            sign='%'
                                            value={grayscale}
                                            setValue={setGrayscale}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                </div>
                            </div>
                            :
                            <img
                                src={ProfileIcon}
                                className='profile-image-svg'
                                onClick={() => document.getElementById('image').click()}
                            />}
                        <InputField
                            label='Profile Image'
                            type='file'
                            name='image'
                            filename='image'
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
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <InputField
                        label='Middle Name'
                        type='text'
                        name='middlename'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.middlename || ''}
                        placeholder='Grabielle'
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <InputField
                        label='Surname'
                        type='text'
                        name='surname'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.surname || ''}
                        placeholder='Kessler'
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <InputField
                        label='Role / Title'
                        type='text'
                        name='role'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.role || ''}
                        placeholder='Android Developer'
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <Dropdown
                        label='Gender'
                        name='gender'
                        options={genderOptions}
                        value={data.gender}
                        updateData={updateData}
                        size='98%'
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <InputField
                        label='Location'
                        type='text'
                        name='location'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)' }}
                        value={data.location || ''}
                        placeholder='Mobilvägen 10, Lund, Sweden'
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
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
                <div className='resume-fill-col2-personal'>
                    <InputField
                        label='Presentation'
                        type='textarea'
                        // cols={68}
                        rows={15}
                        name='presentation'
                        updateData={updateData}
                        style={{ color: 'rgb(71, 71, 71)', width: '32vw' }}
                        placeholder="Anna is a nice fun and friendly person. 
                        She work well in a team but also on her own as she like to
                        set herself goals which she will achieve. She has good listening and 
                        communication skills plus a creative mind that makes her being always up for new challenges..."
                        value={data.presentation || ''}
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <Bullet
                        label='Strengths'
                        type='big'
                        items={strengths}
                        setItems={setStrengths}
                        placeholder='Add new strength...'
                        id='strengths'
                    />
                    <InputField
                        label='Email'
                        type='text'
                        name='email'
                        updateData={updateData}
                        placeholder='consultant.name@sigma.se'
                        style={{ color: 'rgb(71, 71, 71)', width: '60%', marginBottom: '1vw' }}
                        value={data.email || ''}
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                    />
                    <div className='signature-container'>
                        <h4 className='signature-text' style={{ opacity: hiddenItems.includes('signature') && '.2' }}>{fullName || ''}</h4>
                        {hiddenItems.includes('signature') ?
                            <img
                                src={ShwoIcon}
                                className='hide-icon-signature'
                                onClick={() => setHiddenItems(hiddenItems.filter(item => item !== 'signature'))}
                            />
                            :
                            <img
                                src={HideIcon}
                                className='hide-icon-signature'
                                onClick={() => {
                                    const _hidden = [...hiddenItems]
                                    _hidden.push('signature')
                                    setHiddenItems(_hidden)
                                }}
                            />
                        }
                    </div>
                </div>
            </div>

            <div className='separator'></div>
            {<div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    {hiddenSections.expertise ? '' : <h2 className='section-title'>Expertise</h2>}
                </div>
                <div className='resume-fill-col2'>
                    {hiddenSections.expertise ? '' :
                        <Bullet
                            label=''
                            type='big'
                            items={expertise}
                            setItems={setExpertise}
                            placeholder='Add new expertise...'
                            id='expertise'
                        />}
                    {hiddenSections.expertise ?
                        <img
                            src={PlusIcon}
                            className='hide-section-icon no-top'
                            onClick={() => setHiddenSections({ ...hiddenSections, expertise: '' })}
                            style={{ display: 'block' }}
                        />
                        :
                        <img
                            src={MinusIcon}
                            className='hide-section-icon'
                            onClick={() => setHiddenSections({ ...hiddenSections, expertise: 'true' })}
                        />}
                </div>
            </div>}

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    {hiddenSections.education ? '' : <h2 className='section-title'>Education</h2>}
                </div>
                <div className='resume-fill-col2'>
                    {hiddenSections.education ? '' :
                        <InputBullet
                            label=''
                            items={education}
                            setItems={setEducation}
                            bulletPlaceholder='2018'
                            valuePlaceholder='Bachelor of Computer Science, MIT'
                            id='education'
                        />}
                    {hiddenSections.education ?
                        <img
                            src={PlusIcon}
                            className='hide-section-icon no-top'
                            onClick={() => setHiddenSections({ ...hiddenSections, education: '' })}
                            style={{ display: 'block' }}
                        />
                        :
                        <img
                            src={MinusIcon}
                            className='hide-section-icon'
                            onClick={() => setHiddenSections({ ...hiddenSections, education: 'true' })}
                        />}
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    {hiddenSections.certifications ? '' : <h2 className='section-title'>Certifications / Courses</h2>}
                </div>
                <div className='resume-fill-col2'>
                    {hiddenSections.certifications ? '' :
                        <InputBullet
                            label=''
                            items={certifications}
                            setItems={setCertifications}
                            bulletPlaceholder='2019'
                            valuePlaceholder='Android Development Certification'
                            id='certifications'
                        />}
                    {hiddenSections.certifications ?
                        <img
                            src={PlusIcon}
                            className='hide-section-icon no-top'
                            onClick={() => setHiddenSections({ ...hiddenSections, certifications: '' })}
                            style={{ display: 'block' }}
                        />
                        :
                        <img
                            src={MinusIcon}
                            className='hide-section-icon'
                            onClick={() => setHiddenSections({ ...hiddenSections, certifications: 'true' })}
                        />}
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    {hiddenSections.skills ? '' : <h2 className='section-title'>Main Skills</h2>}
                </div>
                <div className='resume-fill-col2'>
                    {hiddenSections.skills ? '' :
                        <ItemDropdown
                            label=' '
                            name='skills'
                            options={skillYears}
                            items={skills}
                            setItems={setSkills}
                            placeholder='Add new skill...'
                        />}
                    {hiddenSections.skills ?
                        <img
                            src={PlusIcon}
                            className='hide-section-icon no-top'
                            onClick={() => setHiddenSections({ ...hiddenSections, skills: '' })}
                            style={{ display: 'block' }}
                        />
                        :
                        <img
                            src={MinusIcon}
                            className='hide-section-icon'
                            onClick={() => setHiddenSections({ ...hiddenSections, skills: 'true' })}
                        />}
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1-dif'>
                    {hiddenSections.experience ? '' : <h2 className='section-title'>Experience</h2>}
                </div>
                <div className='resume-fill-col2-dif'>
                    {hiddenSections.experience ? '' :
                        <PostSection
                            label=''
                            items={experience}
                            setItems={setExperience}
                            hidden={hiddenSections}
                            setHidden={setHiddenSections}
                            id='post-section'
                        />}
                    {hiddenSections.experience ?
                        <img
                            src={PlusIcon}
                            className='hide-section-icon no-top'
                            onClick={() => setHiddenSections({ ...hiddenSections, experience: '' })}
                            style={{ display: 'block' }}
                        />
                        :
                        <img
                            src={MinusIcon}
                            className='hide-section-icon'
                            onClick={() => setHiddenSections({ ...hiddenSections, experience: 'true' })}
                        />}
                </div>
            </div>

            <div className='separator'></div>
            <div className='new-resume-fill'>
                <div className='resume-fill-col1'>
                    {hiddenSections.tools ? '' : <h2 className='section-title'>Other Tools & Software</h2>}
                </div>
                <div className='resume-fill-col2'>
                    {hiddenSections.tools ? '' :
                        <Bullet
                            label=''
                            type='big'
                            items={otherTools}
                            setItems={setOtherTools}
                            placeholder='Altium Designer'
                            id='otherTools'
                        />
                    }
                    {hiddenSections.tools ?
                        <img
                            src={PlusIcon}
                            className='hide-section-icon no-top'
                            onClick={() => setHiddenSections({ ...hiddenSections, tools: '' })}
                            style={{ display: 'block' }}
                        />
                        :
                        <img
                            src={MinusIcon}
                            className='hide-section-icon'
                            onClick={() => setHiddenSections({ ...hiddenSections, tools: 'true' })}
                        />}
                </div>
            </div>

            {user.isManager &&
                <>
                    <div className='separator'></div>                        
                        <CVFooter
                            updateData={updateData}
                            user={user}
                            data={data}
                            managers={managers}
                            manager={data.manager}
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
                                size='15vw'
                            />
                            <Bullet
                                label='Buzzwords'
                                type='big'
                                items={buzzwords}
                                setItems={setBuzzwords}
                                placeholder='Add buzzword...'
                                id='buzzwords'
                            />
                            <InputField
                                label='Note'
                                type='textarea'
                                // cols={70}
                                rows={6}
                                name='note'
                                updateData={updateData}
                                placeholder='e.g. "Exported January 28th for [Client Name] by [Manager Name]"'
                                style={{ color: 'rgb(71, 71, 71)', width: '35vw' }}
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
