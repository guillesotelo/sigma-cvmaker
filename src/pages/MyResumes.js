import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import { logIn } from '../store/reducers/user'
import MoonLoader from "react-spinners/MoonLoader"
import ActionCard from '../components/ActionCard'
import DownloadIcon from '../icons/download-icon.svg'
import EditIcon from '../icons/edit-icon.svg'
import TrashCan from '../icons/trash-icon.svg'
import Resume from '../components/Resume'
import { getResumes, removeResume } from '../store/reducers/resume'
import SearchBar from '../components/SearchBar'

export default function MyResumes({ showAll }) {
    const [resumes, setResumes] = useState([])
    const [filteredRes, setFilteredRes] = useState([])
    const [resumeData, setResumeData] = useState({})
    const [search, setSearch] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isPdf, setIsPdf] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if (!user || !user.email) history.push('/login')
        const getAll = showAll || false
        getAllResumes(getAll)
    }, [])

    useEffect(() => {
        if (!search.length) {
            getAllResumes(showAll)
            setFilteredRes([])
        }
    }, [search.length])

    const getAllResumes = async getAll => {
        if (user && user.email) {
            try {
                setLoading(true)
                const cvs = await dispatch(getResumes({ ...user, getAll })).then(data => data.payload)
                if (cvs && cvs.length) {
                    setResumes(cvs)
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
            const removed = dispatch(removeResume(resumeData)).then(data => data.payload)

            if (removed) {
                setLoading(false)
                setOpenModal(false)
                setIsPdf(false)
                setTimeout(() => getAllResumes(showAll), 500)
                return toast.success('Resume deleted successfully')
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
                let matches = true
                search.forEach(word => {
                    if (!JSON.stringify(res).toLowerCase().includes(word.toLowerCase())) matches = false
                })
                if (matches) return res
            })
            setFilteredRes(filtered)
        }
        setLoading(false)
    }

    return (
        <div className='my-resumes-container'>
            <h4 className='go-back-btn' onClick={() => history.goBack()}>Go back</h4>
            <h2 className='page-title' style={{ filter: openModal && 'blur(10px)' }}>{showAll ? 'ALL CVs' : 'MY CVs'}</h2>
            <SearchBar
                handleChange={e => handleSearch(e)}
                placeholder='Search by keywords or text...'
                style={{ filter: openModal && 'blur(10px)' }}
                onKeyPress={handleSearch}
                triggerSearch={triggerSearch}
            />
            <div className='resumes-list' style={{ filter: openModal && 'blur(10px)' }}>
                {filteredRes.length ?
                    filteredRes.map((resume, i) =>
                        <div className='resume-card' key={i}>
                            <div className='resume-text' onClick={() => {
                                setOpenModal(true)
                                setIsPdf(true)
                                setResumeData(resume)
                            }}>
                                <h4 className='resume-name'>{resume.username || resume.user || ''}</h4>
                                <h4 className='resume-role'>{resume.role || ''}</h4>
                                <h4 className='resume-role'>{resume.email || ''}</h4>
                            </div>
                            <div className='resume-icons'>
                                {/* <img src={DownloadIcon} className='resume-icon' /> */}
                                <img src={EditIcon} className='resume-icon' onClick={() => history.push(`/createResume?edit=${resume._id}`)} />
                                <img src={TrashCan} onClick={() => {
                                    setResumeData(resume)
                                    setOpenModal(true)
                                }} className='resume-icon' />
                            </div>
                        </div>
                    )
                    :
                    resumes.length ?
                        resumes.map((resume, i) =>
                            <div className='resume-card' key={i}>
                                <div className='resume-text' onClick={() => {
                                    setOpenModal(true)
                                    setIsPdf(true)
                                    setResumeData(resume)
                                }}>
                                    <h4 className='resume-name'>{resume.username || resume.user || ''}</h4>
                                    <h4 className='resume-role'>{resume.role || ''}</h4>
                                    <h4 className='resume-role'>{resume.email || ''}</h4>
                                </div>
                                <div className='resume-icons'>
                                    {/* <img src={DownloadIcon} className='resume-icon' /> */}
                                    <img src={EditIcon} className='resume-icon' onClick={() => history.push(`/createResume?edit=${resume._id}`)} />
                                    <img src={TrashCan} onClick={() => {
                                        setResumeData(resume)
                                        setOpenModal(true)
                                    }} className='resume-icon' />
                                </div>
                            </div>
                        )
                        : loading ? <div style={{ alignSelf: 'center', display: 'flex' }}><MoonLoader color='#6D0E00' /></div>
                            : <h4 style={{ textAlign: 'center', marginTop: '6vw', color: 'gray' }}> ~ No resumes found ~ </h4>
                }
            </div>
            {openModal && isPdf ?
                <div className='pdf-modal'>
                    <div className='modal-btns'>
                        <h4 className='close-modal' onClick={() => history.push(`/createResume?edit=${resumeData._id}`)}>Edit</h4>
                        <h4 className='close-modal' onClick={() => {
                            setOpenModal(false)
                            setIsPdf(false)
                            setResumeData({})
                        }}>Close</h4>
                    </div>
                    <Resume
                        resumeData={resumeData}
                    />
                </div> : ''}
            {openModal && !isPdf ?
                <div className='remove-modal'>
                    <h4 style={{ textAlign: 'center' }}>Are you sure you want to delete <br />{resumeData.username}'s CV?</h4>
                    <div className='remove-modal-btns'>
                        <CTAButton
                            label='Cancel'
                            handleClick={() => {
                                setOpenModal(false)
                                setIsPdf(false)
                            }}
                            style={{ color: 'black' }}
                        />
                        <CTAButton
                            label='Confirm'
                            handleClick={handleDeleteResume}
                            color={APP_COLORS.MURREY}
                        />
                    </div>
                </div> : ''}
        </div>
    )
}
