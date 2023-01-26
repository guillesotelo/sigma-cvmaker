import axios from 'axios';
import { API_URL, getConfig, getHeaders } from "./config"

const getRemovedItems = async data => {
    try {
        const removed = await axios.get(`${API_URL}/api/app/getRemovedItems`, { params: { email: data.email }, headers: getHeaders() })
        return removed.data
    } catch (err) { console.log(err) }
}

const restoreItemfromTrash = async data => {
    try {
        const restored = await axios.get(`${API_URL}/api/app/restoreItem`, { params: data, headers: getHeaders() })
        return restored.data
    } catch (err) { console.log(err) }
}

const permanentlyRemove = async data => {
    try {
        const removed = await axios.get(`${API_URL}/api/app/removeItem`, { params: data, headers: getHeaders() })
        return removed.data
    } catch (err) { console.log(err) }
}

const createAppData = async data => {
    try {
        const newAppData = await axios.post(`${API_URL}/api/app/create`, data, getConfig())
        return newAppData.data
    } catch (err) { console.log(err) }
}

const updateAppDataItem = async data => {
    try {
        const newAppData = await axios.post(`${API_URL}/api/app/update`, data, getConfig())
        return newAppData.data
    } catch (err) { console.log(err) }
}

const getAppDataByType = async data => {
    try {
        const appData = await axios.get(`${API_URL}/api/app/getByType`, { params: data, headers: getHeaders() })
        return appData.data
    } catch (err) { console.log(err) }
}

const getAllAppData = async data => {
    try {
        const appData = await axios.get(`${API_URL}/api/app/getAll`, { params: data, headers: getHeaders() })
        return appData.data
    } catch (err) { console.log(err) }
}

export {
    createAppData,
    updateAppDataItem,
    getAppDataByType,
    getAllAppData,
    getRemovedItems,
    restoreItemfromTrash,
    permanentlyRemove
}