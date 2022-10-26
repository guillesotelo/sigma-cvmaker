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
import { deleteResume, getAllResumes } from '../store/services/reduxServices'
import DownloadIcon from '../icons/download-icon.svg'
import EditIcon from '../icons/edit-icon.svg'
import TrashCan from '../icons/trash-icon.svg'
import Resume from '../components/Resume'

export default function MyResumes() {
    const [resumes, setResumes] = useState([])
    const [resumeData, setResumeData] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isPdf, setIsPdf] = useState(false)
    const user = localStorage.getItem('user')
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!user || !user.email) history.push('/login')
        // getResumes()
        let resArr = []
        for (let i = 0; i < 10; i++) {
            resArr.push({
                id: i,
                full_name: 'Guillermo Sotelo',
                role: 'Software Engineer',
                description: 'Guillermo is a Full Stack Developer with an inclination towards electronics and Industrial Design. He is currently developing web and mobile applications all the way from back to frontend for diverse projects around the globe.'
            })
        }

        setResumes(resArr)
    }, [])

    const getResumes = async () => {
        if (user && user.manager) {
            const cvs = await dispatch(getAllResumes(user)).then(data => data.payload)
            if (cvs && cvs.length) setResumes(cvs)
        }
    }

    const removeResume = () => {
        try {
            setLoading(true)
            const removed = dispatch(deleteResume(resumeData)).then(data => data.payload)

            if (removed) {
                setLoading(false)
                setOpenModal(false)
                setIsPdf(false)
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

    return (
        <div className='my-resumes-container'>
            <CTAButton
                label='Go back'
                handleClick={() => history.goBack()}
                style={{ alignSelf: 'flex-start' }}
                color={APP_COLORS.GRAY}
            />
            <h2 className='page-title' style={{ filter: openModal && 'blur(10px)' }}>MY RESUMES</h2>
            <div className='resumes-list' style={{ filter: openModal && 'blur(10px)' }}>
                {resumes && resumes.length ?
                    resumes.map(resume =>
                        <div className='resume-card'>
                            <div className='resume-text' onClick={() => {
                                setOpenModal(true)
                                setIsPdf(true)
                                setResumeData(resume)
                            }}>
                                <h4 className='resume-name'>{resume.full_name || ''}</h4>
                                <h4 className='resume-role'>{resume.role || ''}</h4>
                                <h4 className='resume-description'>{resume.description || ''}</h4>
                            </div>
                            <div className='resume-icons'>
                                <img src={DownloadIcon} className='resume-icon' />
                                <img src={EditIcon} className='resume-icon' />
                                <img src={TrashCan} onClick={() => {
                                    setResumeData(resume)
                                    setOpenModal(true)
                                }} className='resume-icon' />
                            </div>
                        </div>
                    )
                    : ''
                }
            </div>
            {openModal && isPdf ?
                <div className='pdf-modal'>
                    <h4 className='close-modal' onClick={() => {
                        setOpenModal(false)
                        setIsPdf(false)
                        setResumeData({})
                    }}>Close</h4>
                    <Resume
                        resumeData={resumeData}
                    />
                </div> : ''}
            {openModal && !isPdf ?
                <div className='remove-modal'>
                    <h4>Are you sure you want to delete {resumeData.full_name} Resume?</h4>
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
                            handleClick={removeResume}
                            color={APP_COLORS.MURREY}
                        />
                    </div>
                </div> : ''
            }
        </div>
    )
}
