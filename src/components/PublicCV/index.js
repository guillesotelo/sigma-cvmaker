import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ReactPDF, {
    PDFViewer,
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
    pdf
} from '@react-pdf/renderer'
import RobotoRegular from '../../assets/fonts/Roboto-Regular.ttf'
import RobotoBold from '../../assets/fonts/Roboto-Bold.ttf'
import RobotoItalic from '../../assets/fonts/Roboto-Italic.ttf'
import GreatVibes from '../../assets/fonts/GreatVibes-Regular.ttf'
import { applyFiltersToImage } from '../../helpers/image'
import { getPublicCV, getPublicCVLogo } from '../../store/reducers/resume'
import { saveAs } from 'file-saver'
import DownloadIcon from '../../icons/download-icon.svg'
import { MoonLoader } from 'react-spinners'
import { getPublicImage, getPublicClientLogo } from '../../store/reducers/image'
import { saveLog, savePublicLog } from '../../store/reducers/log'
import SigmaIso from '../../assets/logos/sigma_connectivity_iso.png'
import Tooltip from '../Tooltip'

export default function PublicCV() {
    const [res, setRes] = useState({})
    const [profileImage, setProfileImage] = useState({})
    const [cvLogo, setcvLogo] = useState({})
    const [profileStyle, setProfileStyle] = useState({})
    const [signatureCanvas, setSignatureCanvas] = useState({})
    const [clientLogos, setClientLogos] = useState({})
    const [skills, setSkills] = useState([])
    const [fontSize, setFontSize] = useState({})
    const [padding, setPadding] = useState({})
    const [download, setDownload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cvExpired, setCVExpired] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const fullName = `${res.name || ''}${res.middlename ? ` ${res.middlename} ` : ' '}${res.surname || ''}`

    useEffect(() => {
        const id = new URLSearchParams(document.location.search).get('id')

        if (!id) return setCVExpired(true)

        getFonts()
        getResumeData(id)
        getCVLogo()
    }, [])

    useEffect(() => {
        if (Object.keys(res).length) {
            if (download) {
                setLoading(true)
                setDownload(false)
                setTimeout(() => {
                    onDownload()
                }, 1000)
            }
        }
    }, [res])

    useEffect(() => {
        if (res.settings) {
            setFontSize(res.settings.fontSize || {})
            setPadding(res.settings.padding || {})
        }
    }, [res.settings])

    useEffect(() => {
        if (res.skills && Array.isArray(res.skills)) {
            const filtered = res.skills.filter(skill => skill.name && !skill.hidden)
            setSkills(filtered)
        }
    }, [res.skills])

    const calculateExpiration = cv => {
        let expired = true
        if (cv.published && cv.publicTime) {
            const now = new Date().getTime()
            const published = new Date(cv.published).getTime()
            const publicDays = cv.publicTime
            if (now - published < publicDays * 8.64E7) expired = false
        }
        return expired
    }

    const noCVMessage = () => {
        return (
            <div style={{
                textAlign: 'center',
                fontWeight: 'normal',
                height: '100vh',
                marginTop: '25vh',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <img src={SigmaIso} alt='Sigma Logo' style={{ height: '4vw', margin: '2vw' }} />
                <h2>The CV you are trying to access no longer exists or the link has expired.
                    <br />Ask the HR Manager for access permissions.</h2>
                <h5 style={{
                    position: 'absolute',
                    bottom: 0,
                    marginBottom: '2VW',
                    alignSelf: 'center',
                    fontWeight: 'normal'
                }}>Sigma © 2023</h5>
            </div>
        )
    }
    const onDownloadPDF = async () => {
        try {
            await dispatch(savePublicLog({
                email: 'External',
                username: 'External',
                details: `Public CV exported: ${res.username} - ${res.type}`,
                module: 'CV',
                itemId: res._id || null
            })).then(data => data.payload)
        } catch (err) {
            console.error(err)
        }
    }


    const getResumeById = async id => {
        const cvData = await dispatch(getPublicCV(id)).then(data => data.payload)
        return cvData || {}
    }

    const getImage = index => {
        if (Object.keys(clientLogos).length) return clientLogos[index]
        return {}
    }

    const getResumeData = async id => {
        try {
            setLoading(true)
            const cv = await getResumeById(id)

            if (cv && cv.published) {
                if (calculateExpiration(cv)) {
                    setCVExpired(true)
                    return setLoading(false)
                }
            }

            const parsedData = JSON.parse(cv?.data || '{}') || {}
            const cvData = { ...cv, ...parsedData }

            setRes(cvData)
            const clients = parsedData.experience.map(exp => { if (exp.company) return exp.company })
            const _logos = clients.length ? await Promise.all(clients.map(async client => {
                const image = await dispatch(getPublicClientLogo(client)).then(data => data.payload)
                if (image && image.data) {
                    return {
                        ...image,
                        image: image.data,
                        style: image.style ? JSON.parse(image.style) : {}
                    }
                }
            })) : []

            let logos = {}
            if (_logos.length) {
                _logos.forEach((logo, i) => {
                    logos[i] = logo
                })
            }

            const profilePic = await dispatch(getPublicImage({ email: cvData.email, type: 'Profile' })).then(data => data.payload)
            const signature = await dispatch(getPublicImage({ email: cvData.email, type: 'Signature' })).then(data => data.payload)

            if (profilePic) {
                const imageStyles = profilePic.style ? JSON.parse(profilePic.style) : {}
                if (imageStyles) setProfileStyle(imageStyles)
                if (imageStyles.filter) setProfileImage(await applyFiltersToImage(profilePic.data, imageStyles.filter))
                else setProfileImage(profilePic.data)
            }
            if (signature) {
                const signatureStyles = signature.style ? JSON.parse(signature.style) : {}
                if (signatureStyles.filter) setSignatureCanvas(await applyFiltersToImage(signature.data, signatureStyles.filter))
                else setSignatureCanvas(signature.data)
            }
            if (logos) setClientLogos(logos)

            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const getCVLogo = async () => {
        try {
            const logo = await dispatch(getPublicCVLogo({ type: 'CV Logo' })).then(data => data.payload)
            if (logo) setcvLogo(logo.data)
            else setcvLogo({})
        } catch (err) { console.error(err) }
    }

    const calculateTime = currentTime => {
        if (currentTime && res.date) {
            const years = Number(currentTime.split(' ')[0])
            const now = new Date()
            const cvDate = new Date(res.updatedAt)
            const diff = now.getFullYear() - cvDate.getFullYear()
            return diff ? `${years + diff} Years` : currentTime
        }
        return '-'
    }

    const isAllHidden = arr => {
        let allHidden = true
        arr.forEach(item => {
            if ((item.name || item.value) && !item.hidden) allHidden = false
        })
        return allHidden
    }

    const onDownload = async () => {
        await downloadPDF()
        setLoading(false)
    }

    const checkHidden = item => {
        const { hiddenItems } = res.hiddenSections
        return (hiddenItems && hiddenItems.includes(item)) || res.hiddenSections[item]
    }

    const checkHiddenPost = (index, item) => {
        const { postSection } = res.hiddenSections
        if (index && item) return postSection[index] && postSection[index].includes(item)
        else if (index) return postSection && postSection.sections && postSection.sections[index]
    }

    const downloadPDF = async () => {
        const asPdf = pdf()
        asPdf.updateContainer(<ResumePDF />)
        const blob = await asPdf.toBlob()
        saveAs(blob, `${fullName} - ${res.role}.pdf`)
        onDownloadPDF()
    }

    const PDFView = () => {
        return (
            <PDFViewer style={styles.PDFContainer} showToolbar={false}>
                <ResumePDF />
            </PDFViewer >
        )
    }

    const getFonts = () => {
        Font.register({
            family: 'Roboto',
            fonts: [
                {
                    src: RobotoRegular,
                    fontWeight: 'normal'
                },
                {
                    src: RobotoBold,
                    fontWeight: 'bold',
                },
                {
                    src: RobotoItalic,
                    fontStyle: 'italic'
                }
            ]
        })

        Font.register({
            family: 'GreatVibes-Regular',
            src: GreatVibes
        })
    }

    const styles = StyleSheet.create({
        PDFContainer: {
            width: '100%',
            height: '100vh',
            fontFamily: 'Roboto'
        },
        page: {
            flexDirection: 'column',
            position: 'relative',
            paddingBottom: '8vw',
            width: '100%',
            height: '100%'
        },
        headerContainer: {
            flexDirection: 'row',
            padding: '2vw 0',
            alignSelf: 'center',
            width: '90%',
            borderTop: '1px solid gray',
            justifyContent: 'space-between'
        },
        rowContainer: {
            flexDirection: 'row',
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
        profilePicCover: {
            width: 130,
            height: 130,
            margin: '0 0 1.5vw 0',
            alignSelf: 'center',
            borderRadius: '50%',
            overflow: 'hidden'
        },
        profilePic: {
            height: '100%',
            width: '100%',
            transform: profileStyle.transform,
            objectFit: 'cover'
        },
        signatureCanvas: {
            width: 75,
            height: 39,
            margin: '3vw 0 0 3vw'
        },
        logo: {
            maxWidth: 200,
            maxHeight: 100
        },
        name: {
            fontFamily: 'Roboto',
            fontSize: '4vw',
            textAlign: 'right',
            letterSpacing: '1vw'
        },
        role: {
            fontFamily: 'Roboto',
            fontSize: '2.5vw',
            textAlign: 'right',
            color: 'gray',
            letterSpacing: '0.5vw',
            marginTop: '1vw'
        },
        infoView1: {
            textAlign: 'left'
        },
        infoView2: {
            margin: '0 0 0 9vw',
            textAlign: 'left'
        },
        infoView3: {
            textAlign: 'left'
        },
        infoItem: {
            fontSize: fontSize.personalInfo || fontSize.personalInfo === 0 ? `${fontSize.personalInfo + fontSize.personalInfo * 0.7}vw` : '1.7vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'center'
        },
        infoText: {
            fontFamily: 'Roboto',
            fontSize: fontSize.personalInfo || fontSize.personalInfo === 0 ? `${fontSize.personalInfo + fontSize.personalInfo * 0.7}vw` : '1.7vw',
            alignSelf: 'center'
        },
        regularText: {
            fontFamily: 'Roboto',
            fontSize: '1.7vw',
            alignSelf: 'center'
        },
        presentation: {
            fontFamily: 'Roboto',
            fontSize: fontSize.personalInfo || fontSize.personalInfo === 0 ? `${fontSize.personalInfo + fontSize.personalInfo * 0.7}vw` : '1.7vw',
            alignSelf: 'center',
            textAlign: 'justify',
            margin: '0 0 0 2vw'
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
            alignSelf: 'flex-start'
        },
        signature: {
            fontFamily: 'GreatVibes-Regular',
            fontWeight: 'normal',
            fontSize: '3vw',
            alignSelf: 'flex-start',
            margin: '2.5vw 0 0.3vw 0'
        },
        sectionTitle: {
            fontSize: '1.8vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            letterSpacing: '0.6vw',
            width: '25%'
        },
        sectionTitle2: {
            fontSize: '1.8vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            letterSpacing: '0.6vw',
            marginRight: '6vw'
        },
        bullet: {
            flexDirection: 'row'
        },
        skillsWrapper: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: '2vw',
            justifyContent: 'flex-start'
        },
        skillItem: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            textAlign: 'left',
            width: '40%'
        },
        skillName: {
            fontSize: '1.6vw',
            margin: 0,
            color: 'black'
        },
        skillOption: {
            fontSize: '1.6vw',
            color: 'gray',
            textAlign: 'right',
            fontFamily: 'Roboto',
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
            alignSelf: 'center',
            width: '90%'
        },
        experienceSection: {
            alignContent: 'flex-start'
        },
        experienceRow: {
            display: 'flex',
            flexDirection: 'row'
        },
        experienceCol1: {
            flexDirection: 'column',
            marginHorizontal: '2vw',
            width: '24%',
            alignItems: 'flex-start'
        },
        experienceCol2: {
            flexDirection: 'column',
            width: '68%',
            marginLeft: '3.5vw',
            alignSelf: 'flex-end'
        },
        experienceTitleRow: {
            flexDirection: 'column',
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
            alignSelf: 'flex-start',
            color: '#3d3d3d'
        },
        experienceRole: {
            fontSize: '1.7vw',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            alignSelf: 'flex-start'
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
            marginTop: '2vw'
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
            padding: '1.5vw 0 2vw 25vw',
            alignSelf: 'center',
            margin: '0 5vw',
            borderTop: '1px solid gray',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        },
        pdfDownload: {
            textDecoration: 'none'
        },
        clientLogo: {
            maxHeight: 40,
            maxWidth: 60,
            objectFit: 'contain',
            margin: '2vw 0'
        }
    })

    const ResumePDF = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={{ ...styles.headerContainer, border: 'none', alignItems: 'center' }} wrap={false} fixed>
                        <View style={styles.column1}>
                            <Image style={styles.logo} src={cvLogo} />
                        </View>
                        <View style={styles.column2}>
                            {checkHidden('Name') ? null : <Text style={styles.name}>{res.name.toUpperCase() || ''}</Text>}
                            {!checkHidden('Middle Name') && res.middlename ? <Text style={styles.name}>{res.middlename.toUpperCase() || ''}</Text> : null}
                            {checkHidden('Surname') ? null : <Text style={styles.name}>{res.surname.toUpperCase() || ''}</Text>}
                            {checkHidden('Role / Title') ? null : <Text style={styles.role}>{res.role ? res.role.toUpperCase() : ''}</Text>}
                        </View>
                    </View>

                    <View style={{ ...styles.rowContainer, padding: padding.personalInfo || padding.personalInfo === 0 ? `${.15 * padding.personalInfo}vw 0` : '3vw 0' }} wrap={false}>
                        <View style={styles.column1}>
                            <View style={styles.profilePicCover}>
                                {checkHidden('profile') ? null : <Image style={styles.profilePic} src={profileImage} />}
                            </View>
                            <View style={{ ...styles.infoView1, padding: padding.personalInfo || padding.personalInfo === 0 ? `${.05 * padding.personalInfo}vw 0` : '1vw 0' }}>
                                {checkHidden('Name') ? null : <Text style={styles.infoItem}>Name</Text>}
                                {checkHidden('Name') ? null : <Text style={styles.infoText}>{fullName || ''}</Text>}
                            </View>
                            <View style={{ ...styles.infoView1, padding: padding.personalInfo || padding.personalInfo === 0 ? `${.05 * padding.personalInfo}vw 0` : '1vw 0' }}>
                                {checkHidden('Gender') || !res.gender ? null : <Text style={styles.infoItem}>Gender</Text>}
                                {checkHidden('Gender') ? null : <Text style={styles.infoText}>{res.gender || ''}</Text>}
                            </View>
                            <View style={{ ...styles.infoView1, padding: padding.personalInfo || padding.personalInfo === 0 ? `${.05 * padding.personalInfo}vw 0` : '1vw 0' }}>
                                {checkHidden('Location') || !res.location ? null : <Text style={styles.infoItem}>Location</Text>}
                                {checkHidden('Location') ? null : <Text style={styles.infoText}>{res.location || ''}</Text>}
                            </View>
                            <View style={{ ...styles.infoView1, padding: padding.personalInfo || padding.personalInfo === 0 ? `${.05 * padding.personalInfo}vw 0` : '1vw 0' }}>
                                {isAllHidden(res.languages) ? null : <Text style={styles.infoItem}>Language</Text>}
                                {res.languages.map((lan, i) => lan.name && !lan.hidden ?
                                    <Text key={i} style={styles.infoText}>{`${lan.name} - ${lan.option}`}</Text> : null)
                                }
                            </View>
                        </View>
                        <View style={styles.column2}>
                            <View style={styles.infoView3}>
                                {checkHidden('Presentation') ? null : <Text style={styles.presentation}>{res.presentation || ''}</Text>}
                            </View>
                            {isAllHidden(res.strengths) ? null : <View style={{ ...styles.infoView2, margin: '0 0 0 4vw' }}>
                                <Text style={{
                                    ...styles.title,
                                    fontSize: fontSize.personalInfo || fontSize.personalInfo === 0 ? `${fontSize.personalInfo + fontSize.personalInfo * 0.7}vw` : '1.7vw',
                                    margin: fontSize.personalInfo || fontSize.personalInfo === 0 ? `${fontSize.personalInfo * 2.5}vw 0 0.3vw 0` : '2.5vw 0 0.3vw 0'
                                }}>Strengths</Text>
                                {res.strengths.map((str, i) => str.value && !str.hidden ? <Text key={i} style={{
                                    ...styles.dropItems,
                                    fontSize: fontSize.personalInfo || fontSize.personalInfo === 0 ? `${fontSize.personalInfo + fontSize.personalInfo * 0.7}vw` : '1.7vw'
                                }}>• {str.value}</Text> : null)}
                            </View>}
                            <View style={{ ...styles.infoView2, margin: 0 }}>
                                {checkHidden('signature') ? null : <Image style={styles.signatureCanvas} src={signatureCanvas} />}
                            </View>
                        </View>
                    </View>

                    {checkHidden('expertise') || (res.expertise[0] && !res.expertise[0].value) ? null :
                        <View style={{ ...styles.rowContainer, padding: padding.expertise || padding.expertise === 0 ? `${.1 * padding.expertise}vw 0` : '2vw 0' }} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>EXPERTISE</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    {res.expertise.map((exp, i) => exp.value && !exp.hidden ?
                                        <Text key={i} style={{
                                            ...styles.dropItems,
                                            margin: i === 0 || i === res.expertise.length - 1 ? '0 2vw' : fontSize.expertise || fontSize.expertise === 0 ? `${fontSize.expertise / 2}vw 2vw` : '.5vw 2vw',
                                            fontSize: fontSize.expertise || fontSize.expertise === 0 ? `${fontSize.expertise + fontSize.expertise * 0.7}vw` : '1.7vw'
                                        }}>• {exp.value}</Text> : null)}
                                </View>
                            </View>
                        </View>}

                    {checkHidden('education') || (res.education[0] && !res.education[0].value) ? null :
                        <View style={{ ...styles.rowContainer, padding: padding.education || padding.education === 0 ? `${.1 * padding.education}vw 0` : '2vw 0' }} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>EDUCATION</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2} wrap={false}>
                                    {res.education.map((ed, i) => ed && !ed.hidden ?
                                        <View key={i} style={{ ...styles.bullet, margin: i === 0 || i === res.education.length - 1 ? '0 2vw' : '.5vw 2vw' }} wrap={false}>
                                            <Text style={{
                                                ...styles.infoItem,
                                                fontSize: fontSize.education || fontSize.education === 0 ? `${fontSize.education + fontSize.education * 0.7}vw` : '1.7vw'
                                            }}>{ed.bullet || ''}</Text>
                                            <Text style={{
                                                ...styles.regularText,
                                                marginLeft: '3vw',
                                                fontSize: fontSize.education || fontSize.education === 0 ? `${fontSize.education + fontSize.education * 0.7}vw` : '1.7vw'
                                            }}>{ed.value || ''}</Text>
                                        </View> : null)}
                                </View>
                            </View>
                        </View>}

                    {checkHidden('certifications') || (res.certifications[0] && !res.certifications[0].value) ? null :
                        <View style={{ ...styles.rowContainer, padding: padding.certifications || padding.certifications === 0 ? `${.1 * padding.certifications}vw 0` : '2vw 0' }} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2} wrap={false}>
                                    {res.certifications.map((cert, i) => cert && !cert.hidden ?
                                        <View key={i} style={{ ...styles.bullet, margin: i === 0 || i === res.certifications.length - 1 ? '0 2vw' : '.5vw 2vw' }} wrap={false}>
                                            <Text style={{
                                                ...styles.infoItem,
                                                fontSize: fontSize.certifications || fontSize.certifications === 0 ? `${fontSize.certifications + fontSize.certifications * 0.7}vw` : '1.7vw'
                                            }}>{cert.bullet || ''}</Text>
                                            <Text style={{
                                                ...styles.regularText,
                                                marginLeft: '3vw',
                                                fontSize: fontSize.certifications || fontSize.certifications === 0 ? `${fontSize.certifications + fontSize.certifications * 0.7}vw` : '1.7vw'
                                            }}>{cert.value || ''}</Text>
                                        </View> : null)}
                                </View>
                            </View>
                        </View>}

                    {checkHidden('skills') || !skills.length ? null :
                        <View style={{ ...styles.rowContainer, padding: padding.skills || padding.skills === 0 ? `${.1 * padding.skills}vw 0` : '2vw 0' }} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>MAIN SKILLS</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2} wrap={false}>
                                    <View style={styles.skillsWrapper}>
                                        {skills.map((skill, i) =>
                                            <View key={i} style={{
                                                ...styles.skillItem,
                                                borderBottom: i < skills.length - 2 && '1px solid gray',
                                                paddingBottom: (fontSize.skills || fontSize.skills === 0) && i < skills.length - 2 ? `${fontSize.skills / 1.4}vw` : i < skills.length - 2 ? '.7vw' : 0,
                                                margin: fontSize.skills || fontSize.skills === 0 ? `0 2vw ${fontSize.skills / 1.4}vw 0` : '0 2vw .7vw 0'
                                            }}>
                                                <Text style={{
                                                    ...styles.skillName,
                                                    fontSize: fontSize.skills || fontSize.skills === 0 ? `${fontSize.skills + fontSize.skills * 0.6}vw` : '1.6vw'
                                                }}>{skill.name || ''}</Text>
                                                <Text style={{
                                                    ...styles.skillOption,
                                                    fontSize: fontSize.skills || fontSize.skills === 0 ? `${fontSize.skills + fontSize.skills * 0.6}vw` : '1.6vw'
                                                }}>{calculateTime(skill.option)}</Text>
                                            </View>)}
                                    </View>
                                </View>
                            </View>
                        </View>}

                    {checkHidden('experience') || !res.experience.length ? null :
                        <View style={{ ...styles.experienceContainer, padding: padding.experience || padding.experience === 0 ? `${.1 * padding.experience}vw 0` : '2vw 0' }}>
                            <View style={styles.experienceSection} wrap>
                                <View style={styles.infoView1}>
                                    {res.experience ? res.experience.map((exp, i) =>
                                        Object.keys(exp).length > 1 && !checkHiddenPost(i, false) ?
                                            i == 0 ?
                                                <View key={i} style={{
                                                    ...styles.experienceRow,
                                                    flexDirection: 'column',
                                                    borderTop: i === 0 ? '1px solid gray' : '1px solid #AAAAAA',
                                                    padding: padding.experience || padding.experience === 0 ? `${.1 * padding.experience}vw 0` : '3vw 0'
                                                }} wrap={false}>
                                                    <Text style={{
                                                        ...
                                                        styles.sectionTitle2,
                                                        marginBottom: '2vw'
                                                    }}>EXPERIENCE</Text>
                                                    <View key={i} style={styles.experienceRow} wrap={false}>
                                                        <View style={styles.experienceCol1}>
                                                            {checkHiddenPost(i, exp.period) ? null :
                                                                <Text style={{
                                                                    ...styles.experiencePeriod,
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw'
                                                                }}>{exp.period || ''}</Text>}
                                                            {getImage(i) && getImage(i).image ? <Image style={styles.clientLogo} src={getImage(i).image} /> : null}
                                                        </View>
                                                        <View style={styles.experienceCol2}>
                                                            {checkHiddenPost(i, exp.company) ? null :
                                                                <Text style={{
                                                                    ...styles.experienceCompany,
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.8}vw` : '1.8vw'
                                                                }}>{exp.company || ''}</Text>}
                                                            {checkHiddenPost(i, exp.role) ? null :
                                                                <Text style={{
                                                                    ...styles.experienceRole,
                                                                    fontWeight: !exp.company && 'bold',
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.7}vw` : '1.7vw'
                                                                }}>{exp.role || ''}</Text>}
                                                            {checkHiddenPost(i, exp.description) ? null :
                                                                <Text style={{
                                                                    ...styles.experienceDescription,
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw',
                                                                    marginTop: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience}vw` : '1vw'
                                                                }}>{exp.description || ''}</Text>}
                                                            <View>
                                                                <Text style={{
                                                                    ...styles.experienceResponsibilities,
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw',
                                                                    marginTop: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience * 2}vw` : '2vw'
                                                                }}>Key responsibilities:</Text>
                                                                {exp.bullets.map((resp, j) => resp.value && !res.hidden ?
                                                                    <Text key={j} style={{
                                                                        ...styles.experienceResponsibility,
                                                                        fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw'
                                                                    }}>• {resp.value}</Text>
                                                                    : null)}
                                                            </View>
                                                            {exp.technologies && Array.isArray(exp.technologies) && exp.technologies[0] ?
                                                                <View>
                                                                    <Text style={{
                                                                        ...styles.experienceResponsibilities,
                                                                        fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw'
                                                                    }}>Tools & Tech:</Text>
                                                                    <View style={styles.experienceTechList}>
                                                                        {exp.technologies.map((tech, j) => tech && !checkHiddenPost(i, tech) ?
                                                                            <Text key={j} style={{
                                                                                ...styles.experienceTech,
                                                                                fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.7}vw` : '1.7vw',
                                                                                margin: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience / 2.5}vw` : '.4vw',
                                                                            }}>{tech}</Text>
                                                                            : null)}
                                                                    </View>
                                                                </View>
                                                                : null}
                                                        </View>
                                                    </View>
                                                </View>
                                                :
                                                <View key={i} style={{
                                                    ...styles.experienceRow,
                                                    // flexDirection: i === 0 ? 'column' : 'row',
                                                    borderTop: i === 0 ? '1px solid gray' : '1px solid #AAAAAA',
                                                    padding: padding.experience || padding.experience === 0 ? `${.1 * padding.experience}vw 0` : '3vw 0'
                                                }} wrap={false}>
                                                    <View style={styles.experienceCol1}>
                                                        {checkHiddenPost(i, exp.period) ? null :
                                                            <Text style={{
                                                                ...styles.experiencePeriod,
                                                                fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw'
                                                            }}>{exp.period || ''}</Text>}
                                                        {getImage(i) && getImage(i).image ? <Image style={styles.clientLogo} src={getImage(i).image} /> : null}
                                                    </View>
                                                    <View style={styles.experienceCol2}>
                                                        {checkHiddenPost(i, exp.company) ? null :
                                                            <Text style={{
                                                                ...styles.experienceCompany,
                                                                fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.8}vw` : '1.8vw'
                                                            }}>{exp.company || ''}</Text>}
                                                        {checkHiddenPost(i, exp.role) ? null :
                                                            <Text style={{
                                                                ...styles.experienceRole,
                                                                fontWeight: !exp.company && 'bold',
                                                                fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.7}vw` : '1.7vw'
                                                            }}>{exp.role || ''}</Text>}
                                                        {checkHiddenPost(i, exp.description) ? null :
                                                            <Text style={{
                                                                ...styles.experienceDescription,
                                                                fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw',
                                                                marginTop: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience}vw` : '1vw'
                                                            }}>{exp.description || ''}</Text>}
                                                        <View>
                                                            <Text style={{
                                                                ...styles.experienceResponsibilities,
                                                                fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw',
                                                                marginTop: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience * 2}vw` : '2vw'
                                                            }}>Key responsibilities:</Text>
                                                            {exp.bullets.map((resp, j) => resp.value && !res.hidden ?
                                                                <Text key={j} style={{
                                                                    ...styles.experienceResponsibility,
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw'
                                                                }}>• {resp.value}</Text>
                                                                : null)}
                                                        </View>
                                                        {exp.technologies && Array.isArray(exp.technologies) && exp.technologies[0] ?
                                                            <View>
                                                                <Text style={{
                                                                    ...styles.experienceResponsibilities,
                                                                    fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.6}vw` : '1.6vw'
                                                                }}>Tools & Tech:</Text>
                                                                <View style={styles.experienceTechList}>
                                                                    {exp.technologies.map((tech, j) => tech && !checkHiddenPost(i, tech) ?
                                                                        <Text key={j} style={{
                                                                            ...styles.experienceTech,
                                                                            fontSize: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience + fontSize.experience * 0.7}vw` : '1.7vw',
                                                                            margin: fontSize.experience || fontSize.experience === 0 ? `${fontSize.experience / 2.5}vw` : '.4vw',
                                                                        }}>{tech}</Text>
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

                    {checkHidden('tools') || !res.otherTools.length || !res.otherTools[0].value ? null :
                        <View style={{ ...styles.rowContainer, padding: padding.tools || padding.tools === 0 ? `${.1 * padding.tools}vw 0` : '2vw 0' }} wrap={false}>
                            <View style={styles.sectionColumn1}>
                                <View style={styles.infoView1}>
                                    <Text style={styles.sectionTitle}>OTHER TOOLS & SOFTWARE</Text>
                                </View>
                            </View>
                            <View style={styles.sectionColumn2}>
                                <View style={styles.infoView2}>
                                    <View style={styles.experienceTechList}>
                                        {res.otherTools.map((str, j) => str.value && !str.hidden ?
                                            <Text key={j} style={{
                                                ...styles.experienceTech,
                                                fontSize: fontSize.tools || fontSize.tools === 0 ? `${fontSize.tools + fontSize.tools * 0.7}vw` : '1.7vw',
                                                margin: fontSize.tools || fontSize.tools === 0 ? `${fontSize.tools / 2.5}vw` : '.4vw'
                                            }}>{str.value}</Text>
                                            : null)}
                                    </View>
                                </View>
                            </View>
                        </View>}

                    <View style={styles.footer} wrap={false} fixed>
                        <View style={styles.footerCol}>
                            <View style={styles.footerRow}>
                                {res.footer_contact ? <Text style={styles.footerItem}>Concact:</Text> : null}
                                <Text style={styles.footerValue}>{res.footer_contact || '-'}</Text>
                            </View>
                            <View style={styles.footerRow}>
                                {res.footer_email ? <Text style={styles.footerItem}>E-mail:</Text> : null}
                                <Text style={styles.footerValue}>{res.footer_email || '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.footerCol}>
                            {res.footer_phone ? <View style={styles.footerRow}>
                                <Text style={styles.footerItem}>Phone:</Text>
                                <Text style={styles.footerValue}>{res.footer_phone || '-'}</Text>
                            </View> : null}
                            {res.footer_location ? <View style={styles.footerRow}>
                                <Text style={styles.footerItem}>Location:</Text>
                                <Text style={styles.footerValue}>{res.footer_location || '-'}</Text>
                            </View> : null}
                        </View>
                    </View>
                </Page>
            </Document>
        )
    }

    return (
        <div className='view-resume-container' style={{ borderRadius: 0, height: '100vh' }}>
            <div className='view-resume-page'>
                {cvExpired ? noCVMessage()
                    : loading ?
                        <div style={{ alignSelf: 'center', display: 'flex', marginTop: '20vw' }}><MoonLoader color='#E59A2F' /></div>
                        : res && res.name ?
                            <>
                                <div className='pdf-header-btns' style={{
                                    position: 'absolute',
                                    right: 0
                                }}>
                                    {onDownloadPDF ?
                                        <>
                                            <Tooltip tooltip='Download PDF'>
                                                <img
                                                    src={DownloadIcon}
                                                    className='pdf-download-svg'
                                                    onClick={downloadPDF}
                                                    style={{ margin: '1vw 3vw', height: '2vw' }}
                                                />
                                            </Tooltip>
                                        </>
                                        : ''}
                                </div>
                                {Object.keys(res).length ? <PDFView /> : ''}
                            </>
                            : ''}
            </div>
        </div>
    )
}

