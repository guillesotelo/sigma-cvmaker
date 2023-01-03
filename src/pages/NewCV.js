import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import ItemDropdown from '../components/ItemDropdown'
import Bullet from '../components/Bullet'
import InputBullet from '../components/InputBullet'
import Slider from '../components/Slider'
import CVFooter from '../components/CVFooter'
import CVHeader from '../components/CVHeader'
import { editResume, getCVByType, getLogo, getResume, getResumes, saveResume } from '../store/reducers/resume'
import { getAllManagers, updateUserData } from '../store/reducers/user'
import { getClientLogo, getImageByType } from '../store/reducers/image'
import PostSection from '../components/PostSection'
import Dropdown from '../components/Dropdown'
import ProfileIcon from '../icons/profile-icon.svg'
import PlusIcon from '../icons/plus-icon.svg'
import MinusIcon from '../icons/minus-icon.svg'
import HideIcon from '../icons/hide-icon.svg'
import ShwoIcon from '../icons/show-icon.svg'
import FontIcon from '../icons/fontsize-icon.svg'
import PaddingIcon from '../icons/padding-icon.svg'
import SignaturePad from 'react-signature-canvas'
import Resume from '../components/Resume'
import { promises } from 'nodemailer/lib/xoauth2'

export default function NewCV() {
    const [data, setData] = useState({})
    const [previewData, setPreviewData] = useState({})
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
    const [clientLogos, setClientLogos] = useState({})
    const [scale, setScale] = useState(1)
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)
    const [rotate, setRotate] = useState(0)
    const [contrast, setContrast] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const [fontDrop, setFontDrop] = useState(false)
    const [paddingDrop, setPaddingDrop] = useState(false)
    const [fontSize, setFontSize] = useState({})
    const [padding, setPadding] = useState({})
    const [signatureCanvas, setSignatureCanvas] = useState({})
    const [masterModal, setMasterModal] = useState(false)
    const [previewModal, setPreviewModal] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || {}
    const typeOptions = ['Master', 'Variant', 'Other']
    const genderOptions = ['Female', 'Male', 'Other', 'Prefer not to say']
    const fullName = `${data.name || ''}${data.middlename ? ` ${data.middlename} ` : ' '}${data.surname || ''}`
    const skillYears = Array.from({ length: 40 }, (_, i) => `${i + 1} ${i > 0 ? 'Years' : 'Year'}`)
    const sigCanvas = useRef({})

    // console.log("data", data)

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
        setFontSize(data.settings && data.settings.fontSize ? data.settings.fontSize : {})
        setPadding(data.settings && data.settings.padding ? data.settings.padding : {})
    }, [data.settings])

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
                        setFontSize(resData.settings && resData.settings.fontSize ? resData.settings.fontSize : {})
                        setPadding(resData.settings && resData.settings.padding ? resData.settings.padding : {})
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
                        getImages(resume.email, resData.experience.map(exp => { if (exp && exp.company) return exp.company }))
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

    const getImages = async (email, clients) => {
        try {
            const image = await dispatch(getImageByType({ email, type: 'Profile' })).then(data => data.payload)
            const signature = await dispatch(getImageByType({ email, type: 'Signature' })).then(data => data.payload)
            const logos = await Promise.all(clients.map(async client => {
                const image = await dispatch(getClientLogo(client)).then(data => data.payload)
                return {
                    ...image,
                    image: image.data,
                    style: image.style ? JSON.parse(image.style) : {}
                }
            }))

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

            if (signature) {
                const signatureStyle = signature.style && JSON.parse(signature.style) || {}
                setSignatureCanvas({ image: signature.data, style: signatureStyle })
            }

            if (logos && Array.isArray(logos)) {
                const _clientLogos = {}
                logos.forEach((logo, i) => {
                    _clientLogos[i] = logo
                })
                setClientLogos(_clientLogos)
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

    const checkCVData = () => {
        let check = true
        if (!data.name || !data.surname) {
            check = false
            toast.error('Please add a Name and Surname')
        }
        if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
            check = false
            toast.error('Please add a valid Email')
        }
        if (!data.role) {
            check = false
            toast.error('Please add a Role / Title')
        }
        if (!data.type) {
            check = false
            toast.error('Please select CV Type')
        }
        if (!data.footer_contact || !data.footer_email) {
            check = false
            toast.error('Please add Manager Contact Info')
        }
        return check
    }

    const onSaveResume = async saveAsNew => {
        try {
            setLoading(true)
            if (checkCVData()) {
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
                resumeData.footer_contact = data.footer_contact || ''
                resumeData.footer_email = data.footer_email || ''
                resumeData.footer_phone = data.footer_phone || ''
                resumeData.footer_location = data.footer_location || ''

                const strData = JSON.stringify(resumeData)
                resumeData.data = strData
                resumeData.note = data.note || `${user.username ? `Created by ${user.username}` : ''}`
                resumeData.type = data.type || 'Master'
                resumeData.username = `${data.name}${data.middlename ? ' ' + data.middlename : ''} ${data.surname || ''}`
                resumeData.managerName = data.footer_contact || ''
                resumeData.managerEmail = data.footer_email || ''
                resumeData.email = data.email ? data.email.toLowerCase() : ''
                resumeData.user = user

                const managerUpdated = await dispatch(updateUserData({
                    user,
                    email: data.email ? data.email.toLowerCase() : '',
                    newData: {
                        managerName: data.footer_contact || '',
                        managerEmail: data.footer_email || ''
                    },
                    managerUpdate: true
                })).then(data => data.payload)

                if (profilePic && profilePic.image) resumeData.profilePic = profilePic
                if (signatureCanvas && signatureCanvas.image) resumeData.signatureCanvas = signatureCanvas
                if (clientLogos && Object.keys(clientLogos).length) {
                    resumeData.clientLogos = clientLogos
                    resumeData.clients = experience.map(exp => { if (exp && exp.company) return exp.company })
                }

                if (!isEdit && saveAsNew && data.type === 'Master') {
                    const exists = await dispatch(getCVByType({ type: 'Master', email: data.email.toLowerCase() })).then(data => data.payload)
                    if (exists) {
                        setLoading(false)
                        return toast.error(`Master type for ${fullName} already exists. Please change it to Variant`)
                    }
                }

                let saved = {}

                if (isEdit && !saveAsNew) saved = await dispatch(editResume(resumeData)).then(data => data.payload)
                else {
                    delete resumeData._id
                    saved = await dispatch(saveResume({ ...resumeData, type: 'Variant' })).then(data => data.payload)
                }

                if (saved) {
                    setLoading(false)
                    if (isEdit && !saveAsNew) {
                        toast.success('Resume updated successfully!')
                        if (managerUpdated) toast.success('Consultant Manager assigned to consultant')
                        return
                    }
                    else {
                        toast.success('Resume saved successfully!')
                        if (managerUpdated) toast.success('Consultant Manager assigned to consultant')
                        return setTimeout(() => history.goBack(), 2000)
                    }
                } else {
                    setLoading(false)
                    return toast.error('Error saving Resume. Please try again later')
                }
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error(err)
            return toast.error('Error saving Resume. Please try again later')
        }
    }

    const removeVoids = arr => {
        return arr.filter(item => item.name || item.value || item.bullet)
    }

    const onChangeSettings = (type, name, value) => {
        const newSettings = data.settings || { fontSize: {}, padding: {} }
        newSettings[type][name] = value
        updateData('settings', newSettings)
    }

    const clearSignature = () => {
        if (sigCanvas.current) sigCanvas.current.clear()
        setSignatureCanvas({})
    }

    const saveSignature = () => {
        const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
        setSignatureCanvas({ ...signatureCanvas, image: signature })
    }

    const setCVPreview = () => {
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
        resumeData.footer_contact = data.footer_contact || ''
        resumeData.footer_email = data.footer_email || ''
        resumeData.footer_phone = data.footer_phone || ''
        resumeData.footer_location = data.footer_location || ''

        const strData = JSON.stringify(resumeData)
        resumeData.data = strData
        resumeData.note = data.note || `${user.username ? `Created by ${user.username}` : ''}`
        resumeData.type = data.type || 'Master'
        resumeData.username = `${data.name}${data.middlename ? ' ' + data.middlename : ''} ${data.surname || ''}`
        resumeData.managerName = data.footer_contact || ''
        resumeData.managerEmail = data.footer_email || ''
        resumeData.email = data.email ? data.email.toLowerCase() : ''
        resumeData.user = user

        setPreviewData(resumeData)
    }

    return (
        <div className='new-resume-container'>
            {previewModal ?
                <div className='pdf-modal' style={{ position: 'fixed' }}>
                    <Resume
                        resumeData={previewData}
                        profilePreview={profilePic}
                        signaturePreview={signatureCanvas}
                        companyLogos={clientLogos}
                        onClose={() => setPreviewModal(false)}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </div> : ''}
            {masterModal ?
                <div className='remove-modal'>
                    <h4 style={{ textAlign: 'center' }}>All the master changes will overwrite the variant CVs, if there's any.<br />Are you sure you want to proceed?</h4>
                    <div className='remove-modal-btns'>
                        <CTAButton
                            label='Cancel'
                            handleClick={() => setMasterModal(false)}
                            color={APP_COLORS.GRAY}
                        />
                        <CTAButton
                            label='Confirm'
                            handleClick={() => {
                                setMasterModal(false)
                                onSaveResume(false)
                            }}
                            color={APP_COLORS.MURREY}
                        />
                    </div>
                </div> : ''}
            <div className='resume-type-banner' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}>
                {Array.from({ length: 100 }).map((_, i) =>
                    <h4 key={i} className='resume-type-text' style={{ color: data.type && data.type === 'Master' ? '#fff3e4' : '#f1f3ff' }}>{data.type ? data.type.toUpperCase() : ''}</h4>
                )}
            </div>
            <CVHeader data={data} cvLogo={cvLogo} style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }} />
            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                border: 'none',
                padding: (padding.personalInfo || padding.personalInfo === 0) && !hiddenSections.personalInfo ? `${.1 * padding.personalInfo}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
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
                            label=''
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
                        fontSize={fontSize.personalInfo}
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
                        fontSize={fontSize.personalInfo}
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
                        fontSize={fontSize.personalInfo}
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
                        fontSize={fontSize.personalInfo}
                    />
                    <Dropdown
                        label='Gender'
                        name='gender'
                        options={genderOptions}
                        value={data.gender}
                        updateData={updateData}
                        size='19vw'
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                        fontSize={fontSize.personalInfo}
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
                        fontSize={fontSize.personalInfo}
                    />
                    <ItemDropdown
                        label='Languages'
                        name='languages'
                        options={['Basic', 'Intermediate', 'Fluent', 'Native']}
                        items={languages}
                        setItems={setLanguages}
                        placeholder='Add new language...'
                        style={{ width: '6.5vw' }}
                        fontSize={fontSize.personalInfo}
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
                        style={{ color: 'rgb(71, 71, 71)', width: '36.5vw', alignSelf: 'flex-start' }}
                        placeholder="Anna is a nice fun and friendly person. 
                        She work well in a team but also on her own as she like to
                        set herself goals which she will achieve. She has good listening and 
                        communication skills plus a creative mind that makes her being always up for new challenges..."
                        value={data.presentation || ''}
                        setHidden={setHiddenItems}
                        hidden={hiddenItems}
                        fontSize={fontSize.personalInfo}
                    />
                    <div className='resume-strengths-div'>
                        <Bullet
                            label='Strengths'
                            type='big'
                            items={strengths}
                            setItems={setStrengths}
                            placeholder='Add new strength...'
                            id='strengths'
                            fontSize={fontSize.personalInfo}
                        />
                    </div>
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
                        fontSize={fontSize.personalInfo}
                    />
                    <div className='signature-container'>
                        {signatureCanvas.image ?
                            <div className='signature-image-container'>
                                <img
                                    src={signatureCanvas.image}
                                    style={{ ...signatureCanvas.style, opacity: hiddenItems.includes('signature') && '.15' }}
                                    className='signature-image'
                                    loading='lazy'
                                />
                                {hiddenItems.includes('signature') ? '' : <button onClick={clearSignature}>Clear</button>}
                            </div>
                            :
                            <div className='resume-signature-canvas-container' style={{ opacity: hiddenItems.includes('signature') && '.2' }}>
                                <h4 className='signature-canvas-label'>Sign by hand</h4>
                                {hiddenItems.includes('signature') ? '' :
                                    <div className='signature-canvas-row'>
                                        <SignaturePad ref={sigCanvas} penColor='#3b3b3b' canvasProps={{ className: 'resume-signature-canvas', dotSize: 1 }} />
                                        <div className='signature-canvas-btns'>
                                            <button onClick={clearSignature}>Clear</button>
                                            <button onClick={saveSignature}>Save</button>
                                            <button style={{ marginTop: '1vw' }} onClick={() => document.getElementById('signature').click()}>Upload Image</button>
                                        </div>
                                    </div>}
                            </div>}
                        <InputField
                            label=''
                            type='file'
                            name='image'
                            filename='image'
                            id='signature'
                            image={signatureCanvas}
                            setImage={setSignatureCanvas}
                            style={{ color: 'rgb(71, 71, 71)' }}
                        />
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
                    <div className='section-settings' style={{ marginTop: '5vw' }}>
                        <>
                            {!paddingDrop ?
                                <img
                                    src={FontIcon}
                                    className='section-settings-icon'
                                    onClick={() => {
                                        setPaddingDrop(false)
                                        setFontDrop(!fontDrop)
                                    }}
                                /> : ''}
                            {fontDrop ?
                                <Slider
                                    label=''
                                    name='personalInfo'
                                    type='fontSize'
                                    sign='x'
                                    value={fontSize.personalInfo || fontSize.personalInfo === 0 ? fontSize.personalInfo : .9}
                                    onChangeSettings={onChangeSettings}
                                    min={0.1}
                                    max={3}
                                    step={0.05}
                                    style={{ width: '10vw', transform: 'scale(.9)' }}
                                />
                                : ''}
                        </>
                        <>
                            {!fontDrop ?
                                <img
                                    src={PaddingIcon}
                                    className='section-settings-icon'
                                    onClick={() => {
                                        setFontDrop(false)
                                        setPaddingDrop(!paddingDrop)
                                    }}
                                /> : ''}
                            {paddingDrop ?
                                <Slider
                                    label=''
                                    name='personalInfo'
                                    type='padding'
                                    sign='x'
                                    value={padding.personalInfo || padding.personalInfo === 0 ? padding.personalInfo : 20}
                                    onChangeSettings={onChangeSettings}
                                    min={0}
                                    max={100}
                                    style={{ width: '10vw', transform: 'scale(.9)' }}
                                />
                                : ''}
                        </>
                    </div>
                </div>
            </div>

            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                padding: (padding.expertise || padding.expertise === 0) && !hiddenSections.expertise ? `${.1 * padding.expertise}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
                <div className='resume-fill-col1'>
                    {hiddenSections.expertise ? '' :
                        <>
                            <h2 className='section-title'>EXPERTISE</h2>
                            <div className='section-settings'>
                                <>
                                    {!paddingDrop ?
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        /> : ''}
                                    {fontDrop ?
                                        <Slider
                                            label=''
                                            name='expertise'
                                            type='fontSize'
                                            sign='x'
                                            value={fontSize.expertise || fontSize.expertise === 0 ? fontSize.expertise : .8}
                                            onChangeSettings={onChangeSettings}
                                            min={0.1}
                                            max={3}
                                            step={0.05}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                                <>
                                    {!fontDrop ?
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        /> : ''}
                                    {paddingDrop ?
                                        <Slider
                                            label=''
                                            name='expertise'
                                            type='padding'
                                            sign='x'
                                            value={padding.expertise || padding.expertise === 0 ? padding.expertise : 20}
                                            onChangeSettings={onChangeSettings}
                                            min={0}
                                            max={100}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                            </div>
                        </>}
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
                            fontSize={fontSize.expertise}
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
            </div>

            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                padding: (padding.education || padding.education === 0) && !hiddenSections.education ? `${.1 * padding.education}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
                <div className='resume-fill-col1'>
                    {hiddenSections.education ? '' :
                        <>
                            <h2 className='section-title'>EDUCATION</h2>
                            <div className='section-settings'>
                                <>
                                    {!paddingDrop ?
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        /> : ''}
                                    {fontDrop ?
                                        <Slider
                                            label=''
                                            name='education'
                                            type='fontSize'
                                            sign='x'
                                            value={fontSize.education || fontSize.education === 0 ? fontSize.education : .8}
                                            onChangeSettings={onChangeSettings}
                                            min={0.1}
                                            max={3}
                                            step={0.05}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                                <>
                                    {!fontDrop ?
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        /> : ''}
                                    {paddingDrop ?
                                        <Slider
                                            label=''
                                            name='education'
                                            type='padding'
                                            sign='x'
                                            value={padding.education || padding.education === 0 ? padding.education : 20}
                                            onChangeSettings={onChangeSettings}
                                            min={0}
                                            max={100}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                            </div>
                        </>}
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
                            fontSize={fontSize.education}
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

            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                padding: (padding.certifications || padding.certifications === 0) && !hiddenSections.certifications ? `${.1 * padding.certifications}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
                <div className='resume-fill-col1'>
                    {hiddenSections.certifications ? '' :
                        <>
                            <h2 className='section-title'>CERTIFICATIONS</h2>
                            <div className='section-settings'>
                                <>
                                    {!paddingDrop ?
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        /> : ''}
                                    {fontDrop ?
                                        <Slider
                                            label=''
                                            name='certifications'
                                            type='fontSize'
                                            sign='x'
                                            value={fontSize.certifications || fontSize.certifications === 0 ? fontSize.certifications : .8}
                                            onChangeSettings={onChangeSettings}
                                            min={0.1}
                                            max={3}
                                            step={0.05}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                                <>
                                    {!fontDrop ?
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        /> : ''}
                                    {paddingDrop ?
                                        <Slider
                                            label=''
                                            name='certifications'
                                            type='padding'
                                            sign='x'
                                            value={padding.certifications || padding.certifications === 0 ? padding.certifications : 20}
                                            onChangeSettings={onChangeSettings}
                                            min={0}
                                            max={100}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                            </div>
                        </>}
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
                            fontSize={fontSize.certifications}
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

            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                padding: (padding.skills || padding.skills === 0) && !hiddenSections.skills ? `${.1 * padding.skills}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
                <div className='resume-fill-col1'>
                    {hiddenSections.skills ? '' :
                        <>
                            <h2 className='section-title'>MAIN SKILLS</h2>
                            <div className='section-settings'>
                                <>
                                    {!paddingDrop ?
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        /> : ''}
                                    {fontDrop ?
                                        <Slider
                                            label=''
                                            name='skills'
                                            type='fontSize'
                                            sign='x'
                                            value={fontSize.skills || fontSize.skills === 0 ? fontSize.skills : .9}
                                            onChangeSettings={onChangeSettings}
                                            min={0.1}
                                            max={3}
                                            step={0.05}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                                <>
                                    {!fontDrop ?
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        /> : ''}
                                    {paddingDrop ?
                                        <Slider
                                            label=''
                                            name='skills'
                                            type='padding'
                                            sign='x'
                                            value={padding.skills || padding.skills === 0 ? padding.skills : 20}
                                            onChangeSettings={onChangeSettings}
                                            min={0}
                                            max={100}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                            </div>
                        </>}
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
                            fontSize={fontSize.skills}
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

            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                padding: (padding.experience || padding.experience === 0) && !hiddenSections.experience ? `${.1 * padding.experience}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
                <div className='resume-fill-col1-dif'>
                    {hiddenSections.experience ? '' :
                        <>
                            <h2 className='section-title'>EXPERIENCE</h2>
                            <div className='section-settings'>
                                <>
                                    {!paddingDrop ?
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        /> : ''}
                                    {fontDrop ?
                                        <Slider
                                            label=''
                                            name='experience'
                                            type='fontSize'
                                            sign='x'
                                            value={fontSize.experience || fontSize.experience === 0 ? fontSize.experience : 1}
                                            onChangeSettings={onChangeSettings}
                                            min={0.1}
                                            max={3}
                                            step={0.05}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                                <>
                                    {!fontDrop ?
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        /> : ''}
                                    {paddingDrop ?
                                        <Slider
                                            label=''
                                            name='experience'
                                            type='padding'
                                            sign='x'
                                            value={padding.experience || padding.experience === 0 ? padding.experience : 20}
                                            onChangeSettings={onChangeSettings}
                                            min={0}
                                            max={100}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                            </div>
                        </>}
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
                            fontSize={fontSize.experience}
                            padding={padding.experience}
                            images={clientLogos}
                            setImages={setClientLogos}
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

            <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
            <div className='new-resume-fill' style={{
                padding: (padding.tools || padding.tools === 0) && !hiddenSections.tools ? `${.1 * padding.tools}vw 0` : '2vw 0',
                filter: masterModal || previewModal ? 'blur(10px)' : 'none'
            }}>
                <div className='resume-fill-col1'>
                    {hiddenSections.tools ? '' :
                        <>
                            <h2 className='section-title'>OTHER TOOLS & SOFTWARE</h2>
                            <div className='section-settings'>
                                <>
                                    {!paddingDrop ?
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        /> : ''}
                                    {fontDrop ?
                                        <Slider
                                            label=''
                                            name='tools'
                                            type='fontSize'
                                            sign='x'
                                            value={fontSize.tools || fontSize.tools === 0 ? fontSize.tools : .9}
                                            onChangeSettings={onChangeSettings}
                                            min={0.1}
                                            max={3}
                                            step={0.05}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                                <>
                                    {!fontDrop ?
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        /> : ''}
                                    {paddingDrop ?
                                        <Slider
                                            label=''
                                            name='tools'
                                            type='padding'
                                            sign='x'
                                            value={padding.tools || padding.tools === 0 ? padding.tools : 10}
                                            onChangeSettings={onChangeSettings}
                                            min={0}
                                            max={100}
                                            style={{ width: '10vw', transform: 'scale(.9)' }}
                                        />
                                        : ''}
                                </>
                            </div>
                        </>}
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
                            fontSize={fontSize.tools}
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

            {
                user.isManager &&
                <>
                    <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
                    <div className='resume-fill-internal' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}>
                        <div className='resume-fill-col1'>
                            <h2 className='section-title'>FOOTER</h2>
                        </div>
                        <CVFooter
                            updateData={updateData}
                            user={user}
                            data={data}
                            managers={managers}
                            manager={data.manager}
                        />
                    </div>
                    <div className='separator' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}></div>
                    <div className='resume-fill-internal' style={{ filter: masterModal || previewModal ? 'blur(10px)' : 'none' }}>
                        <div className='resume-fill-col1'>
                            <h2 className='section-title'>METADATA</h2>
                            <h2 className='section-title'>(internal use)</h2>
                        </div>
                        <div className='resume-fill-col2'>
                            <Dropdown
                                label='CV Type'
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
            {!previewModal && !masterModal ?
                <div className='new-resume-btns'>
                    <CTAButton
                        label='Discard'
                        color={APP_COLORS.GRAY}
                        handleClick={() => history.push('/cvs')}
                    />
                    <CTAButton
                        label='Preview'
                        color={APP_COLORS.YELLOW}
                        style={{ color: 'black' }}
                        handleClick={() => {
                            if (checkCVData()) {
                                setCVPreview()
                                setTimeout(() => setPreviewModal(true), 200)
                            }
                        }}
                        loading={loading}
                    />
                    <CTAButton
                        label={isEdit ? 'Update' : 'Save'}
                        color={APP_COLORS.GREEN}
                        handleClick={() => {
                            if (isEdit && data.type && data.type === 'Master') setMasterModal(true)
                            else if (isEdit) onSaveResume(false)
                            else onSaveResume(true)
                        }}
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
                </div> : ''}
        </div >
    )
}
