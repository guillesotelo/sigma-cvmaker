import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { MoonLoader } from 'react-spinners'
import { getOneAppData, updateAppData } from '../store/reducers/appData'
import Tooltip from '../components/Tooltip'
import PdfIcon from '../icons/pdf-icon.svg'

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
    const [signatureCanvas, setSignatureCanvas] = useState({ style: {} })
    const [masterModal, setMasterModal] = useState(false)
    const [previewModal, setPreviewModal] = useState(false)
    const [importPDF, setImportPDF] = useState(false)
    const [importedPDF, setImportedPDF] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || {}
    const typeOptions = ['Master', 'Variant', 'Other']
    const genderOptions = ['Female', 'Male', 'Other', 'Prefer not to say']
    const fullName = `${data.name || ''}${data.middlename ? ` ${data.middlename} ` : ' '}${data.surname || ''}`
    const skillYears = Array.from({ length: 40 }, (_, i) => `${i + 1} ${i > 0 ? 'Years' : 'Year'}`)
    const sigCanvas = useRef({})

    // console.log("data", data)
    // console.log("importedPDF", importedPDF)
    // console.log("importedPDF Size", (new TextEncoder().encode(importedPDF.pdf || ' ')).length + ' Bytes')

    useEffect(() => {
        if (!user || !user.email) history.push('/')
        getAllResumes(true)
        getCVLogo()
        getManagers()

    }, [])

    useLayoutEffect(() => {
        trackScrolling()
    })

    useEffect(() => {
        if (allResumes.length) {
            const edit = new URLSearchParams(document.location.search).get('edit')
            if (edit) setEditData(edit)
            else setData({...data, type: 'Master'})
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
                r: rotate,
                brightness,
                contrast,
                grayscale,
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

    const trackScrolling = () => {
        document.addEventListener('scroll', () => {
            const container = document.querySelector('.new-resume-container')
            const actionButtons = document.querySelector('.new-resume-btns')
            if (container?.getBoundingClientRect().bottom <= window.innerHeight) {
                actionButtons.style.transform = 'translateY(0)'
            }
        })
    }

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
            setLoading(true)
            const cv = await getCVById(edit, false)
            if (allResumes && allResumes.length) {
                allResumes.forEach(resume => {
                    if (resume._id === edit) {
                        const resData = JSON.parse(cv && cv.data || {})

                        setIsEdit(true)
                        setData({ ...resData, ...resume })
                        setFontSize(resData.settings && resData.settings.fontSize ? resData.settings.fontSize : {})
                        setPadding(resData.settings && resData.settings.padding ? resData.settings.padding : {})
                        setLanguages(resData.languages)
                        setSkills(resData.skills.length ? refreshTime(resData.skills, resume.updatedAt) : [{ name: '' }])
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
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const getCVById = async (id, isPdf) => {
        try {
            const cv = await dispatch(getResume(id)).then(data => data.payload)
            return cv
        } catch (err) { console.error(err) }
    }

    const getCVLogo = async () => {
        try {
            setLoading(true)
            const logo = await dispatch(getLogo({ type: 'CV Logo' })).then(data => data.payload)
            if (logo) setcvLogo(logo.data)
            else setcvLogo({})
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
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

    const checkCVData = (info) => {
        let check = true
        if (!data.name || !data.surname) {
            check = false
            if (info) toast.error('Please add a Name and Surname')
        }
        if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
            check = false
            if (info) toast.error('Please add a valid Email')
        }
        if (!data.role) {
            check = false
            if (info) toast.error('Please add a Role / Title')
        }
        if (!data.type) {
            check = false
            if (info) toast.error('Please select CV Type')
        }
        if (!data.footer_contact || !data.footer_email) {
            check = false
            if (info) toast.error('Please add Manager Contact Info')
        }
        return check
    }

    const onSaveResume = async saveAsNew => {
        try {
            setLoading(true)
            if (checkCVData(true)) {
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
                delete resumeData.data


                const strData = JSON.stringify(resumeData)
                if (strData !== resumeData.data) resumeData.data = strData
                else delete resumeData.data

                resumeData.pdfData = importedPDF
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

                await saveNewAppData(resumeData)

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
                    saved = await dispatch(saveResume(resumeData)).then(data => data.payload)
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
                        return setTimeout(() => history.push('/cvs'), 2000)
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

    const saveNewAppData = async cvData => {
        try {
            //Save new Skills to DB
            if (cvData.skills && cvData.skills.length) {
                const DBSkills = await dispatch(getOneAppData({ type: 'skills' })).then(data => data.payload)
                const parsedDBSkills = DBSkills?.data ? JSON.parse(DBSkills.data) : []
                const existingNames = parsedDBSkills.map(skill => skill.name)
                let parsedSkills = []
                cvData.skills.forEach(skill => {
                    if (skill && skill.name && !existingNames.includes(skill.name)) {
                        parsedSkills.push({
                            name: skill.name,
                            field: 'CV Skill'
                        })
                    }
                })
                await dispatch(updateAppData({
                    user: { ...user },
                    type: 'skills',
                    data: JSON.stringify(parsedDBSkills.concat(parsedSkills))
                })).then(data => data.payload)
            }

            //Save new Clients to DB
            if (cvData.experience && cvData.experience.length) {
                const DBClients = await dispatch(getOneAppData({ type: 'clients' })).then(data => data.payload)
                const parsedDBClients = DBClients?.data ? JSON.parse(DBClients.data) : []
                const existingCompanies = parsedDBClients.map(client => client.name)
                let parsedClients = []
                cvData.experience.forEach(exp => {
                    if (exp && exp.company && !existingCompanies.includes(exp.company)) {
                        parsedClients.push({
                            name: exp.company,
                            email: cvData.email || '',
                            type: 'CV Client',
                            location: cvData.location || '',
                            contact: cvData.username || ''
                        })
                    }
                })
                await dispatch(updateAppData({
                    user: { ...user },
                    type: 'clients',
                    data: JSON.stringify(parsedDBClients.concat(parsedClients))
                })).then(data => data.payload)
            }
        } catch (err) {
            console.error(err)
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

        resumeData.date = new Date()
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
        loading && !previewModal ? <div style={{ alignSelf: 'center', display: 'flex', marginTop: '20vw' }}><MoonLoader color='#E59A2F' /></div>
            :
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
                {importPDF ?
                    <div className='import-modal' style={{ marginTop: importedPDF.pdf && '-2vw' }}>
                        <InputField
                            label=''
                            type='pdf'
                            name='pdf'
                            filename='pdf'
                            pdf={importedPDF}
                            setPDF={setImportedPDF}
                            style={{ color: 'rgb(71, 71, 71)' }}
                        />
                        <h4 className='import-pdf-title'>Import PDF CV</h4>
                        {importedPDF.filename ? <h4 className='import-pdf-name'>{importedPDF.filename}</h4> : ''}
                        {importedPDF.pdf ?
                            <div className='import-pdf-fill'>
                                <h4 className='import-pdf-fill-text'>Plase fill in the Consultant's data:</h4>
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
                                <InputField
                                    label='Email'
                                    type='text'
                                    name='email'
                                    updateData={updateData}
                                    placeholder='consultant.name@sigma.se'
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.email || ''}
                                />
                                <Dropdown
                                    label='Consultant Manager'
                                    name='manager'
                                    options={managers}
                                    value={data.manager}
                                    updateData={updateData}
                                    size='27vw'
                                />
                            </div>
                            :
                            <img
                                src={PdfIcon}
                                className='pdf-placeholder-svg'
                                onClick={() => document.getElementById('pdf').click()}
                                onDragOver={e => {
                                    e.preventDefault()
                                    document.querySelector('.pdf-placeholder-svg').classList.add('dragging')
                                }}
                                onDragEnter={e => {
                                    e.preventDefault()
                                    document.querySelector('.pdf-placeholder-svg').classList.add('dragging-over')
                                }}
                                onDragLeave={e => {
                                    e.preventDefault()
                                    document.querySelector('.pdf-placeholder-svg').classList.remove('dragging')
                                    document.querySelector('.pdf-placeholder-svg').classList.remove('dragging-over')
                                }}
                                onDrop={e => {
                                    e.preventDefault()
                                    if (e.dataTransfer.files[0]) {
                                        const dataTransfer = new DataTransfer()
                                        const inputFile = document.getElementById('pdf')
                                        dataTransfer.items.add(e.dataTransfer.files[0]);
                                        inputFile.files = dataTransfer.files

                                        const evt = new Event('change', { bubbles: true })
                                        inputFile.dispatchEvent(evt)
                                        updateData('type', 'PDF')
                                    }
                                }}
                            />
                        }
                        <div className='import-modal-btns'>
                            <CTAButton
                                label='Cancel'
                                handleClick={() => {
                                    setImportedPDF({})
                                    setImportPDF(false)
                                }}
                                color={APP_COLORS.GRAY}
                            />
                            <CTAButton
                                label='Upload'
                                handleClick={() => onSaveResume(false)}
                                color={APP_COLORS.GREEN}
                                disabled={!checkCVData(false)}
                            />
                        </div>
                    </div> : ''}
                <div className='resume-type-banner' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}>
                    {Array.from({ length: 100 }).map((_, i) =>
                        <h4 key={i} className='resume-type-text' style={{ color: data.type && data.type === 'Master' ? '#fff3e4' : '#f1f3ff' }}>{data.type ? data.type.toUpperCase() : ''}</h4>
                    )}
                </div>
                <CVHeader data={data} cvLogo={cvLogo} style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }} />
                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    border: 'none',
                    padding: (padding.personalInfo || padding.personalInfo === 0) && !hiddenSections.personalInfo ? `${.1 * padding.personalInfo}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1'>
                        <>
                            {profilePic.image ?
                                <div className='profile-image-section'>
                                    <Tooltip tooltip='Change image'>
                                        <div className='profile-image-cover'>
                                            <img
                                                src={profilePic.image}
                                                style={{ ...profilePic.style, opacity: hiddenItems.includes('profile') && '.15' }}
                                                className='profile-image'
                                                onClick={() => document.getElementById('image').click()}
                                                loading='lazy'
                                            />
                                        </div>
                                    </Tooltip>
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
                                            {hiddenItems.includes('profile') ?
                                                <Tooltip tooltip='Show'>
                                                    <img
                                                        src={ShwoIcon}
                                                        className='hide-icon-profile'
                                                        onClick={() => setHiddenItems(hiddenItems.filter(item => item !== 'profile'))}
                                                    />
                                                </Tooltip>
                                                :
                                                <Tooltip tooltip='Hide'>
                                                    <img
                                                        src={HideIcon}
                                                        className='hide-icon-profile'
                                                        onClick={() => {
                                                            const _hidden = [...hiddenItems]
                                                            _hidden.push('profile')
                                                            setHiddenItems(_hidden)
                                                        }}
                                                    />
                                                </Tooltip>
                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <Tooltip tooltip='Upload image'>
                                    <img
                                        src={ProfileIcon}
                                        className='profile-image-svg'
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
                                            <SignaturePad ref={sigCanvas} penColor='#3b3b3b' canvasProps={{ className: 'resume-signature-canvas' }} />
                                            <div className='signature-canvas-btns'>
                                                <button onClick={clearSignature}>Clear</button>
                                                <button onClick={saveSignature}>Save</button>
                                                <button style={{ marginTop: '1vw' }} onClick={() => document.getElementById('signature').click()}>Upload Image</button>
                                            </div>
                                        </div>}
                                </div>}
                            <InputField
                                label=''
                                type='image'
                                name='image'
                                filename='image'
                                id='signature'
                                image={signatureCanvas}
                                setImage={setSignatureCanvas}
                                style={{ color: 'rgb(71, 71, 71)' }}
                            />
                            {hiddenItems.includes('signature') ?
                                <Tooltip tooltip='Show'>
                                    <img
                                        src={ShwoIcon}
                                        className='hide-icon-signature'
                                        onClick={() => setHiddenItems(hiddenItems.filter(item => item !== 'signature'))}
                                    />
                                </Tooltip>
                                :
                                <Tooltip tooltip='Hide'>
                                    <img
                                        src={HideIcon}
                                        className='hide-icon-signature'
                                        onClick={() => {
                                            const _hidden = [...hiddenItems]
                                            _hidden.push('signature')
                                            setHiddenItems(_hidden)
                                        }}
                                    />
                                </Tooltip>
                            }
                        </div>
                        <div className='section-settings' style={{ marginTop: '2vw' }}>
                            <>
                                {!paddingDrop ?
                                    <Tooltip tooltip='Change font'>
                                        <img
                                            src={FontIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setPaddingDrop(false)
                                                setFontDrop(!fontDrop)
                                            }}
                                        />
                                    </Tooltip>
                                    : ''}
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
                                    <Tooltip tooltip='Change margin'>
                                        <img
                                            src={PaddingIcon}
                                            className='section-settings-icon'
                                            onClick={() => {
                                                setFontDrop(false)
                                                setPaddingDrop(!paddingDrop)
                                            }}
                                        />
                                    </Tooltip>
                                    : ''}
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

                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    padding: (padding.expertise || padding.expertise === 0) && !hiddenSections.expertise ? `${.1 * padding.expertise}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1'>
                        {hiddenSections.expertise ? '' :
                            <>
                                <h2 className='section-title'>EXPERTISE</h2>
                                <div className='section-settings'>
                                    <>
                                        {!paddingDrop ?
                                            <Tooltip tooltip='Change font'>
                                                <img
                                                    src={FontIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setPaddingDrop(false)
                                                        setFontDrop(!fontDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                                            <Tooltip tooltip='Change margin'>
                                                <img
                                                    src={PaddingIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setFontDrop(false)
                                                        setPaddingDrop(!paddingDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                            />
                        }
                    </div>
                </div>

                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    padding: (padding.education || padding.education === 0) && !hiddenSections.education ? `${.1 * padding.education}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1'>
                        {hiddenSections.education ? '' :
                            <>
                                <h2 className='section-title'>EDUCATION</h2>
                                <div className='section-settings'>
                                    <>
                                        {!paddingDrop ?
                                            <Tooltip tooltip='Change font'>
                                                <img
                                                    src={FontIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setPaddingDrop(false)
                                                        setFontDrop(!fontDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                                            <Tooltip tooltip='Change margin'>
                                                <img
                                                    src={PaddingIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setFontDrop(false)
                                                        setPaddingDrop(!paddingDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                            />
                        }
                    </div>
                </div>

                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    padding: (padding.certifications || padding.certifications === 0) && !hiddenSections.certifications ? `${.1 * padding.certifications}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1'>
                        {hiddenSections.certifications ? '' :
                            <>
                                <h2 className='section-title'>CERTIFICATIONS</h2>
                                <div className='section-settings'>
                                    <>
                                        {!paddingDrop ?
                                            <Tooltip tooltip='Change font'>
                                                <img
                                                    src={FontIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setPaddingDrop(false)
                                                        setFontDrop(!fontDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                                            <Tooltip tooltip='Change margin'>
                                                <img
                                                    src={PaddingIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setFontDrop(false)
                                                        setPaddingDrop(!paddingDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                            />
                        }
                    </div>
                </div>

                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    padding: (padding.skills || padding.skills === 0) && !hiddenSections.skills ? `${.1 * padding.skills}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1'>
                        {hiddenSections.skills ? '' :
                            <>
                                <h2 className='section-title'>MAIN SKILLS</h2>
                                <div className='section-settings'>
                                    <>
                                        {!paddingDrop ?
                                            <Tooltip tooltip='Change font'>
                                                <img
                                                    src={FontIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setPaddingDrop(false)
                                                        setFontDrop(!fontDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                                            <Tooltip tooltip='Change margin'>
                                                <img
                                                    src={PaddingIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setFontDrop(false)
                                                        setPaddingDrop(!paddingDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                            />
                        }
                    </div>
                </div>

                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    padding: (padding.experience || padding.experience === 0) && !hiddenSections.experience ? `${.1 * padding.experience}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1-dif'>
                        {hiddenSections.experience ? '' :
                            <>
                                <h2 className='section-title'>EXPERIENCE</h2>
                                <div className='section-settings'>
                                    <>
                                        {!paddingDrop ?
                                            <Tooltip tooltip='Change font'>
                                                <img
                                                    src={FontIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setPaddingDrop(false)
                                                        setFontDrop(!fontDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                                            <Tooltip tooltip='Change margin'>
                                                <img
                                                    src={PaddingIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setFontDrop(false)
                                                        setPaddingDrop(!paddingDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                            />
                        }
                    </div>
                </div>

                <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                <div className='new-resume-fill' style={{
                    padding: (padding.tools || padding.tools === 0) && !hiddenSections.tools ? `${.1 * padding.tools}vw 0` : '2vw 0',
                    filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none'
                }}>
                    <div className='resume-fill-col1'>
                        {hiddenSections.tools ? '' :
                            <>
                                <h2 className='section-title'>OTHER TOOLS & SOFTWARE</h2>
                                <div className='section-settings'>
                                    <>
                                        {!paddingDrop ?
                                            <Tooltip tooltip='Change font'>
                                                <img
                                                    src={FontIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setPaddingDrop(false)
                                                        setFontDrop(!fontDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                                            <Tooltip tooltip='Change margin'>
                                                <img
                                                    src={PaddingIcon}
                                                    className='section-settings-icon'
                                                    onClick={() => {
                                                        setFontDrop(false)
                                                        setPaddingDrop(!paddingDrop)
                                                    }}
                                                />
                                            </Tooltip>
                                            : ''}
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
                            />
                        }
                    </div>
                </div>
                        <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                        <div className='resume-fill-internal' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}>
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
                                
                        {
                            user.isManager &&
                                <>
                        <div className='separator' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}></div>
                        <div className='resume-fill-internal' style={{ filter: masterModal || importPDF || previewModal ? 'blur(10px)' : 'none' }}>
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
                            label='Cancel'
                            color={APP_COLORS.GRAY}
                            handleClick={() => history.push('/cvs')}
                        />
                        <CTAButton
                            label='Preview'
                            color={APP_COLORS.YELLOW}
                            style={{ color: 'black' }}
                            handleClick={() => {
                                if (checkCVData(true)) {
                                    setCVPreview()
                                    setTimeout(() => setPreviewModal(true), 200)
                                }
                            }}
                            loading={loading}
                        />
                        {!isEdit ?
                            <CTAButton
                                label='Import PDF'
                                color={APP_COLORS.YELLOW}
                                style={{ color: 'black' }}
                                handleClick={() => setImportPDF(true)}
                                loading={loading}
                            />
                            : ''}
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
