import React from 'react'
import { Bar } from 'react-chartjs-2'
import './styles.css'

export default function BarChart(props) {

    const {
        title,
        chartData,
        position,
        size
    } = props

    const options = {
        maintainAspectRatio: false,
        indexAxis: position || 'x',
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false
                }
            }
        }
    }

    const isMobile = navigator.userAgentData && navigator.userAgentData.mobile

    const barHeight = isMobile ? 350 : size ? size : '30vw'
    const barWidth = isMobile ? window.outerWidth * 0.9 : size ? size * 1.25 : '40vw'

    return (
        <div className='barchart-container' style={{ width: barWidth, height: barHeight }}>
            <h4 className='chart-title'>{title || ''}</h4>
            <Bar data={chartData} height={barHeight} width={barWidth} options={options} />
        </div>
    )
}
