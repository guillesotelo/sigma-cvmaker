import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import GoBackIcon from '../icons/goback-icon.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import { getAppData, getOneAppData, saveAppData, updateAppData } from '../store/reducers/appData'

export default function Clients() {
    const [data, setData] = useState({})
    const [appData, setAppData] = useState([])
    const [clients, setClients] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [selectedClient, setSelectedClient] = useState(-1)
    const [removeModal, setRemoveModal] = useState(false)
    const [clientsEdit, setClientsEdit] = useState(false)
    const [isNew, setIsNew] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()
    const clientsHeaders = [
        {
            name: 'NAME',
            value: 'name'
        },
        {
            name: 'LOCATION',
            value: 'location'
        },
        {
            name: 'TYPE',
            value: 'type'
        },
        {
            name: 'CONTACT',
            value: 'contact'
        },
        {
            name: 'BUSINESS',
            value: 'business'
        }
    ]

    useEffect(() => {
        if (selectedClient > -1) setData({ ...data, ...clients[selectedClient] })
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
        pullAppData()
    }, [])

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
                    data: JSON.stringify(updatedclients)
                })).then(data => data.payload)
            } else {
                saved = await dispatch(saveAppData({
                    user,
                    type: 'clients',
                    data: JSON.stringify(updatedclients)
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
                <div className='settings-new-skill-btn'>
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
                <div className='settings-skills-container'>
                    <DataTable
                        title='Clients'
                        subtitle='Here is a list of all clients in the system'
                        tableData={clients}
                        tableHeaders={clientsHeaders}
                        loading={loading}
                        item={selectedClient}
                        setItem={setSelectedClient}
                        isEdit={clientsEdit}
                        setIsEdit={setClientsEdit}
                        sizes={['20%', '20%', '20%', '20%', '20%']}
                    />
                    {clientsEdit ?
                        <div className='settings-select-section'>
                            <div className='users-details'>
                                <InputField
                                    label='Client name'
                                    type='text'
                                    name='name'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.name || ''}
                                />
                                <InputField
                                    label='Location'
                                    type='text'
                                    name='location'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.location || ''}
                                />
                                <InputField
                                    label='Contact'
                                    type='text'
                                    name='contact'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.contact || ''}
                                />
                                <InputField
                                    label='Type of client'
                                    type='text'
                                    name='type'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.type || ''}
                                />
                                <InputField
                                    label='Field of business'
                                    type='text'
                                    name='business'
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