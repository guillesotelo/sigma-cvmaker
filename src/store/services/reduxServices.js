import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_URL

const loginUser = async data => {
    try {
        const res = await axios.post(`${API_URL}/api/user/login`, data)
        const user = res.data
        localStorage.setItem('user', JSON.stringify({
            ...user,
            app: 'cvmaker',
            login: new Date()
        }))
        return user
    } catch (error) { console.log(error) }
}

const registerUser = async data => {
    try {
        const newUser = await axios.post(`${API_URL}/api/user/create`, data)
        return newUser
    } catch (err) { console.log(err) }
}

const updateUser = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/update`, data)
        return user
    } catch (err) { console.log(err) }
}

const removeUser = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/remove`, data)
        return user.data
    } catch (err) { console.log(err) }
}

const setUserVoid = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/logout`, { params: data })
        localStorage.clear()
        return user.data
    } catch (err) { console.log(err) }
}

const getAllUsers = async data => {
    try {
        const users = await axios.get(`${API_URL}/api/user/getAll`, { params: data })
        return users.data
    } catch (err) { console.log(err) }
}

const getManagers = async data => {
    try {
        const managers = await axios.get(`${API_URL}/api/user/getManagers`, { params: data })
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
        const user = await axios.post(`${API_URL}/api/user/changePass`, data)
        return user
    } catch (err) { console.log(err) }
}

const getAllResumes = async data => {
    try {
        const resumes = await axios.get(`${API_URL}/api/resume/getAll`, { params: { email: data.email, getAll: data.getAll } })
        return resumes.data
    } catch (err) { console.log(err) }
}

const getResumeById = async _id => {
    try {
        const resume = await axios.get(`${API_URL}/api/resume/getById`, { params: { _id } })
        return resume.data
    } catch (err) { console.log(err) }
}

const getImageByEmail = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/user/getProfileImage`, { params: { email: data.email } })
        return image.data
    } catch (err) { console.log(err) }
}

const getSignatureByEmail = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/user/getSignature`, { params: { email: data.email } })
        return image.data
    } catch (err) { console.log(err) }
}

const getAllImages = async () => {
    try {
        const images = await axios.get(`${API_URL}/api/image/getAll`)
        return images.data
    } catch (err) { console.log(err) }
}

const saveImage = async data => {
    try {
        const saved = await axios.post(`${API_URL}/api/image/create`, data)
        return saved.data
    } catch (err) { console.log(err) }
}

const updateImage = async data => {
    try {
        const updated = await axios.post(`${API_URL}/api/image/update`, data)
        return updated.data
    } catch (err) { console.log(err) }
}

const removeImage = async data => {
    try {
        const deleted = await axios.post(`${API_URL}/api/image/remove`, data)
        return deleted.data
    } catch (err) { console.log(err) }
}

const getResumeByEmail = async data => {
    try {
        const resumes = await axios.get(`${API_URL}/api/resume/myResume`, data)
        return resumes.data
    } catch (err) { console.log(err) }
}

const createResume = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/create`, data)
        return resume
    } catch (err) { console.log(err) }
}

const updateResume = async data => {
    try {
        const resume = await axios.post(`${API_URL}/api/resume/update`, data)
        return resume
    } catch (err) { console.log(err) }
}

const deleteResume = async data => {
    try {
        const deleted = await axios.post(`${API_URL}/api/resume/remove`, data)
        return deleted
    } catch (err) { console.log(err) }
}

const getCVTypeByEmail = async data => {
    try {
        const master = await axios.get(`${API_URL}/api/resume/getByType`, { params: data })
        return master.data
    } catch (err) { console.log(err) }
}

const createReport = async data => {
    try {
        const report = await axios.post(`${API_URL}/api/report/create`, data)
        return report.data
    } catch (err) { console.log(err) }
}

const getReports = async data => {
    try {
        const reports = await axios.get(`${API_URL}/api/report/getAll`, { params: data })
        return reports.data
    } catch (err) { console.log(err) }
}

const updateReportData = async data => {
    try {
        const report = await axios.post(`${API_URL}/api/report/update`, data)
        return report
    } catch (err) { console.log(err) }
}

const getUserPermissions = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/permissions`, { params: data })
        return user.data
    } catch (err) { console.log(err) }
}

const getCVLogo = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/resume/getCVLogo`, { params: { type: data.type } })
        return image.data
    } catch (err) { console.log(err) }
}

const saveCVLogo = async data => {
    try {
        const image = await axios.post(`${API_URL}/api/resume/saveCVLogo`, data)
        return image.data
    } catch (err) { console.log(err) }
}

const createAppData = async data => {
    try {
        const newAppData = await axios.post(`${API_URL}/api/app/create`, data)
        return newAppData.data
    } catch (err) { console.log(err) }
}

const updateAppDataItem = async data => {
    try {
        const newAppData = await axios.post(`${API_URL}/api/app/update`, data)
        return newAppData.data
    } catch (err) { console.log(err) }
}

const getAppDataByType = async data => {
    try {
        const appData = await axios.get(`${API_URL}/api/app/getByType`, { params: data })
        return appData.data
    } catch (err) { console.log(err) }
}

const getAllAppData = async data => {
    try {
        const appData = await axios.get(`${API_URL}/api/app/getAll`, { params: data })
        return appData.data
    } catch (err) { console.log(err) }
}

const getAllLogs = async data => {
    try {
        const logs = await axios.get(`${API_URL}/api/log/getAll`, { params: data })
        return logs.data
    } catch (err) { console.log(err) }
}

const createLog = async data => {
    try {
        const log = await axios.post(`${API_URL}/api/log/create`, data)
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
    getSignatureByEmail,
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
    removeImage
}
