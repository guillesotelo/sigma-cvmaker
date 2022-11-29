import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../../constants/app'
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import './styles.css'

export default function InputField(props) {

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
        setIsEdit
    } = props

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
                const base64 = await convertToBase64(file)
                setImage({ ...image, [filename]: base64 })
                if (setIsEdit) setIsEdit(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='inputfield-container'>
            {label ? <h4 style={{ color: APP_COLORS.GRAY }} className='inputfield-label'>{label || ''}</h4> : ''}
            {type === 'textarea' ?
                <GrammarlyEditorPlugin clientId={process.env.REACT_APP_GRAMMAR_CID} style={{ width: "100%" }}>
                    <textarea
                        className='inputfield-textarea'
                        onChange={handleChange}
                        placeholder={placeholder || ''}
                        cols={cols || 2}
                        rows={rows || 4}
                        style={style || null}
                        value={value}
                    />
                </GrammarlyEditorPlugin>
                :
                type === 'file' ?
                    <input
                        type="file"
                        label="Image"
                        name={filename || 'file'}
                        accept=".jpeg, .png, .jpg"
                        onChange={(e) => uploadFile(e)}
                        style={{ color: 'gray' }}
                    />
                    :
                    <input
                        className='inputfield-field'
                        autoComplete={autoComplete}
                        onChange={handleChange}
                        placeholder={placeholder || ''}
                        type={type || 'text'}
                        style={style || null}
                        value={value}
                    />

            }
        </div>
    )
}
