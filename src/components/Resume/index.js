import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import CTAButton from '../CTAButton'
import InputField from '../InputField'
import { APP_COLORS } from '../../constants/app'
import { createUser } from '../../store/reducers/user'
import SwitchBTN from '../SwitchBTN'
import MoonLoader from "react-spinners/MoonLoader"
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

export default function Resume({ resumeData }) {
    const [data, setData] = useState(resumeData)
    const [loading, setLoading] = useState(false)
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    useEffect(() => {
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!user || !user.email) history.push('/login')
    })

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
        setPageNumber(1)
    }

    const dispatch = useDispatch()
    const history = useHistory()

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            // flexGrow: 1
        }
    })

    return (
        <div className='resume-container'>
            <div className='resume-fill'>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Text>{data.full_name}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>{data.role}</Text>
                        </View>
                    </Page>
                </Document>
            </div>
        </div>
    )
}
