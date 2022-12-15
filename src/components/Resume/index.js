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
            position: 'relative',
            paddingBottom: '5vw',
            width: '100%',
            height: '100%'
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
            alignContent: 'flex-start'
        },
        column2: {
            width: '70%',
            display: 'flex'
        },
        sectionColumn1: {
            alignContent: 'flex-start'
        },
        sectionColumn2: {
            width: '80%'
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
            textAlign: 'left'
        },
        infoView2: {
            margin: '1.5vw 0 1vw 4vw',
            textAlign: 'left'
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
        presentation: {
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
            letterSpacing: '0.6vw',
            maxWidth: '25%'
        },
        bullet: {
            flexDirection: 'row',
            margin: '0.5vw 2vw'
        },
        skillsWrapper: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center'
        },
        skillItem: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottom: '1px solid gray',
            textAlign: 'left',
            padding: '1vw 0',
            margin: '0 2vw .4vw 0',
            width: '40%'
        },
        skillName: {
            fontSize: '1.6vw',
            margin: 0,
            color: 'black'
        },
        skillOption: {
            fontWeight: 'normal',
            fontSize: '1.6vw',
            color: 'gray',
            textAlign: 'right',
            fontStyle: 'italic'
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
        experienceTechList: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        experienceTech: {
            fontFamily: 'Roboto',
            fontSize: '1.7vw',
            backgroundColor: 'lightgray',
            padding: '.3vw .7vw',
            borderRadius: '1vw',
            margin: '.4vw'
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

    const checkHidden = item => {
        const { hiddenItems } = res.hiddenSections
        return (hiddenItems && hiddenItems.includes(item)) || res.hiddenSections[item]
    }

    const checkHiddenPost = (index, item) => {
        const { postSection } = res.hiddenSections
        if (index && item) return postSection[index] && postSection[index].includes(item)
        else if (index) return postSection && postSection.sections && postSection.sections[index]
    }

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
                                    {checkHidden('Name') ? null : <Text style={styles.name}>{res.name.toUpperCase()}</Text>}
                                    {!checkHidden('Middle Name') && res.middlename ? <Text style={styles.name}>{res.middlename.toUpperCase()}</Text> : null}
                                    {checkHidden('Surname') ? null : <Text style={styles.name}>{res.surname.toUpperCase() || 'Full Name'}</Text>}
                                    {checkHidden('Role / Title') ? null : <Text style={styles.role}>{res.role.toUpperCase() || 'Role'}</Text>}
                                </View>
                            </View>

                            <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.column1}>
                                    <Image style={styles.profilePic} src={profileImage} />
                                    <View style={styles.infoView1}>
                                        {checkHidden('Name') ? null : <Text style={styles.infoItem}>Name</Text>}
                                        {checkHidden('Name') ? null : <Text style={styles.regularText}>{fullName || ''}</Text>}
                                    </View>
                                    <View style={styles.infoView1}>
                                        {checkHidden('Gender') ? null : <Text style={styles.infoItem}>Gender</Text>}
                                        {checkHidden('Gender') ? null : <Text style={styles.regularText}>{res.gender || ''}</Text>}
                                    </View>
                                    <View style={styles.infoView1}>
                                        {checkHidden('Location') ? null : <Text style={styles.infoItem}>Location</Text>}
                                        {checkHidden('Location') ? null : <Text style={styles.regularText}>{res.location || ''}</Text>}
                                    </View>
                                    <View style={styles.infoView1}>
                                        {checkHidden(res.language) ? null : <Text style={styles.infoItem}>Language</Text>}
                                        {res.languages.map((lan, i) => lan && !lan.hidden ?
                                            <Text key={i} style={styles.regularText}>{`${lan.name} - ${lan.option}`}</Text> : null)
                                        }
                                    </View>
                                </View>
                                <View style={styles.column2}>
                                    <View style={styles.infoView2}>
                                        {checkHidden('Presentation') ? null : <Text style={styles.presentation}>{res.presentation || ''}</Text>}
                                    </View>
                                    {res.strengths.length ?
                                        <View style={styles.infoView2}>
                                            <Text style={styles.title}>Strengths</Text>
                                            {res.strengths.map((str, i) => str.value && !str.hidden ? <Text key={i} style={styles.dropItems}>• {str.value}</Text> : null)}
                                        </View>
                                        :
                                        null}
                                    <View style={styles.infoView2}>
                                        {checkHidden('Name') ? null : <Text style={styles.signature}>{fullName || ''}</Text>}
                                    </View>
                                </View>
                            </View>

                            {checkHidden('expertise') ? null : <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>EXPERTISE</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn2}>
                                    <View style={styles.infoView2}>
                                        {res.expertise.map((exp, i) => exp.value && !exp.hidden ?
                                            <Text key={i} style={styles.dropItems}>• {exp.value}</Text> : null)}
                                    </View>
                                </View>
                            </View>}

                            {checkHidden('education') ? null : <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>EDUCATION</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn2}>
                                    <View style={styles.infoView2} wrap={false}>
                                        {res.education.map((ed, i) => ed && !ed.hidden ?
                                            <View key={i} style={styles.bullet} wrap={false}>
                                                <Text style={styles.infoItem}>{ed.bullet || ''}</Text>
                                                <Text style={{ ...styles.regularText, marginLeft: '3vw' }}>{ed.value || ''}</Text>
                                            </View> : null)}
                                    </View>
                                </View>
                            </View>}

                            {checkHidden('certifications') ? null : <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn2}>
                                    <View style={styles.infoView2} wrap={false}>
                                        {res.certifications.map((cert, i) => cert && !cert.hidden ?
                                            <View key={i} style={styles.bullet} wrap={false}>
                                                <Text style={styles.infoItem}>{cert.bullet || ''}</Text>
                                                <Text style={{ ...styles.regularText, marginLeft: '3vw' }}>{cert.value || ''}</Text>
                                            </View> : null)}
                                    </View>
                                </View>
                            </View>}

                            {checkHidden('skills') ? null : <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>MAIN SKILLS</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn2}>
                                    <View style={styles.infoView2} wrap={false}>
                                        <View style={styles.skillsWrapper}>
                                            {res.skills.map((skill, i) => skill.name && !skill.hidden ?
                                                <View key={i} style={styles.skillItem}>
                                                    <Text style={styles.skillName}>{skill.name || ''}</Text>
                                                    <Text style={styles.skillOption}>{calculateTime(skill.option)}</Text>
                                                </View> : null)}
                                        </View>
                                    </View>
                                </View>
                            </View>}

                            {checkHidden('experience') ? null : <View style={styles.experienceContainer}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn1} wrap>
                                    <View style={styles.infoView1}>
                                        {res.experience ? res.experience.map((exp, i) =>
                                            Object.keys(exp).length > 1 && !checkHiddenPost(i, false) ?
                                                <View key={i} style={{
                                                    ...styles.experienceRow,
                                                    borderTop: i !== 0 ? '1px solid rgb(227, 227, 227)' : 'none',
                                                    paddingTop: i !== 0 ? '2vw' : 0
                                                }} wrap={false}>
                                                    <View style={styles.experienceCol1}>
                                                        {checkHiddenPost(i, exp.period) ? null : <Text style={styles.experiencePeriod}>{exp.period || ''}</Text>}
                                                    </View>
                                                    <View style={styles.experienceCol2}>
                                                        {checkHiddenPost(i, exp.company) ? null : <Text style={styles.experienceCompany}>{exp.company || ''}</Text>}
                                                        {checkHiddenPost(i, exp.role) ? null : <Text style={styles.experienceRole}>{exp.role || ''}</Text>}
                                                        {checkHiddenPost(i, exp.description) ? null : <Text style={styles.experienceDescription}>{exp.description || ''}</Text>}
                                                        <View>
                                                            <Text style={styles.experienceResponsibilities}>Key responsibilities:</Text>
                                                            {exp.bullets.map((resp, j) => resp.value && !res.hidden ?
                                                                <Text key={j} style={styles.experienceResponsibility}>• {resp.value}</Text>
                                                                : null)}
                                                        </View>
                                                        {exp.technologies && Array.isArray(exp.technologies) && exp.technologies[0] ?
                                                            <View>
                                                                <Text style={styles.experienceResponsibilities}>Technologies:</Text>
                                                                <View style={styles.experienceTechList}>
                                                                    {exp.technologies.map((tech, j) => tech && !checkHiddenPost(i, tech) ?
                                                                        <Text key={j} style={styles.experienceTech}>{tech}</Text>
                                                                        : null)}
                                                                </View>
                                                            </View>
                                                            : null}
                                                    </View>
                                                </View>
                                                : null
                                        ) : null}
                                    </View>
                                </View>
                            </View>}

                            {checkHidden('tools') ? null : <View style={styles.rowContainer} wrap={false}>
                                <View style={styles.sectionColumn1}>
                                    <View style={styles.infoView1}>
                                        <Text style={styles.sectionTitle}>OTHER TOOLS & SOFTWARE</Text>
                                    </View>
                                </View>
                                <View style={styles.sectionColumn2}>
                                    <View style={styles.infoView2}>
                                        <View style={styles.experienceTechList}>
                                            {res.otherTools.map((str, j) => str.value && !str.hidden ?
                                                <Text key={j} style={styles.experienceTech}>{str.value}</Text>
                                                : null)}
                                        </View>
                                    </View>
                                </View>
                            </View>}

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
