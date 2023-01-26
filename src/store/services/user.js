import axios from 'axios';
import { API_URL, getConfig, getHeaders } from "./config"

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
        const newUser = await axios.post(`${API_URL}/api/user/create`, data, getConfig())
        return newUser
    } catch (err) { console.log(err) }
}

const updateUser = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/update`, data, getConfig())
        return user.data
    } catch (err) { console.log(err) }
}

const removeUser = async data => {
    try {
        const user = await axios.post(`${API_URL}/api/user/remove`, data, getConfig())
        return user.data
    } catch (err) { console.log(err) }
}

const setUserVoid = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/logout`, { params: data, headers: getHeaders() })
        localStorage.clear()
        return user.data
    } catch (err) { console.log(err) }
}

const getAllUsers = async data => {
    try {
        const users = await axios.get(`${API_URL}/api/user/getAll`, { params: data, headers: getHeaders() })
        return users.data
    } catch (err) { console.log(err) }
}

const getManagers = async data => {
    try {
        const managers = await axios.get(`${API_URL}/api/user/getManagers`, { params: data, headers: getHeaders() })
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
        const user = await axios.post(`${API_URL}/api/user/changePass`, data, getConfig())
        return user
    } catch (err) { console.log(err) }
}

const getImageByEmail = async data => {
    try {
        const image = await axios.get(`${API_URL}/api/user/getProfileImage`, { params: { email: data.email }, headers: getHeaders() })
        return image.data
    } catch (err) { console.log(err) }
}

const getUserPermissions = async data => {
    try {
        const user = await axios.get(`${API_URL}/api/user/permissions`, { params: data, headers: getHeaders() })
        return user.data
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
    getImageByEmail,
    getUserPermissions
}