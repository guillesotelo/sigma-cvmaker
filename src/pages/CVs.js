import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/app'
import Resume from '../components/Resume'
import { getResumes, removeResume, saveLog } from '../store/reducers/resume'
import SearchBar from '../components/SearchBar'
import DataTable from '../components/DataTable'

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
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const dispatch = useDispatch()
    const history = useHistory()
    const cvHeaders = [
        {
            name: 'NAME',
            value: 'username'
        },
        {
            name: 'LAST UPDATED',
            value: 'updatedAt'
        },
        {
            name: 'JOB DESCRIPTION',
            value: 'role'
        },
        {
            name: 'MANAGER',
            value: 'managerName'
        },
        {
            name: 'NOTE',
            value: 'note'
        },
        {
            name: 'TYPE',
            value: 'type'
        },
        {
            name: 'ACTIONS',
            value: 'icons'
        }
    ]

    useEffect(() => {
        const localUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!localUser || !localUser.email) history.push('/login')

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
                details: `CV exported: ${resumeData.username}-${resumeData.type}`,
                module: 'CV',
                itemId: resumeData._id || null
            })).then(data => data.payload)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='my-resumes-container'>
            <SearchBar
                handleChange={e => handleSearch(e)}
                placeholder='Search by words or text...'
                style={{ filter: openModal && 'blur(10px)', width: '20vw' }}
                onKeyPress={handleSearch}
                triggerSearch={triggerSearch}
                setData={setResumeData}
            />
            <div className='resumes-list' style={{ filter: openModal && 'blur(10px)' }}>
                <DataTable
                    title={`CV's`}
                    subtitle={`Here is a list of all CV's in the system`}
                    maxRows={9}
                    tableData={filteredRes}
                    tableHeaders={cvHeaders}
                    loading={loading}
                    setLoading={setLoading}
                    item={selectedCV}
                    setItem={setSelectedCV}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    setResumeData={setResumeData}
                    setOpenModal={setOpenModal}
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
        </div>
    )
}
