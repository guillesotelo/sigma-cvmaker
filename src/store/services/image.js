import axios from 'axios';
import { API_URL, getConfig, getHeaders } from "./config"

const getImageByEmailAndType = async data => {
    try {
        const { name, email, type } = data || {}
        const image = await axios.get(`${API_URL}/api/image/getByType`, { params: { name, email, type }, headers: getHeaders() })
        return image.data
    } catch (err) { return null }
}

const getPublicImageByType = async data => {
    try {
        const { name, email, type } = data || {}
        const image = await axios.get(`${API_URL}/api/public/getImageByType`, { params: { name, email, type } })
        return image.data
    } catch (err) { return null }
}

const getAllImages = async () => {
    try {
        const images = await axios.get(`${API_URL}/api/image/getAll`, getConfig())
        return images.data
    } catch (err) { console.log(err) }
}

const getCompanyLogo = async client => {
    try {
        const logos = await axios.get(`${API_URL}/api/image/getClientLogo`, { params: { client }, headers: getHeaders() })
        return logos.data
    } catch (err) { console.log(err) }
}

const getPublicLogo = async client => {
    try {
        const logos = await axios.get(`${API_URL}/api/public/getClientLogo`, { params: { client } })
        return logos.data
    } catch (err) { console.log(err) }
}


const getAllCompanyLogos = async client => {
    try {
        const logos = await axios.get(`${API_URL}/api/image/getAllClientLogos`, getConfig())
        return logos.data
    } catch (err) { console.log(err) }
}

const saveImage = async data => {
    try {
        const saved = await axios.post(`${API_URL}/api/image/create`, data, getConfig())
        return saved.data
    } catch (err) { console.log(err) }
}

const updateImage = async data => {
    try {
        const updated = await axios.post(`${API_URL}/api/image/update`, data, getConfig())
        return updated.data
    } catch (err) { console.log(err) }
}

const removeImage = async data => {
    try {
        const deleted = await axios.post(`${API_URL}/api/image/remove`, data, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getImageByEmailAndType,
    getPublicImageByType,
    getAllImages,
    saveImage,
    updateImage,
    removeImage,
    getCompanyLogo,
    getPublicLogo,
    getAllCompanyLogos
}