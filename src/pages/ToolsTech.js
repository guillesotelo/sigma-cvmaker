import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import { getAppData, getOneAppData, saveAppData, updateAppData } from '../store/reducers/appData'
import { toolsHeaders } from '../constants/tableHeaders'

export default function ToolsTech() {
    const [data, setData] = useState({})
    const [appData, setAppData] = useState([])
    const [tools, setTools] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const [typeOptions, setTypeOptions] = useState([])
    const [removeModal, setRemoveModal] = useState(false)
    const [isNew, setIsNew] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedTool, setSelectedTool] = useState(-1)
    const [toolsEdit, setToolsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedTool > -1) setData({ ...data, ...tools[selectedTool] })
    }, [selectedTool])

    useEffect(() => {
        if (appData.length) {
            let _tools = []
            appData.forEach(data => {
                if (data.type === 'tools') _tools = JSON.parse(data.data) || []
            })
            setTools(_tools)
            setFieldOptions(_tools.map(t => t.field))
            setTypeOptions(_tools.map(t => t.type))
        }
    }, [appData])

    useEffect(() => {
        if (!user || !user.email || !isManager) history.push('home')
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

    const saveTools = async updatedTools => {
        try {
            setLoading(true)
            let saved = null
            const exists = await dispatch(getOneAppData({ type: 'tools' })).then(data => data.payload)
            if (exists) {
                saved = await dispatch(updateAppData({
                    ...user,
                    type: 'tools',
                    data: JSON.stringify(updatedTools)
                })).then(data => data.payload)
            } else {
                saved = await dispatch(saveAppData({
                    ...user,
                    type: 'tools',
                    data: JSON.stringify(updatedTools)
                })).then(data => data.payload)
            }

            if (!saved) toast.error('Error saving Tool')
            else toast.success('Tool saved successfully')

            setIsNew(false)
            setLoading(false)
            setRemoveModal(false)
        } catch (err) {
            setLoading(false)
            toast.error('Error saving Tool')
            console.error(err)
        }
    }

    const saveToolsData = () => {
        const updatedTools = tools
        updatedTools[selectedTool] = {
            name: data.name || '',
            type: data.type || '',
            field: data.field || ''
        }
        saveTools(updatedTools)
        setSelectedTool(-1)
        if (toolsEdit) {
            setToolsEdit(false)
        }
        setData({})
    }

    const removeItem = () => {
        const updated = tools
        updated.splice(selectedTool, 1)

        saveTools(updated)
        setSelectedTool(-1)
        if (toolsEdit) {
            setToolsEdit(false)
        }
        setData({})
    }

    return (
        <div className='tools-tech-container'>
            <div className='tools-tech-section'>
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
                        label='New Tool / Tech'
                        handleClick={() => {
                            setSelectedTool(tools.length)
                            setToolsEdit(true)
                            setIsNew(true)
                        }}
                        color={APP_COLORS.GREEN}
                        disabled={toolsEdit}
                    />
                    {toolsEdit && !isNew ?
                        <CTAButton
                            label='Delete'
                            handleClick={() => setRemoveModal(true)}
                            color={APP_COLORS.RED}
                            disabled={!toolsEdit}
                        /> : ''}
                </div>
                <div className='settings-skills-container' style={{ filter: removeModal && 'blur(10px)' }}>
                    <DataTable
                        title='Tools & Tech'
                        subtitle='Here is a list of all tools & tech in the system'
                        maxRows={9}
                        tableData={tools}
                        tableHeaders={toolsHeaders}
                        loading={loading}
                        item={selectedTool}
                        setItem={setSelectedTool}
                        isEdit={toolsEdit}
                        setIsEdit={setToolsEdit}
                    />
                    {toolsEdit ?
                        <div className='settings-select-section'>
                            <div className='users-details'>
                                <InputField
                                    label='Tool / Tech Name'
                                    type='text'
                                    name='name'
                                    placeholder='Java'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)', width: '98%' }}
                                    value={data.name || ''}
                                />
                                <InputField
                                    label='Field'
                                    type='text'
                                    name='field'
                                    placeholder='Back End'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)', width: '98%' }}
                                    value={data.field || ''}
                                    options={fieldOptions}
                                />
                                <InputField
                                    label='Type'
                                    type='text'
                                    name='type'
                                    placeholder='Software Development'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)', width: '98%' }}
                                    value={data.type || ''}
                                    options={typeOptions}
                                />
                            </div>
                            <div className='settings-skill-btns'>
                                <CTAButton
                                    label='Discard'
                                    handleClick={() => {
                                        setSelectedTool(-1)
                                        setToolsEdit(false)
                                        setIsEdit(false)
                                        setIsNew(false)
                                        setData({})
                                    }}
                                    color={APP_COLORS.GRAY}
                                />
                                <CTAButton
                                    label='Save'
                                    handleClick={saveToolsData}
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