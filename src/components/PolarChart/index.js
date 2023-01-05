import React from 'react'
import { PolarArea } from 'react-chartjs-2'
import './styles.css'

export default function PolarChart(props) {

    const {
        title,
        chartData,
        size
    } = props

    const options = {
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            // tooltip: {
            //     callbacks: {
            //         label: tooltipItem => ` ${tooltipItem.label.replace(/%/g, '')} ${tooltipItem.formattedValue}%`
            //     }
            // }
        }
    }

    const isMobile = navigator.userAgentData && navigator.userAgentData.mobile
    const chartHeight = isMobile ? 350 : size ? size : 500

    return (
        <div className='polarchart-container'>
            <h4 className='chart-title'>{title || ''}</h4>
            <PolarArea data={chartData} height={chartHeight} width={chartHeight} options={options}/>
        </div>
    )
}