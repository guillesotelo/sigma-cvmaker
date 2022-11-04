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
import ReactDOM from 'react-dom';
import ReactPDF, { PDFViewer, Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import SigmaLogo from '../../assets/logos/sigma.png'
import RobotoRegular from '../../assets/fonts/Roboto-Regular.ttf'
import RobotoBold from '../../assets/fonts/Roboto-Bold.ttf'
import GreatVibes from '../../assets/fonts/GreatVibes-Regular.ttf'
import './styles.css'

export default function Resume({ resumeData }) {
    const [data, setData] = useState(resumeData)
    const [res, setRes] = useState({})
    const [loading, setLoading] = useState(false)
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    useEffect(() => {
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!user || !user.email) history.push('/login')

        const parsedData = JSON.parse(data.data)
        setRes(parsedData)
        console.log("parsedData", parsedData)
    }, [])

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
        setPageNumber(1)
    }

    const dispatch = useDispatch()
    const history = useHistory()

    const updateData = (key, value) => {
        setData({ ...data, [key]: value })
    }

    Font.register({
        family: 'Roboto',
        fonts: [
            {
                src: RobotoRegular,
            },
            {
                src: RobotoBold,
                fontWeight: 'bold',
            }
        ]
    })

    Font.register({
        family: 'GreatVibes-Regular',
        fonts: [
            {
                src: GreatVibes
            }
        ]
    })

    const styles = StyleSheet.create({
        PDFContainer: {
            width: '100%',
            height: '100%',
            fontFamily: 'Roboto'
        },
        page: {
            flexDirection: 'column',
            width: '100%',
            height: '100%',
        },
        rowContainer: {
            flexDirection: 'row',
            padding: '3vw 0',
            alignSelf: 'center',
            width: '90%',
            borderTop: '1px solid gray',
            justifyContent: 'space-between'
        },
        column1: {
            width: '30%',
            alignContent: 'flex-start',
            // textAlign: 'center'
        },
        column2: {
            width: '70%',
            display: 'flex'
        },
        sectionColumn1: {
            // width: '20%',
            alignContent: 'flex-start',
            // textAlign: 'center'
        },
        sectionColumn2: {
            width: '80%',
        },
        separator: {
            borderBottom: '1px solid gray',
            width: '84%',
            alignSelf: 'center',
            margin: 0
        },
        profilePic: {
            width: 130,
            borderRadius: '50%',
            margin: '1vw 0 2vw 0',
            alignSelf: 'center'
        },
        logo: {
            width: 120
        },
        name: {
            fontFamily: 'Roboto',
            fontSize: '4.5vw',
            textAlign: 'right',
            letterSpacing: '1vw'
        },
        role: {
            fontFamily: 'Roboto',
            fontSize: '3vw',
            textAlign: 'right',
            color: 'gray',
            letterSpacing: '0.5vw',
            marginTop: '1vw'
        },
        infoView1: {
            margin: '1.5vw 0',
            textAlign: 'left',
        },
        infoView2: {
            margin: '1.5vw 0 1vw 4vw',
            textAlign: 'left',
        },
        infoItem: {
            fontSize: '1.7vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: '0.3vw'
        },
        regularText: {
            fontFamily: 'Roboto',
            fontSize: '1.7vw',
            alignSelf: 'center'
        },
        description: {
            fontFamily: 'Roboto',
            fontSize: '1.7vw',
            alignSelf: 'center',
            textAlign: 'justify'
        },
        title: {
            fontSize: '1.7vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            margin: '2.5vw 0 0.3vw 0'
        },
        dropItems: {
            fontSize: '1.7vw',
            fontFamily: 'Roboto',
            alignSelf: 'flex-start',
            margin: '0.5vw 2vw'
        },
        signature: {
            fontFamily: 'GreatVibes-Regular',
            fontSize: '2.5vw',
            alignSelf: 'flex-start',
            margin: '2.5vw 0 0.3vw 0'
        },
        sectionTitle: {
            fontSize: '1.8vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            letterSpacing: '0.6vw'
        },
        bullet: {
            flexDirection: 'row',
            margin: '0.5vw 2vw'
        },
        skill: {
            width: '45%',
            fontSize: '1.7vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            marginBottom: '0.3vw',
            borderBottom: '1px solid gray',
            paddingBottom: '.7vw',
            marginBottom: '1vw'
        },
        year: {
            width: '11%',
            fontSize: '1.6vw',
            fontFamily: 'Roboto',
            marginBottom: '0.3vw',
            borderBottom: '1px solid gray',
            paddingBottom: '.7vw',
            marginBottom: '1vw'
        },
        footerCol: {
            flexDirection: 'column',
            width: '50%',
            alignSelf: 'flex-end'
        },
        footerRow: {
            flexDirection: 'row',
            margin: '0.2vw 0'
        },
        footerItem: {
            fontSize: '1.5vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold'
        },
        footerValue: {
            fontSize: '1.5vw',
            fontFamily: 'Roboto',
            margin: '0 1vw'
        },
        footer: {
            flexDirection: 'row',
            padding: '2vw 0 2vw 25vw',
            alignSelf: 'center',
            margin: '0 5vw',
            borderTop: '1px solid gray',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        }
    })

    const ResumePDF = () => {
        const fullName = `${res.name || ''} ${res.middlename || ''} ${res.surname || ''}`

        return (
            <PDFViewer style={styles.PDFContainer}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View style={{ ...styles.rowContainer, border: 'none' }} wrap={false} fixed>
                            <View style={styles.column1}>
                                <Image style={styles.logo} src={SigmaLogo} />
                            </View>
                            <View style={styles.column2}>
                                <Text style={styles.name}>{res.name.toUpperCase()}</Text>
                                {res.middlename && <Text style={styles.name}>{res.middlename.toUpperCase()}</Text>}
                                <Text style={styles.name}>{res.surname.toUpperCase()}</Text>
                                <Text style={styles.role}>{res.role.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.column1}>
                                <Image style={styles.profilePic} src={res.profilePic && res.profilePic.profileImage} />
                                <View style={styles.infoView1}>
                                    <Text style={styles.infoItem}>Name</Text>
                                    <Text style={styles.regularText}>{fullName}</Text>
                                </View>
                                <View style={styles.infoView1}>
                                    <Text style={styles.infoItem}>Gender</Text>
                                    <Text style={styles.regularText}>{res.gender}</Text>
                                </View>
                                <View style={styles.infoView1}>
                                    <Text style={styles.infoItem}>Location</Text>
                                    <Text style={styles.regularText}>{res.location}</Text>
                                </View>
                                <View style={styles.infoView1}>
                                    <Text style={styles.infoItem}>Language</Text>
                                    {res.languages.map((lan, i) => <Text key={i} style={styles.regularText}>{`${lan.name} - ${lan.option}`}</Text>)}
                                </View>
                            </View>
                            <View style={styles.column2}>
                                <View style={styles.infoView2}>
                                    <Text style={styles.description}>{res.description}</Text>
                                </View>
                                <View style={styles.infoView2}>
                                    <Text style={styles.title}>Strengths</Text>
                                    {res.strengths.map((str, i) => {
                                        if (str) return <Text key={i} style={styles.dropItems}>• {str}</Text>
                                    }
                                    )}
                                </View>
                                <View style={styles.infoView2}>
                                    <Text style={styles.signature}>{fullName}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>EXPERTISE</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    {res.expertise.map((exp, i) => {
                                        if (exp) return <Text key={i} style={styles.dropItems}>• {exp}</Text>
                                    })}
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>EDUCATION</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    {res.education.map((ed, i) => (
                                        <View key={i} style={styles.bullet}>
                                            <Text style={styles.infoItem}>{ed.bullet}</Text>
                                            <Text key={i} style={{ ...styles.regularText, marginLeft: '3vw' }}>{ed.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    {res.certifications.map((cert, i) => (
                                        <View key={i} style={styles.bullet}>
                                            <Text style={styles.infoItem}>{cert.bullet}</Text>
                                            <Text key={i} style={{ ...styles.regularText, marginLeft: '3vw' }}>{cert.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>MAIN SKILLS</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    {res.skills.map((skill, i) => (
                                        <View key={i} style={styles.bullet}>
                                            <Text style={styles.skill}>{skill.name}</Text>
                                            <Text key={i} style={styles.year}>{skill.option.toLowerCase()}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    {res.experience && res.experience.map((exp, i) => (
                                        <View key={i} style={styles.bullet}>
                                            <Text style={styles.skill}>{exp.period || ''}</Text>
                                            <Text style={styles.skill}>{exp.company || ''}</Text>
                                            <Text style={styles.skill}>{exp.role || ''}</Text>
                                            <Text style={styles.skill}>{exp.description || ''}</Text>
                                            {exp.bullets.map(resp => resp && <Text style={styles.skill}>●{resp}</Text>)}
                                            <Text style={styles.skill}>{exp.technologies || ''}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.rowContainer} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>TOOLS</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    <Text style={{ ...styles.infoItem, alignSelf: 'flex-start' }}>{res.tools}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.footer} wrap={false} fixed>
                            <View style={styles.footerCol}>
                                <View style={styles.footerRow}>
                                    <Text style={styles.footerItem}>Concact:</Text>
                                    <Text style={styles.footerValue}>{res.footer_contact || '-'}</Text>
                                </View>
                                <View style={styles.footerRow}>
                                    <Text style={styles.footerItem}>E-mail:</Text>
                                    <Text style={styles.footerValue}>{res.footer_email || '-'}</Text>
                                </View>
                            </View>
                            <View style={styles.footerCol}>
                                <View style={styles.footerRow}>
                                    <Text style={styles.footerItem}>Phone:</Text>
                                    <Text style={styles.footerValue}>{res.footer_phone || '-'}</Text>
                                </View>
                                <View style={styles.footerRow}>
                                    <Text style={styles.footerItem}>Location:</Text>
                                    <Text style={styles.footerValue}>{res.footer_location || '-'}</Text>
                                </View>
                            </View>
                        </View>

                    </Page>
                </Document>
            </PDFViewer >
        )
    }

    return (
        <div className='view-resume-container'>
            <div className='view-resume-page'>
                {res && res.name && <ResumePDF />}
            </div>
        </div>
    )
}
