import axios from 'axios';
import { API_URL, getConfig, getHeaders } from "./config"

const getAllResumes = async data => {
    try {
        const resumes = await axios.get(`${API_URL}/api/resume/getAll`, { params: { email: data.email, getAll: data.getAll }, headers: getHeaders() })
        return resumes.data
    } catch (err) { console.log(err) }
}

const getResumeById = async _id => {
    try {
        const resume = await axios.get(`${API_URL}/api/resume/getById`, { params: { _id }, headers: getHeaders() })
        return resume.data
    } catch (err) { console.log(err) }
}

const getResumePdfById = async _id => {
    try {
        const resumePdf = await axios.get(`${API_URL}/api/resume/getPdfById`, { params: { _id }, headers: getHeaders() })
        return resumePdf.data
    } catch (err) { console.log(err) }
}

const getPublicCVById = async ({ _id, isPdf }) => {
    try {
        const resume = await axios.get(`${API_URL}/api/public/getById`, { params: { _id, isPdf } })
        return resume.data
    } catch (err) { console.log(err) }
}

const publishCV = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/publish`, data, getConfig())
        return resume.data
    } catch (err) { console.log(err) }
}

const getResumeByEmail = async data => {
    try {
        const resumes = await axios.get(`${API_URL}/api/resume/myResume`, { params: data, headers: getHeaders() })
        return resumes.data
    } catch (err) { console.log(err) }
}

const createResume = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/create`, data, getConfig())
        return resume
    } catch (err) { console.log(err) }
}

const updateResume = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/update`, data, getConfig())
        return resume
    } catch (err) { console.log(err) }
}

const deleteResume = async data => {
    try {
        console.log('data', data)
        const deleted = await axios.post(`${API_URL}/api/resume/remove`, data, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

const getCVTypeByEmail = async data => {
    try {
        const master = await axios.get(`${API_URL}/api/resume/getByType`, { params: data, headers: getHeaders() })
        return master.data
    } catch (err) { console.log(err) }
}

const getCVLogo = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/resume/getCVLogo`, { params: { type: data.type }, headers: getHeaders() })
        return image.data
    } catch (err) { console.log(err) }
}

const getPublicCVHeaderLogo = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/public/getCVLogo`, { params: { type: data.type }, headers: getHeaders() })
        return image.data
    } catch (err) { console.log(err) }
}

const saveCVLogo = async data => {
    try {
        const image = await axios.post(`${API_URL}/api/resume/saveCVLogo`, data, getConfig())
        return image.data
    } catch (err) { console.log(err) }
}

export {
    getAllResumes,
    getResumeById,
    getResumePdfById,
    getPublicCVById,
    publishCV,
    getResumeByEmail,
    getCVTypeByEmail,
    getCVLogo,
    getPublicCVHeaderLogo,
    saveCVLogo,
    createResume,
    updateResume,
    deleteResume
}