export const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_URL

export const getHeaders = () => {
    const { token } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    return { authorization: `Bearer ${token}` }
}

export const getConfig = () => {
    const { token } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    return { headers: { authorization: `Bearer ${token}` } }
}