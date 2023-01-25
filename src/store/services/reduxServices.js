import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_URL
let { token } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
const headers = { authorization: `Bearer ${token}` }

const loginUser = async data => {
    try {
        const res = await axios.post(`${API_URL}/api/user/login`, data)
        const user = res.data
        localStorage.setItem('user', JSON.stringify({
            ...user,
            app: 'cvmaker',
            login: new Date()
        }))
        token = user.token
        return user
    } catch (error) { console.log(error) }
}

const registerUser = async data => {
    try {
        const newUser = await axios.post(`${API_URL}/api/user/create`, data, { headers })
        return newUser
    } catch (err) { console.log(err) }
}

const updateUser = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/update`, data, { headers })
        return user
    } catch (err) { console.log(err) }
}

const removeUser = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/remove`, data, { headers })
        return user.data
    } catch (err) { console.log(err) }
}

const setUserVoid = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/logout`, { params: data, headers })
        localStorage.clear()
        return user.data
    } catch (err) { console.log(err) }
}

const getAllUsers = async data => {
    try {
        const users = await axios.get(`${API_URL}/api/user/getAll`, { params: data, headers })
        return users.data
    } catch (err) { console.log(err) }
}

const getManagers = async data => {
    try {
        const managers = await axios.get(`${API_URL}/api/user/getManagers`, { params: data, headers })
        return managers.data
    } catch (err) { console.log(err) }
}

const resetPassordByEmail = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/resetByEmail`, data)
        return user
    } catch (err) { console.log(err) }
}

const changePass = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/changePass`, data, { headers })
        return user
    } catch (err) { console.log(err) }
}

const getRemovedItems = async data => {
    try {
        const removed = await axios.get(`${API_URL}/api/app/getRemovedItems`, { params: { email: data.email }, headers })
        return removed.data
    } catch (err) { console.log(err) }
}

const getAllResumes = async data => {
    try {
        const resumes = await axios.get(`${API_URL}/api/resume/getAll`, { params: { email: data.email, getAll: data.getAll }, headers })
        return resumes.data
    } catch (err) { console.log(err) }
}

const getResumeById = async _id => {
    try {
        const resume = await axios.get(`${API_URL}/api/resume/getById`, { params: { _id }, headers })
        return resume.data
    } catch (err) { console.log(err) }
}

const getImageByEmail = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/user/getProfileImage`, { params: { email: data.email }, headers })
        return image.data
    } catch (err) { console.log(err) }
}

const getImageByEmailAndType = async data => {
    try {
        const { name, email, type } = data || {}
        const image = await axios.get(`${API_URL}/api/image/getByType`, { params: { name, email, type }, headers })
        return image.data
    } catch (err) { return null }
}

const getAllImages = async () => {
    try {
        const images = await axios.get(`${API_URL}/api/image/getAll`, { headers })
        return images.data
    } catch (err) { console.log(err) }
}

const getCompanyLogo = async client => {
    try {
        const logos = await axios.get(`${API_URL}/api/image/getClientLogo`, { params: { client }, headers })
        return logos.data
    } catch (err) { console.log(err) }
}

const getAllCompanyLogos = async client => {
    try {
        const logos = await axios.get(`${API_URL}/api/image/getAllClientLogos`, { headers })
        return logos.data
    } catch (err) { console.log(err) }
}

const saveImage = async data => {
    try {
        const saved = await axios.post(`${API_URL}/api/image/create`, data, { headers })
        return saved.data
    } catch (err) { console.log(err) }
}

const updateImage = async data => {
    try {
        const updated = await axios.post(`${API_URL}/api/image/update`, data, { headers })
        return updated.data
    } catch (err) { console.log(err) }
}

const removeImage = async data => {
    try {
        const deleted = await axios.post(`${API_URL}/api/image/remove`, data, { headers })
        return deleted.data
    } catch (err) { console.log(err) }
}

const restoreItemfromTrash = async data => {
    try {
        const restored = await axios.get(`${API_URL}/api/app/restoreItem`, { params: data, headers })
        return restored.data
    } catch (err) { console.log(err) }
}

