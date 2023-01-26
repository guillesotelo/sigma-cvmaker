import axios from 'axios';
import { API_URL, getConfig, getHeaders } from "./config"


const getAllLogs = async data => {
    try {
        const logs = await axios.get(`${API_URL}/api/log/getAll`, { params: data, headers: getHeaders() })
        return logs.data
    } catch (err) { console.log(err) }
}

const createLog = async data => {
    try {
        const log = await axios.post(`${API_URL}/api/log/create`, data, getConfig())
        return log.data
    } catch (err) { console.log(err) }
}

export {
    getAllLogs,
    createLog
}