import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import './styles.css'

export default function PieChart(props) {

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
    const chartHeight = isMobile ? 350 : size ? size : '30vw'

    return (
        <div className='piechart-container'>
            <h4 className='chart-title'>{title || ''}</h4>
            <Doughnut data={chartData} height={chartHeight} width={chartHeight} options={options}/>
        </div>
    )
}