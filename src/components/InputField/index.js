import React, { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify'
import { APP_COLORS } from '../../constants/app'
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import HideIcon from '../../icons/hide-icon.svg'
import ShwoIcon from '../../icons/show-icon.svg'
import './styles.css'

export default function InputField(props) {
    const [showDropDown, setShowDropDown] = useState(false)
    const [focus, setFocus] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [dropValue, setDropValue] = useState(null)

    const {
        name,
        type,
        label,
        placeholder,
        style,
        updateData,
        autoComplete,
        value,
        cols,
        rows,
        filename,
        image,
        setImage,
        setIsEdit,
        options,
        hidden,
        setHidden,
        fontSize,
        id
    } = props

    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            if (value && options && options.length) {
                const matches = options.filter(op => op.toLowerCase().includes(value.toLowerCase()) && op)
                if (matches && matches.length && focus) {
                    setShowDropDown(true)
                    setSuggestions([...new Set(matches)])
                } else setShowDropDown(false)
            } else setShowDropDown(false)
            if (dropValue === value) setShowDropDown(false)
        }
        return () => { isMounted = false }
    }, [value])

    const handleChange = (newValue) => {
        const { valueAsNumber, value } = newValue.target
        if (type === 'number') {
            updateData(name, valueAsNumber)
        }
        else {
            updateData(name, value)
        }
    }

    const convertToBase64 = (file) => {
        try {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                }
                fileReader.onerror = (error) => {
                    reject(error)
                }
            })
        } catch (err) {
            console.error(err)
            toast.error('Error loading file. Please try again')
        }
    }

    const uploadFile = async e => {
        try {
            const file = e.target.files[0]
            if (file) {
                const compressOptions = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 300,
                    useWebWorker: true
                }
                const compressedFile = await imageCompression(file, compressOptions)

                const base64 = await convertToBase64(compressedFile)
                setImage({ ...image, [filename]: base64 })
                if (setIsEdit) setIsEdit(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const hideItem = item => {
        if (item) {
            const _hidden = [...hidden]
            _hidden.push(item)
            setHidden(_hidden)
        }
    }

    const showItem = item => {
        if (label) setHidden(hidden.filter(value => value !== item))
    }

    return (
        <div className='inputfield-container' style={{
            margin: fontSize ? `${fontSize / 2}vw 0` : '.5vw 0',
            width: type === 'file' && 0,
            height: type === 'file' && 0
        }}>
            {label ?
                <h4
                    style={{
                        color: APP_COLORS.GRAY, opacity: hidden && hidden.includes(label) && '.2',
                        fontSize: fontSize ? `${fontSize - fontSize * 0.1}vw` : '.8vw'
                    }}
                    className='inputfield-label'>
                    {label || ''}
                </h4> : ''}
            {type === 'textarea' ?
                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: style && style.width || "100%", position: 'relative' }}>
                    <textarea
                        className='inputfield-textarea'
                        onChange={handleChange}
                        placeholder={placeholder || ''}
                        cols={cols || 2}
                        rows={rows || 4}
                        wrap="hard"
                        style={{
                            ...style,
                            opacity: hidden && hidden.includes(label) && '.2',
                            fontSize: fontSize ? `${fontSize}vw` : '.9vw',
                            padding: fontSize ? `${fontSize / 1.5}vw` : '.7vw'
                        }}
                        value={value}
                    />
                    {hidden && hidden.includes(label) ?
                        <img
                            src={ShwoIcon}
                            className='hide-icon-textarea'
                            onClick={() => showItem(label)}
                        />
                        : hidden ?
                            <img
                                src={HideIcon}
                                className='hide-icon-textarea'
                                onClick={() => hideItem(label)}
                            />
                            : ''
                    }
                </GrammarlyEditorPlugin>
                :
                type === 'file' ?
                    <input
                        type="file"
                        label="Image"
                        name={filename || 'file'}
                        accept=".jpeg, .png, .jpg"
                        onChange={(e) => uploadFile(e)}
                        style={{ height: 0, width: 0 }}
                        id={id || filename}
                    />
                    :
                    type === 'text' ?
                        <div className='inputfield-dropdown' style={style}>
                            <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%", textAlign: 'left' }}>
                                <input
                                    className='inputfield-field'
                                    autoComplete={autoComplete}
                                    onChange={handleChange}
                                    placeholder={placeholder || ''}
                                    type={type || 'text'}
                                    style={{
                                        opacity: hidden && hidden.includes(label) && '.2',
                                        fontSize: fontSize ? `${fontSize}vw` : '.9vw',
                                        padding: fontSize ? `${fontSize / 2}vw` : '.5vw'
                                    }}
                                    value={value}
                                    onFocus={() => setFocus(true)}
                                />
                            </GrammarlyEditorPlugin>
                            {hidden && hidden.includes(label) ?
                                <img
                                    src={ShwoIcon}
                                    className='hide-icon'
                                    onClick={() => showItem(label)}
                                />
                                : hidden ?
                                    <img
                                        src={HideIcon}
                                        className='hide-icon'
                                        onClick={() => hideItem(label)}
                                    />
                                    : ''
                            }
                            {showDropDown ?
                                <div className='input-dropdown-options' style={{ width: style.width || '100%' }}>
                                    {suggestions.map((suggestion, i) =>
                                        <h4
                                            key={i}
                                            className='dropdown-option'
                                            style={{
                                                borderTop: i === 0 && 'none',
                                                fontSize: fontSize ? `${fontSize - fontSize * 0.1}vw` : '.8vw'
                                            }}
                                            onClick={() => {
                                                updateData(name, suggestion)
                                                setDropValue(suggestion)
                                                setShowDropDown(false)
                                            }}>{suggestion}</h4>
                                    )}
                                </div> : ''}
                        </div>
                        :
                        <input
                            className='inputfield-field'
                            autoComplete={autoComplete}
                            onChange={handleChange}
                            placeholder={placeholder || ''}
                            type={type || 'text'}
                            style={{
                                ...style,
                                fontSize: fontSize ? `${fontSize}vw` : '.9vw',
                                padding: fontSize ? `${fontSize / 2}vw` : '.5vw'
                            }}
                            value={value}
                        />

            }
        </div>
    )
}
