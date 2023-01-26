import axios from 'axios';
import { API_URL, getConfig, getHeaders } from "./config"

const createReport = async data => {
    try {
        const report = await axios.post(`${API_URL}/api/report/create`, data, getConfig())
        return report.data
    } catch (err) { console.log(err) }
}

const getReports = async data => {
    try {
        const reports = await axios.get(`${API_URL}/api/report/getAll`, { params: data, headers: getHeaders() })
        return reports.data
    } catch (err) { console.log(err) }
}

const updateReportData = async data => {
    try {
        const report = await axios.post(`${API_URL}/api/report/update`, data, getConfig())
        return report
    } catch (err) { console.log(err) }
}

export {
    createReport,
    getReports,
    updateReportData
}