import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getProfileImage } from '../../store/reducers/user'
import ReactPDF, { PDFViewer, Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import SigmaLogo from '../../assets/logos/sigma.png'
import RobotoRegular from '../../assets/fonts/Roboto-Regular.ttf'
import RobotoBold from '../../assets/fonts/Roboto-Bold.ttf'
import GreatVibes from '../../assets/fonts/GreatVibes-Regular.ttf'
import { applyFiltersToImage } from '../../helpers/image'
import './styles.css'
import { getLogo, getResume } from '../../store/reducers/resume'
import { MoonLoader } from 'react-spinners'

export default function Resume({ resumeData }) {
    const [data, setData] = useState(resumeData)
    const [res, setRes] = useState({})
    const [profileImage, setProfileImage] = useState({})
    const [cvLogo, setcvLogo] = useState({})
    const [loading, setLoading] = useState(false)
    const [imageFilter, setImageFilter] = useState('')
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        setLoading(true)
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')) || null
        if (!user || !user.email) history.push('/login')
        getResumeData()
        getCVLogo()
        setLoading(false)
    }, [])

    const getCVById = async id => {
        try {
            const cv = await dispatch(getResume(id)).then(data => data.payload)
            return cv
        } catch (err) { console.error(err) }
    }

    const getResumeData = async () => {
        try {
            const cv = await getCVById(resumeData._id)
            const parsedData = JSON.parse(cv && cv.data || {})
            const profilePic = await dispatch(getProfileImage({ email: resumeData.email })).then(data => data.payload)

            if (profilePic) {
                const { filter } = profilePic.style && JSON.parse(profilePic.style) || {}
                if (filter) setProfileImage(await applyFiltersToImage(profilePic.data, filter))
                else setProfileImage(profilePic.data)
            }

            setRes(parsedData)
        } catch (err) {
            console.error(err)
        }
    }

    const getCVLogo = async () => {
        try {
            const logo = await dispatch(getLogo({ type: 'cv-logo' })).then(data => data.payload)
            if (logo) setcvLogo(logo.data)
            else setcvLogo({})
        } catch (err) { console.error(err) }
    }

    const calculateTime = currentTime => {
        if (currentTime && data.date) {
            const years = Number(currentTime.split(' ')[0])
            const now = new Date()
            const cvDate = new Date(data.date)
            const diff = now.getFullYear() - cvDate.getFullYear()
            return diff ? `${years + diff} Years` : currentTime
        }
        return '-'
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
        setPageNumber(1)
    }


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
            padding: '3vw 0 4vw 0',
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
            height: 130,
            objectFit: 'cover',
            borderRadius: '50%',
            margin: '1vw 0 2vw 0',
            alignSelf: 'center'
        },
        logo: {
            // width: 90,
            maxWidth: 200,
            maxHeight: 100
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
            borderBottom: '1px solid rgb(86, 86, 86)',
            paddingBottom: '.5vw',
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
        experienceContainer: {
            display: 'flex',
            flexDirection: 'column',
            padding: '3vw 0 4vw 0',
            alignSelf: 'center',
            borderTop: '1px solid gray',
            width: '90%'
        },
        experienceRow: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '2vw',
            paddingLeft: '4w',
            paddingBottom: '5w'
        },
        experienceCol1: {
            flexDirection: 'column',
            marginHorizontal: '2vw',
            width: '20%'
        },
        experienceCol2: {
            flexDirection: 'column',
            width: '70%',
            alignSelf: 'flex-end'
        },
        experiencePeriod: {
            fontSize: '1.6vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            color: 'rgb(86, 86, 86)'
        },
        experienceCompany: {
            fontSize: '1.8vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start'
        },
        experienceRole: {
            fontSize: '1.6vw',
            fontFamily: 'Roboto',
            alignSelf: 'flex-start',
            color: 'rgb(99, 99, 99)'
        },
        experienceDescription: {
            fontSize: '1.6vw',
            fontFamily: 'Roboto',
            alignSelf: 'flex-start',
            marginTop: '1vw'
        },
        experienceResponsibilities: {
            fontSize: '1.6vw',
            fontFamily: 'Roboto',
            alignSelf: 'flex-start',
            fontWeight: 'bold',
            margin: '2vw 0 1vw 0'
        },
        experienceResponsibility: {
            fontSize: '1.6vw',
            fontFamily: 'Roboto',
            alignSelf: 'flex-start',
            margin: '0 2vw'
        },
        experienceTech: {
            fontFamily: 'Roboto',
            fontSize: '1.7vw',
            alignSelf: 'left',
            margin: 0
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
        const fullName = `${res.name || ''}${res.middlename ? ` ${res.middlename} ` : ' '}${res.surname || ''}`

        return (
            Object.keys(res).length ?
                <PDFViewer style={styles.PDFContainer}>
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={{ ...styles.rowContainer, border: 'none', alignItems: 'center' }} wrap={false} fixed>
                                <View style={styles.column1}>
                                    <Image style={styles.logo} src={cvLogo} />
                                </View>
                                <View style={styles.column2}>
                                    <Text style={styles.name}>{res.name.toUpperCase()}</Text>
                                    {res.middlename ? <Text style={styles.name}>{res.middlename.toUpperCase()}</Text> : null}
                                    <Text style={styles.name}>{res.surname.toUpperCase() || 'Full Name'}</Text>
                                    <Text style={styles.role}>{res.role.toUpperCase() || 'Role'}</Text>
                                </View>
                            </View>

                            <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.column1}>
                                    <Image style={styles.profilePic} src={profileImage} />
                                    <View style={styles.infoView1}>
                                        <Text style={styles.infoItem}>Name</Text>
                                        <Text style={styles.regularText}>{fullName || ''}</Text>
                                    </View>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.infoItem}>Gender</Text>
                                        <Text style={styles.regularText}>{res.gender || ''}</Text>
                                    </View>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.infoItem}>Location</Text>
                                        <Text style={styles.regularText}>{res.location || ''}</Text>
                                    </View>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.infoItem}>Language</Text>
                                        {res.languages.map((lan, i) => lan ? <Text key={i} style={styles.regularText}>{`${lan.name} - ${lan.option}`}</Text> : null)}
                                    </View>
                                </View>
                                <View style={styles.column2}>
                                    <View style={styles.infoView2}>
                                        <Text style={styles.description}>{res.description || ''}</Text>
                                    </View>
                                    {res.strengths.length ?
                                        <View style={styles.infoView2}>
                                            <Text style={styles.title}>Strengths</Text>
                                            {res.strengths.map((str, i) => str ? <Text key={i} style={styles.dropItems}>• {str}</Text> : null)}
                                        </View>
                                        :
                                        null}
                                    <View style={styles.infoView2}>
                                        <Text style={styles.signature}>{fullName || ''}</Text>
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
                                        {res.expertise.map((exp, i) => exp ? <Text key={i} style={styles.dropItems}>• {exp}</Text> : null)}
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
                                    <View style={styles.infoView2} wrap={false}>
                                        {res.education.map((ed, i) => (
                                            <View key={i} style={styles.bullet} wrap={false}>
                                                <Text style={styles.infoItem}>{ed.bullet || ''}</Text>
                                                <Text style={{ ...styles.regularText, marginLeft: '3vw' }}>{ed.value || ''}</Text>
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
                                    <View style={styles.infoView2} wrap={false}>
                                        {res.certifications.map((cert, i) => (
                                            <View key={i} style={styles.bullet} wrap={false}>
                                                <Text style={styles.infoItem}>{cert.bullet || ''}</Text>
                                                <Text style={{ ...styles.regularText, marginLeft: '3vw' }}>{cert.value || ''}</Text>
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
                                    <View style={styles.infoView2} wrap={false}>
                                        {res.skills.map((skill, i) => (
                                            <View key={i} style={styles.bullet} wrap={false}>
                                                <Text style={styles.skill}>{skill.name || ''}</Text>
                                                <Text style={styles.year}>{calculateTime(skill.option)}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.experienceContainer}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        {res.experience ? res.experience.map((exp, i) =>
                                            exp.company ?
                                                <View key={i} style={{
                                                    ...styles.experienceRow,
                                                    borderTop: i !== 0 ? '1px solid rgb(227, 227, 227)' : 'none',
                                                    paddingTop: i !== 0 ? '2vw' : 0
                                                }} wrap={false}>
                                                    <View style={styles.experienceCol1}>
                                                        <Text style={styles.experiencePeriod}>{exp.period || ''}</Text>
                                                    </View>
                                                    <View style={styles.experienceCol2}>
                                                        <Text style={styles.experienceCompany}>{exp.company || ''}</Text>
                                                        <Text style={styles.experienceRole}>{exp.role || ''}</Text>
                                                        <Text style={styles.experienceDescription}>{exp.description || ''}</Text>
                                                        <View>
                                                            <Text style={styles.experienceResponsibilities}>Key responsibilities:</Text>
                                                            {exp.bullets.map((resp, j) => resp ?
                                                                <Text key={j} style={styles.experienceResponsibility}>• {resp}</Text>
                                                                : null)}
                                                        </View>
                                                        {exp.technologies && Array.isArray(exp.technologies) ?
                                                            <View>
                                                                <Text style={styles.experienceResponsibilities}>Technologies:</Text>
                                                                <Text style={styles.experienceTech}>
                                                                    {exp.technologies.join(', ')}
                                                                </Text>
                                                            </View>
                                                            : null}
                                                    </View>
                                                </View>
                                                : null
                                        ) : null}
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
                                        <Text style={{ ...styles.infoItem, alignSelf: 'flex-start' }}>{res.tools || ''}</Text>
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
                : ''
        )
    }

    return (
        <div className='view-resume-container'>
            <div className='view-resume-page'>
                {loading ?
                    <div style={{ alignSelf: 'center', display: 'flex', marginTop: '5vw' }}><MoonLoader color='#E59A2F' /></div>
                    : res && res.name ?
                        <ResumePDF />
                        : ''}
            </div>
        </div>
    )
}