const permanentlyRemove = async data => {
    try {
        const removed = await axios.get(`${API_URL}/api/app/removeItem`, { params: data, headers })
        return removed.data
    } catch (err) { console.log(err) }
}

const getResumeByEmail = async data => {
    try {
        const resumes = await axios.get(`${API_URL}/api/resume/myResume`, { params: data, headers })
        return resumes.data
    } catch (err) { console.log(err) }
}

const createResume = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/create`, data, { headers })
        return resume
    } catch (err) { console.log(err) }
}

const updateResume = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/update`, data, { headers })
        return resume
    } catch (err) { console.log(err) }
}

const deleteResume = async data => {
    try {
        const deleted = await axios.post(`${API_URL}/api/resume/remove`, data, { headers })
        return deleted
    } catch (err) { console.log(err) }
}

const getCVTypeByEmail = async data => {
    try {
        const master = await axios.get(`${API_URL}/api/resume/getByType`, { params: data, headers })
        return master.data
    } catch (err) { console.log(err) }
}

const createReport = async data => {
    try {
        const report = await axios.post(`${API_URL}/api/report/create`, data, { headers })
        return report.data
    } catch (err) { console.log(err) }
}

const getReports = async data => {
    try {
        const reports = await axios.get(`${API_URL}/api/report/getAll`, { params: data, headers })
        return reports.data
    } catch (err) { console.log(err) }
}

const updateReportData = async data => {
    try {
        const report = await axios.post(`${API_URL}/api/report/update`, data, { headers })
        return report
    } catch (err) { console.log(err) }
}

const getUserPermissions = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/permissions`, { params: data, headers })
        return user.data
    } catch (err) { console.log(err) }
}

const getCVLogo = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/resume/getCVLogo`, { params: { type: data.type }, headers })
        return image.data
    } catch (err) { console.log(err) }
}

const saveCVLogo = async data => {
    try {
        const image = await axios.post(`${API_URL}/api/resume/saveCVLogo`, data, { headers })
        return image.data
    } catch (err) { console.log(err) }
}

const createAppData = async data => {
    try {
        const newAppData = await axios.post(`${API_URL}/api/app/create`, data, { headers })
        return newAppData.data
    } catch (err) { console.log(err) }
}

const updateAppDataItem = async data => {
    try {
        const newAppData = await axios.post(`${API_URL}/api/app/update`, data, { headers })
        return newAppData.data
    } catch (err) { console.log(err) }
}

const getAppDataByType = async data => {
    try {
        const appData = await axios.get(`${API_URL}/api/app/getByType`, { params: data, headers })
        return appData.data
    } catch (err) { console.log(err) }
}

const getAllAppData = async data => {
    try {
        const appData = await axios.get(`${API_URL}/api/app/getAll`, { params: data, headers })
        return appData.data
    } catch (err) { console.log(err) }
}

const getAllLogs = async data => {
    try {
        const logs = await axios.get(`${API_URL}/api/log/getAll`, { params: data, headers })
        return logs.data
    } catch (err) { console.log(err) }
}

const createLog = async data => {
    try {
        const log = await axios.post(`${API_URL}/api/log/create`, data, { headers })
        return log.data
    } catch (err) { console.log(err) }
}

export {
    loginUser,
    registerUser,
    updateUser,
    setUserVoid,
    getAllUsers,
    getManagers,
    removeUser,
    resetPassordByEmail,
    changePass,
    getAllResumes,
    getResumeById,
    getImageByEmail,
    getImageByEmailAndType,
    getResumeByEmail,
    getCVTypeByEmail,
    getCVLogo,
    saveCVLogo,
    createResume,
    updateResume,
    deleteResume,
    createReport,
    getReports,
    updateReportData,
    getUserPermissions,
    createAppData,
    updateAppDataItem,
    getAppDataByType,
    getAllAppData,
    getAllLogs,
    createLog,
    getAllImages,
    saveImage,
    updateImage,
    removeImage,
    getRemovedItems,
    restoreItemfromTrash,
    permanentlyRemove,
    getCompanyLogo,
    getAllCompanyLogos
}
