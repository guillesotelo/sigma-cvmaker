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

export default function ToolsTech() {
    const [data, setData] = useState({})
    const [appData, setAppData] = useState([])
    const [tools, setTools] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const [typeOptions, setTypeOptions] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [selectedTool, setSelectedTool] = useState(-1)
    const [toolsEdit, setToolsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const history = useHistory()
    const dispatch = useDispatch()
    const toolsHeaders = [
        {
            name: 'TOOL',
            value: 'name'
        },
        {
            name: 'TYPE',
            value: 'type'
        },
        {
            name: 'FIELD',
            value: 'field'
        }
    ]


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

            setLoading(false)
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

    return (
        <div className='tools-tech-container'>
            <div className='tools-tech-section'>
                <div className='settings-new-skill-btn'>
                    <CTAButton
                        label='New Tool / Tech'
                        handleClick={() => {
                            setSelectedTool(tools.length)
                            setToolsEdit(true)
                        }}
                        color={APP_COLORS.GREEN}
                        disabled={toolsEdit}
                    />
                </div>
                <div className='settings-skills-container'>
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
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.name || ''}
                                />
                                <InputField
                                    label='Field'
                                    type='text'
                                    name='field'
                                    placeholder='Back End'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
                                    value={data.field || ''}
                                    options={fieldOptions}
                                />
                                <InputField
                                    label='Type'
                                    type='text'
                                    name='type'
                                    placeholder='Software Development'
                                    updateData={updateData}
                                    style={{ color: 'rgb(71, 71, 71)' }}
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