import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import ImagePlaceholder from '../icons/image-placeholder.svg'
import Slider from '../components/Slider'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import { getAppData, getOneAppData, saveAppData, updateAppData } from '../store/reducers/appData'
import { getImageByType } from '../store/reducers/image'
import { clientsHeaders } from '../constants/tableHeaders'

export default function Clients() {
    const [data, setData] = useState({})
    const [appData, setAppData] = useState([])
    const [clients, setClients] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [selectedClient, setSelectedClient] = useState(-1)
    const [removeModal, setRemoveModal] = useState(false)
    const [clientsEdit, setClientsEdit] = useState(false)
    const [clientLogo, setClientLogo] = useState({})
    const [grayscale, setGrayscale] = useState(0)
    const [isNew, setIsNew] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedClient > -1) {
            setData({ ...data, ...clients[selectedClient] })
            getPreview(clients[selectedClient])
        }
    }, [selectedClient])

    useEffect(() => {
        if (appData.length) {
            let _clients = []
            appData.forEach(data => {
                if (data.type === 'clients') _clients = JSON.parse(data.data) || []
            })
            setClients(_clients)
        }
    }, [appData])

    useEffect(() => {
        setClientLogo({
            ...clientLogo,
            style: {
                filter: `grayscale(${grayscale}%)`,
                grayscale
            }
        })
    }, [grayscale])

    useEffect(() => {
        if (!user || !user.email || !isManager) history.push('home')
        pullAppData()
    }, [])

    const getPreview = async clientData => {
        try {
            const image = await dispatch(getImageByType({ name: clientData && clientData.name || '', type: 'Client Logo' })).then(data => data.payload)
            if (image) {
                setClientLogo({ logoImage: image.data, style: image.style ? JSON.parse(image.style) : {} })
                if (image.style) {
                    const imageStyles = JSON.parse(image.style)
                    setGrayscale(imageStyles.grayscale || 0)
                }
            }
            else setClientLogo({})
        } catch (err) {
            console.error(err)
        }
    }

    const updateData = (key, value) => {
        setIsEdit(true)
        setData({ ...data, [key]: value })
    }

    const pullAppData = async () => {
        try {
            setLoading(true)
            const _appData = await dispatch(getAppData({ email: user.email })).then(data => data.payload)
            if (_appData) {
                setAppData(_appData)
            }

            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error(err)
        }
    }

    const saveclients = async updatedclients => {
        try {
            setLoading(true)
            let saved = null

            const exists = await dispatch(getOneAppData({ type: 'clients' })).then(data => data.payload)

            if (exists) {
                saved = await dispatch(updateAppData({
                    user,
                    type: 'clients',
                    data: JSON.stringify(updatedclients),
                    clientName: data.name,
                    clientEmail: data.email,
                    clientLogo
                })).then(data => data.payload)
            } else {
                saved = await dispatch(saveAppData({
                    user,
                    type: 'clients',
                    data: JSON.stringify(updatedclients),
                    clientName: data.name,
                    clientEmail: data.email,
                    clientLogo
                })).then(data => data.payload)
            }

            if (!saved) toast.error('Error saving Client')
            else toast.success('Client Data saved successfully')

            setLoading(false)
            setIsNew(false)
            setSelectedClient(-1)
            setRemoveModal(false)
        } catch (err) {
            setRemoveModal(false)
            setLoading(false)
            toast.error('Error saving Client Data')
            console.error(err)
        }
    }

    const saveclientsData = () => {
        const updatedclients = clients
        updatedclients[selectedClient] = {
            name: data.name,
            location: data.location || '',
            type: data.type || '',
            contact: data.contact || '',
            email: data.email || '',
            business: data.business || ''
        }
        saveclients(updatedclients)
        setSelectedClient(-1)
        if (clientsEdit) {
            setClientsEdit(false)
        }
        setData({})
    }

    const removeItem = () => {
        const updatedclients = clients
        updatedclients.splice(selectedClient, 1)

        saveclients(updatedclients)
        setSelectedClient(-1)
        if (clientsEdit) {
            setClientsEdit(false)
        }
        setData({})
    }

    return (
        <div className='clients-container'>
            <div className='clients-section'>
                {removeModal ?
                    <div className='remove-modal'>
                        <h4 style={{ textAlign: 'center' }}>Are you sure you want to delete <br />{data.name}?</h4>
                        <div className='remove-modal-btns'>
                            <CTAButton
                                label='Cancel'
                                handleClick={() => {
                                    setRemoveModal(false)
                                }}
                                color={APP_COLORS.GRAY}
                            />
                            <CTAButton
                                label='Confirm'
                                handleClick={removeItem}
                                color={APP_COLORS.RED}
                            />
                        </div>
                    </div> : ''}
                <div className='settings-new-skill-btn' style={{ filter: removeModal && 'blur(10px)' }}>
                    <CTAButton
                        label='New Client'
                        handleClick={() => {
                            setSelectedClient(clients.length)
                            setClientsEdit(true)
                            setIsNew(true)
                        }}
                        color={APP_COLORS.GREEN}
                        disabled={clientsEdit}
                    />
                    {clientsEdit && !isNew ?
                        <CTAButton
                            label='Delete'
                            handleClick={() => setRemoveModal(true)}
                            color={APP_COLORS.RED}
                            disabled={!clientsEdit}
                        /> : ''}
                </div>
                <div className='settings-skills-container' style={{ filter: removeModal && 'blur(10px)' }}>
                    <DataTable
                        title='Clients'
                        subtitle='Here is a list of all clients in the system'
                        tableData={clients}
                        setTableData={setClients}
                        tableHeaders={clientsHeaders}
                        maxRows={9}
                        loading={loading}
                        item={selectedClient}
                        setItem={setSelectedClient}
                        isEdit={clientsEdit}
                        setIsEdit={setClientsEdit}
                    />
                    {clientsEdit ?
                        <div className='settings-select-section'>
                            <div className='client-details'>
                                {clientLogo.logoImage ?
                                    <img
                                        src={clientLogo.logoImage}
                                        style={clientLogo.style}
                                        className='client-logo-image'
                                        onClick={() => document.getElementById('logoImage').click()}
                                        loading='lazy'
                                    />
                                    : <img
                                        src={ImagePlaceholder}
                                        style={clientLogo.style}
                                        className='client-logo-svg'
                                        onClick={() => document.getElementById('logoImage').click()}
                                    />}
                                <InputField
                                    label=''
                                    type='file'
                                    name='logoImage'
                                    filename='logoImage'
                                    image={clientLogo}
                                    setImage={setClientLogo}
                                    setIsEdit={setIsEdit}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                />
                                {clientLogo.logoImage ? <div className='color-users'>
                                    <Slider
                                        value={grayscale}
                                        setValue={setGrayscale}
                                        setIsEdit={setIsEdit}
                                        label='Gray Scale'
                                        max={100}
                                        sign='%'
                                        style={{ marginBottom: '1vw' }}
                                    />
                                </div> : ''}
                                <InputField
                                    label='Client name'
                                    type='text'
                                    name='name'
                                    placeholder='Sigma Connectivity'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.name || ''}
                                />
                                <InputField
                                    label='Location'
                                    type='text'
                                    name='location'
                                    placeholder='Mobilvägen 10, Lund, Sweden'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.location || ''}
                                />
                                <InputField
                                    label='Contact name'
                                    type='text'
                                    name='contact'
                                    placeholder='Mathew Jackson'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.contact || ''}
                                />
                                <InputField
                                    label='Contact email'
                                    type='text'
                                    name='email'
                                    placeholder='contact@sigma.se'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.email || ''}
                                />
                                <InputField
                                    label='Type of client'
                                    type='text'
                                    name='type'
                                    placeholder='Partner'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.type || ''}
                                />
                                <InputField
                                    label='Field of business'
                                    type='text'
                                    name='business'
                                    placeholder='Engineering'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.business || ''}
                                />
                            </div>
                            <div className='settings-skill-btns'>
                                <CTAButton
                                    label='Discard'
                                    handleClick={() => {
                                        setSelectedClient(-1)
                                        setClientsEdit(false)
                                        setIsEdit(false)
                                        setIsNew(false)
                                        setData({})
                                    }}
                                    color={APP_COLORS.GRAY}
                                />
                                <CTAButton
                                    label='Save'
                                    handleClick={saveclientsData}
                                    color={APP_COLORS.GREEN}
                                    loading={loading}
                                    disabled={!isEdit}
                                />
                            </div>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
        </div>
    )
}