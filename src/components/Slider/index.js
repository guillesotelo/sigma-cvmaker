import React from 'react'
import ReactSlider from "react-slider"
import './styles.css'

export default function Slider(props) {
    const {
        value,
        setValue,
        label,
        setIsEdit,
        min,
        max,
        marks,
        step,
        sign
    } = props

    return (
        <div className='slider-container'>
            {label &&
                <h4 className='slider-label'>{label || ''}</h4>
            }
            <div className='slider-row'>
                <ReactSlider
                    className="customSlider"
                    thumbClassName="customSlider-thumb"
                    trackClassName="customSlider-track"
                    markClassName="customSlider-mark"
                    marks={marks || 0}
                    step={step}
                    min={min || 0}
                    max={max || 100}
                    defaultValue={0}
                    value={value}
                    onChange={(value) => {
                        setValue(value)
                        if(setIsEdit) setIsEdit(true)
                    }}
                    renderMark={(props) => {
                        if (props.key < value) {
                            props.className = "customSlider-mark customSlider-mark-before";
                        } else if (props.key === value) {
                            props.className = "customSlider-mark customSlider-mark-active";
                        }
                        return <span {...props} />
                    }}
                />
                <h4 className='slider-thumb'>{`${value}${sign || ''}`}</h4>
            </div>
        </div>
    )
}