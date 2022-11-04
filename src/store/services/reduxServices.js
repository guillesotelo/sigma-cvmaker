import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_URL

const loginUser = async user => {
    try {
        const res = await axios.post(`${API_URL}/api/user`, user)
        const finalUser = res.data
        localStorage.setItem('user', JSON.stringify(finalUser))
        if(finalUser.defaultLedger !== null) localStorage.setItem('ledger', finalUser.defaultLedger)
        return finalUser
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

const setUserVoid = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/logout`, data)
        localStorage.removeItem('user')
        return user.data
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
        const resumes = await axios.get(`${API_URL}/api/resume/getAll`, { params: data })
        return resumes.data
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

export {
    loginUser,
    registerUser,
    updateUser,
    setUserVoid,
    resetPassordByEmail,
    changePass,
    getAllResumes,
    getResumeByEmail,
    createResume,
    updateResume,
    deleteResume
}
