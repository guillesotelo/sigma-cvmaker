import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import Resume from '../components/Resume'
import { getResumes, makeCVPublic, removeResume } from '../store/reducers/resume'
import { saveLog } from '../store/reducers/log'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'
import { cvHeaders } from '../constants/tableHeaders'
import CopyIcon from '../icons/copy-icon.svg'
import Dropdown from '../components/Dropdown'
import Tooltip from '../components/Tooltip'

export default function CVs({ showAll }) {
    const [resumes, setResumes] = useState([])
    const [filteredRes, setFilteredRes] = useState([])
    const [resumeData, setResumeData] = useState({})
    const [selectedCV, setSelectedCV] = useState(-1)
    const [search, setSearch] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isPdf, setIsPdf] = useState(false)
    const [download, setDownload] = useState(false)
    const [publishCV, setPublishCV] = useState({})
    const [publicTime, setPublicTime] = useState(0)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
    const { isManager } = user
    const dispatch = useDispatch()
    const history = useHistory()
    const REACT_APP_CV_URL = process.env.REACT_APP_CV_URL || 'https://sigma-cvmaker.vercel.app'

    useEffect(() => {
        const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!localUser || !localUser.email) history.push('/')

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') onCloseModal()
        })

        getAllResumes(showAll)
    }, [])

    useEffect(() => {
        if (!search.length) {
            setFilteredRes(resumes)
        }
    }, [search.length])

    const getAllResumes = async getAll => {
        if (user && user.email) {
            try {
                setLoading(true)
                const cvs = await dispatch(getResumes({ ...user, getAll: getAll && isManager ? true : false })).then(data => data.payload)
                if (cvs && Array.isArray(cvs)) {
                    const nonRemoved = cvs.filter(cv => !cv.removed)
                    setResumes(nonRemoved)
                    setFilteredRes(nonRemoved)
                }
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.error(err)
            }
        }
    }

    const handleDeleteResume = () => {
        try {
            setLoading(true)
            const removed = dispatch(removeResume({ ...resumeData, user })).then(data => data.payload)

            if (removed) {
                setLoading(false)
                setOpenModal(false)
                setIsPdf(false)
                setTimeout(() => getAllResumes(showAll), 500)
                return toast.success('Resume moved to trash')
            } else {
                setLoading(false)
                setOpenModal(false)
                setIsPdf(false)
                return toast.error('Error deleting Resume')
            }
        } catch (err) {
            setLoading(false)
            setOpenModal(false)
            setIsPdf(false)
            return toast.error('Error deleting Resume')
        }
    }

    const handlePublishCV = async () => {
        try {
            setLoading(true)
            const published = await dispatch(makeCVPublic({
                ...publishCV,
                publicTime: publicTime === 'Unpublish' ? 0 : publicTime,
                user
            })).then(data => data.payload)

            if (published) {
                if (publicTime === 'Unpublish') toast.success(`The CV has been unpublished`)
                else {
                    navigator.clipboard.writeText(`${REACT_APP_CV_URL}/view?id=${publishCV._id}`)
                    toast.success(`The CV has been published for ${publicTime} days`)
                    toast.success('Link copied to clipboard!')
                }
            } else toast.error('Error publishing CV. Try again later')

            setPublishCV({})
            setPublicTime(0)
            getAllResumes(showAll)
            return setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const handleSearch = e => {
        if (e.key === 'Enter') {
            triggerSearch()
        } else {
            const words = e.target.value ? e.target.value.split(' ') : []
            setSearch(words)
        }
    }

    const triggerSearch = () => {
        setLoading(true)
        if (search.length) {
            const filtered = resumes.filter(res => {
                const stringCV = JSON.stringify(res)
                let matches = true
                search.forEach(word => {
                    if (!stringCV.toLowerCase().includes(word.toLowerCase())) matches = false
                })
                if (matches) return res
            })
            setFilteredRes(filtered)
        }
        setLoading(false)
    }

    const onEditPdf = () => history.push(`/new-cv?edit=${resumeData._id}`)

    const onCloseModal = () => {
        setOpenModal(false)
        setIsPdf(false)
        setResumeData({})
    }

    const onDownloadPDF = async () => {
        try {
            await dispatch(saveLog({
                email: user.email,
                username: user.username,
                details: `CV exported: ${resumeData.username} - ${resumeData.type}`,
                module: 'CV',
                itemId: resumeData._id || null
            })).then(data => data.payload)
        } catch (err) {
            console.error(err)
        }
    }

    const calculateExpiration = cv => {
        let expired = true
        if (cv.published && cv.publicTime) {
            const now = new Date().getTime()
            const published = new Date(cv.published).getTime()
            const publicDays = cv.publicTime
            if (now - published < publicDays * 8.64E7) expired = false
        }
        return expired
    }

    const checkExpirationDays = cv => {
        let days = 0
        if (cv.published && cv.publicTime) {
            const now = new Date().getTime()
            const published = new Date(cv.published).getTime()
            const publicDays = cv.publicTime
            days = publicDays - ((now - published) / 8.64E7)
        }
        return days.toFixed(0)
    }

    return (
        <div className='my-resumes-container'>
            <SearchBar
                handleChange={e => handleSearch(e)}
                placeholder='Search by words or text...'
                style={{ filter: (openModal || publishCV.username) && 'blur(10px)', width: '20vw' }}
                onKeyPress={handleSearch}
                triggerSearch={triggerSearch}
                setData={setResumeData}
            />
            <div className='resumes-list' style={{ filter: (openModal || publishCV.username) && 'blur(10px)' }}>
                <DataTable
                    title={`CV's`}
                    subtitle={`Here is a list of all CV's in the system`}
                    maxRows={9}
                    tableData={filteredRes}
                    setTableData={setFilteredRes}
                    tableHeaders={cvHeaders.concat({ name: 'ACTIONS', value: 'icons' })}
                    loading={loading}
                    setLoading={setLoading}
                    item={selectedCV}
                    setItem={setSelectedCV}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    setResumeData={setResumeData}
                    setOpenModal={setOpenModal}
                    setPublishCV={setPublishCV}
                    setIsPdf={setIsPdf}
                    setDownload={setDownload}
                    modalView={true}
                />
            </div>
            {openModal && isPdf ?
                <div className='pdf-modal'>
                    <Resume
                        resumeData={resumeData}
                        onClose={onCloseModal}
                        onEdit={onEditPdf}
                        onDownloadPDF={onDownloadPDF}
                        download={download}
                        setDownload={setDownload}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </div> : ''}
            {openModal && !isPdf ?
                <div className='remove-modal'>
                    {resumeData.type && resumeData.type === 'Master' ?
                        <h4 style={{ textAlign: 'center' }}>Are you sure you want to delete {resumeData.username}'s Master CV? <br /> If you proceed, all its variants will be deleted.</h4>
                        : <h4 style={{ textAlign: 'center' }}>Are you sure you want to delete <br />{resumeData.username}'s CV?</h4>}
                    <div className='remove-modal-btns'>
                        <CTAButton
                            label='Cancel'
                            handleClick={() => {
                                setOpenModal(false)
                                setIsPdf(false)
                            }}
                            color={APP_COLORS.GRAY}
                        />
                        <CTAButton
                            label='Confirm'
                            handleClick={handleDeleteResume}
                            color={APP_COLORS.MURREY}
                        />
                    </div>
                </div> : ''}
            {publishCV.username ?
                <div className='remove-modal'>
                    {publishCV.published ?
                        <div className='public-cv-modal'>
                            {calculateExpiration(publishCV) ?
                                <>
                                    <h4 style={{ color: 'red' }} className='public-cv-text'>{publishCV.username}'s CV link has expired</h4>
                                    <h4 className='public-cv-text'>If you want, you can update its public expiration starting today:</h4>
                                </>
                                :
                                <>
                                    <h4 style={{ color: 'green' }} className='public-cv-text'>{publishCV.username}'s CV has already been published</h4>
                                    <h4 className='public-cv-text'>Time remaining: <b>{checkExpirationDays(publishCV)} days</b></h4>
                                </>
                            }
                            <Dropdown
                                label='Public time (days)'
                                name='publicTime'
                                options={['Unpublish', 1, 5, 10, 15, 20, 30, 45, 60, 90, 365]}
                                value={calculateExpiration(publishCV) ? (publicTime || publishCV.publicTime) : ''}
                                updateData={(_, option) => setPublicTime(option)}
                                size='8vw'
                                style={{ alignSelf: 'center' }}
                            />
                            <div className='public-cv-link-row'>
                                <a className='public-cv-link' href={`${REACT_APP_CV_URL}/view?id=${publishCV._id}`} target='_blank'>{`${REACT_APP_CV_URL}/view?id=${publishCV._id}`}</a>
                                <Tooltip tooltip='Copy link'>
                                    <img src={CopyIcon} onClick={() => {
                                        navigator.clipboard.writeText(`${REACT_APP_CV_URL}/view?id=${publishCV._id}`)
                                        toast.success('Link copied to clipboard!')
                                    }} className='public-cv-copy' />
                                </Tooltip>

                            </div>
                        </div>
                        : <h4 style={{ textAlign: 'center', fontWeight: 'normal' }}>Publish <br />{publishCV.username}'s CV?</h4>}
                    <div className='remove-modal-btns'>
                        <CTAButton
                            label='Cancel'
                            handleClick={() => setPublishCV({})}
                            color={APP_COLORS.GRAY}
                        />
                        <CTAButton
                            label={publishCV.published ? 'Update' : `Confirm`}
                            handleClick={handlePublishCV}
                            color={APP_COLORS.MURREY}
                        />
                    </div>
                </div>
                : ''}
        </div>
    )
}
