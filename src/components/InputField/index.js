import React, { useState } from 'react'
import { APP_COLORS } from '../../constants/app'
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
        setImage
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
    }

    const uploadFile = async e => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setImage({ ...image, [filename]: base64 })
    };

    return (
        <div className='inputfield-container'>
            {label ? <h4 style={{ color: APP_COLORS.GRAY }} className='inputfield-label'>{label || ''}</h4> : ''}
            {type === 'textarea' ?
                <textarea
                    className='inputfield-textarea'
                    onChange={handleChange}
                    placeholder={placeholder || ''}
                    cols={cols || 2}
                    rows={rows || 4}
                    style={style || null}
                    value={value}
                />
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
