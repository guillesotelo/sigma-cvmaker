import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'

export default function Help() {
    const [data, setData] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()

    const updateData = (key, value) => {
        setIsEdit(true)
        setData({ ...data, [key]: value })
    }

    return (
        <div className='help-container'>
            <h4 className='page-title'>Help</h4>
        </div>
    )
}