import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DropPhoto from '../icons/drop-photo.svg'
import DataTable from '../components/DataTable'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import SwitchBTN from '../components/SwitchBTN'
import Slider from '../components/Slider'
import Dropdown from '../components/Dropdown'
import { toast } from 'react-toastify'
import { APP_COLORS } from '../constants/app'
import { getLogo, saveLogo } from '../store/reducers/resume'
import MoonLoader from "react-spinners/MoonLoader"
import ProfileIcon from '../icons/profile-icon.svg'
import { getAppData, getOneAppData, saveAppData, updateAppData } from '../store/reducers/appData'
import { createImage, deleteImage, getImages, updateImageData } from '../store/reducers/image'

export default function Settings() {
  const [tab, setTab] = useState('user')
  const [data, setData] = useState({})
  const [appData, setAppData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [cvLogo, setcvLogo] = useState({})
  const [skills, setSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState(-1)
  const [skillEdit, setSkillEdit] = useState(false)
  const [imageData, setImageData] = useState({})
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(-1)
  const [imageEdit, setImageEdit] = useState(false)
  const [buzzwords, setBuzzwords] = useState([])
  const [selectedBuzzword, setSelectedBuzzword] = useState(-1)
  const [buzzwordEdit, setBuzzwordEdit] = useState(false)
  const [removeModal, setRemoveModal] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [imageTypes, setImageTypes] = useState([])
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [rotate, setRotate] = useState(0)
  const [contrast, setContrast] = useState(100)
  const [brightness, setBrightness] = useState(100)
  const [grayscale, setGrayscale] = useState(0)
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  const { isManager } = useSelector(state => state.user && state.user.userPermissions || {})
  const history = useHistory()
  const dispatch = useDispatch()
  const tabs = [`CV Logo`, `Skills`, `Buzzwords`, `Images`]
  const skillHeaders = [
    {
      name: 'SKILL',
      value: 'name'
    },
    {
      name: 'FIELD',
      value: 'field'
    }
  ]
  const buzzwordHeaders = [
    {
      name: 'SKILL',
      value: 'name'
    },
    {
      name: 'TYPE',
      value: 'type'
    }
  ]
  const imageHeaders = [
    {
      name: 'IMAGE',
      value: 'data'
    },
    {
      name: 'NAME',
      value: 'name'
    },
    {
      name: 'EMAIL',
      value: 'email'
    },
    {
      name: 'TYPE',
      value: 'type'
    }
  ]

  useEffect(() => {
    if (!user || !user.email || !isManager) history.push('home')
    setTab('CV Logo')
  }, [])

  useEffect(() => {
    if (selectedSkill > -1) setData({ ...data, ...skills[selectedSkill] })
    if (selectedBuzzword > -1) setData({ ...data, ...buzzwords[selectedBuzzword] })
  }, [selectedSkill, selectedBuzzword])

  useEffect(() => {
    if (selectedImage > -1 && images[selectedImage]) {
      setData({ ...images[selectedImage] })

      if (images[selectedImage].data) {
        const imageStyle = images[selectedImage].style && JSON.parse(images[selectedImage].style) || {}
        setImageData({
          image: images[selectedImage].data,
          style: imageStyle,
          type: images[selectedImage].type
        })

        setTranslateX(imageStyle.x || 0)
        setTranslateY(imageStyle.y || 0)
        setScale(imageStyle.s || 1)
        setRotate(imageStyle.r || 0)
        setBrightness(imageStyle.brightness >= 0 ? imageStyle.brightness : 100)
        setContrast(imageStyle.contrast >= 0 ? imageStyle.contrast : 100)
        setGrayscale(imageStyle.grayscale || 0)
      }
    }
  }, [selectedImage])

  useEffect(() => {
    if (isEdit) {
      setImageData({
        ...imageData,
        style: {
          ...imageData.style,
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%) rotate(${rotate}deg)`,
          filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`,
          s: scale,
          x: translateX,
          y: translateY,
          r: rotate,
          brightness,
          contrast,
          grayscale
        }
      })
    }
  }, [scale, translateX, translateY, rotate, contrast, brightness, grayscale])

  useEffect(() => {
    if (appData.length) {
      let _skills = []
      let _buzzwords = []
      appData.forEach(data => {
        if (data.type === 'skills') _skills = JSON.parse(data.data) || []
        if (data.type === 'buzzwords') _buzzwords = JSON.parse(data.data) || []
      })
      setSkills(_skills)
      setBuzzwords(_buzzwords)
    }
  }, [appData])

  useEffect(() => {
    if (tab === 'CV Logo' && !cvLogo.cvImage) getCVLogo()
    else if (tab === 'Skills' || tab === 'Buzzwords' && !appData.length) pullAppData()
    if (tab === 'Images') getAllImages()
  }, [tab])

  const getAllImages = async () => {
    const _images = await dispatch(getImages()).then(data => data.payload)
    if (_images && _images.length) {
      setImages(_images)
      setImageTypes(['Profile', 'Client Logo', 'CV Logo', 'Experience Company'])
    }
  }

  const updateData = (key, value) => {
    setIsEdit(true)
    setData({ ...data, [key]: value })
  }

  const getCVLogo = async () => {
    try {
      setLoading(true)
      const logo = await dispatch(getLogo({ type: 'CV Logo' })).then(data => data.payload)
      if (logo) setcvLogo({ cvImage: logo.data })
      else setcvLogo({})
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(err)
    }
  }

  const pullAppData = async () => {
    try {
      setLoading(true)
      const _appData = await dispatch(getAppData({ email: user.email })).then(data => data.payload)
      if (_appData) {
        setAppData(_appData)
      }

      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(err)
    }
  }

  const saveSkills = async updatedSkills => {
    try {
      setLoading(true)
      let saved = null
      const exists = await dispatch(getOneAppData({ type: 'skills' })).then(data => data.payload)
      if (exists) {
        saved = await dispatch(updateAppData({
          ...user,
          type: 'skills',
          data: JSON.stringify(updatedSkills)
        })).then(data => data.payload)
      } else {
        saved = await dispatch(saveAppData({
          ...user,
          type: 'skills',
          data: JSON.stringify(updatedSkills)
        })).then(data => data.payload)
      }

      if (!saved) toast.error('Error saving Skills')
      else toast.success('Skills saved successfully')

      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast.error('Error saving Skills')
      console.error(err)
    }
  }

  const saveBuzzwords = async updatedBuzzwords => {
    try {
      setLoading(true)
      let saved = null
      const exists = await dispatch(getOneAppData({ type: 'skills' })).then(data => data.payload)
      if (exists) {
        saved = await dispatch(updateAppData({
          ...user,
          type: 'buzzwords',
          data: JSON.stringify(updatedBuzzwords)
        })).then(data => data.payload)
      } else {
        saved = await dispatch(saveAppData({
          ...user,
          type: 'buzzwords',
          data: JSON.stringify(updatedBuzzwords)
        })).then(data => data.payload)
      }

      if (!saved) toast.error('Error saving Buzzword')
      else toast.success('Buzzword saved successfully')

      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast.error('Error saving Buzzword')
      console.error(err)
    }
  }

  const saveCVLogo = async () => {
    try {
      setLoading(true)
      const logo = await dispatch(saveLogo({ ...cvLogo, type: 'CV Logo' })).then(data => data.payload)
      if (!logo) toast.error('Error uploading logo')
      else toast.success('Logo updated successfully')
      setLoading(false)
      setIsEdit(false)
    } catch (err) {
      console.error(err)
      toast.error('Error uploading logo')
      setLoading(false)
    }
  }

  const saveSkillData = () => {
    const updatedSkills = skills
    updatedSkills[selectedSkill] = {
      name: data.name,
      field: data.field
    }
    saveSkills(updatedSkills)
    setSelectedSkill(-1)
    if (skillEdit) {
      setSkillEdit(false)
    }
    setData({})
  }

  const saveImageData = async () => {
    try {
      setLoading(true)
      if (!imageData.image) return toast.info('Please add an image')
      let saved = null

      const imgData = {
        ...data,
        data: imageData.image,
        style: JSON.stringify(imageData.style),
        user
      }

      if (isNew) saved = await dispatch(createImage(imgData)).then(data => data.payload)
      else saved = await dispatch(updateImageData(imgData)).then(data => data.payload)

      if (!saved) return toast.error('Error saving image')
      toast.success('Image saved successfully')

      setLoading(false)
      setSelectedImage(-1)
      setImageEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
      await getAllImages()

    } catch (err) {
      console.error(err)
      toast.error('Error saving image')
      setLoading(false)
      setSelectedImage(-1)
      setImageEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
    }
  }

  const saveBuzzwordData = () => {
    const updatedBuzzwords = buzzwords
    updatedBuzzwords[selectedBuzzword] = {
      name: data.name,
      type: data.type
    }
    saveBuzzwords(updatedBuzzwords)
    setSelectedBuzzword(-1)
    if (buzzwordEdit) {
      setBuzzwordEdit(false)
    }
    setData({})
  }

  const removeImage = async () => {
    try {
      setRemoveModal(false)
      setLoading(true)

      const removed = await dispatch(deleteImage({ ...data, user })).then(data => data.payload)
      if (!removed) return toast.error('Error deleting Image, try again later')

      toast.success('Image deleted successfylly')

      setLoading(false)
      setSelectedImage(-1)
      setImageEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
      await getAllImages()

    } catch (err) {
      toast.error('Error deleting Image, try again later')
      console.error(err)
      setLoading(false)
      setSelectedImage(-1)
      setImageEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
    }
  }

  return (
    <div className='settings-container'>
      <div className='settings-tabs'>
        {tabs.map((tabName, i) =>
          <h4
            key={i}
            className={tab === tabName ? 'settings-tab-selected' : 'settings-tab'}
            onClick={() => setTab(tabName)}>
            {tabName}
          </h4>)}
      </div>

      <div className='settings-section'>
        {
          tab === `CV Logo` ?
            loading ? <div style={{ alignSelf: 'center', display: 'flex', marginTop: '1vw' }}><MoonLoader color='#E59A2F' /></div>
              :
              <>
                <div className='settings-logo-input'>
                  {cvLogo.cvImage ?
                    <img
                      src={cvLogo.cvImage}
                      className='settings-cv-logo'
                      onClick={() => document.getElementById('cvImage').click()}
                      loading='lazy'
                    />
                    : <img
                      src={DropPhoto}
                      className='settings-cv-logo-svg'
                      onClick={() => document.getElementById('cvImage').click()}
                    />}
                  <InputField
                    label=''
                    type='file'
                    name='cvImage'
                    filename='cvImage'
                    image={cvLogo}
                    setImage={setcvLogo}
                    setIsEdit={setIsEdit}
                    style={{ color: 'rgb(71, 71, 71)', margin: '1vw' }}
                  />
                </div>
                <div className='settings-cvlogo-btns'>
                  {isEdit ?
                    <CTAButton
                      label='Discard'
                      handleClick={() => {
                        getCVLogo()
                        setIsEdit(false)
                      }}
                      color={APP_COLORS.GRAY}
                      disabled={!isEdit}
                    />
                    : ''}
                  <CTAButton
                    label='Save'
                    handleClick={saveCVLogo}
                    color={APP_COLORS.GREEN}
                    loading={loading}
                    disabled={!isEdit}
                  />
                </div>
              </>
            :
            tab === `Skills` ?
              <>
                <div className='settings-new-skill-btn'>
                  <CTAButton
                    label='New Skill'
                    handleClick={() => {
                      setSelectedSkill(skills.length)
                      setSkillEdit(true)
                    }}
                    color={APP_COLORS.GREEN}
                    disabled={skillEdit}
                  />
                </div>
                <div className='settings-skills-container'>
                  <DataTable
                    title='Skills'
                    subtitle='Here is a list of all skills in the system'
                    maxRows={9}
                    tableData={skills}
                    tableHeaders={skillHeaders}
                    loading={loading}
                    item={selectedSkill}
                    setItem={setSelectedSkill}
                    isEdit={skillEdit}
                    setIsEdit={setSkillEdit}
                  />
                  {skillEdit ?
                    <div className='settings-select-section'>
                      <div className='users-details'>
                        <InputField
                          label='Skill Name'
                          type='text'
                          name='name'
                          placeholder='DevOps'
                          updateData={updateData}
                          style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                          value={data.name || ''}
                        />
                        <InputField
                          label='Field'
                          type='text'
                          name='field'
                          placeholder='Back End'
                          updateData={updateData}
                          style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                          value={data.field || ''}
                        />
                      </div>
                      <div className='settings-skill-btns'>
                        <CTAButton
                          label='Discard'
                          handleClick={() => {
                            setSelectedSkill(-1)
                            setSkillEdit(false)
                            setIsEdit(false)
                            setData({})
                          }}
                          color={APP_COLORS.GRAY}
                        />
                        <CTAButton
                          label='Save'
                          handleClick={saveSkillData}
                          color={APP_COLORS.GREEN}
                          loading={loading}
                          disabled={!isEdit}
                        />
                      </div>
                    </div>
                    :
                    ''
                  }
                </div>
              </>
              :
              tab === `Buzzwords` ?
                <>
                  <div className='settings-new-skill-btn'>
                    <CTAButton
                      label='New Buzzword'
                      handleClick={() => {
                        setSelectedBuzzword(buzzwords.length)
                        setBuzzwordEdit(true)
                      }}
                      color={APP_COLORS.GREEN}
                      disabled={buzzwordEdit}
                    />
                  </div>
                  <div className='settings-skills-container'>
                    <DataTable
                      title='Buzzwords'
                      subtitle='Here is a list of all buzzwords in the system'
                      maxRows={9}
                      tableData={buzzwords}
                      tableHeaders={buzzwordHeaders}
                      loading={loading}
                      item={selectedBuzzword}
                      setItem={setSelectedBuzzword}
                      isEdit={buzzwordEdit}
                      setIsEdit={setBuzzwordEdit}
                    />
                    {buzzwordEdit ?
                      <div className='settings-select-section'>
                        <div className='users-details'>
                          <InputField
                            label='Buzzword Name'
                            type='text'
                            name='name'
                            placeholder='Team Work'
                            updateData={updateData}
                            style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                            value={data.name || ''}
                          />
                          <InputField
                            label='Type'
                            type='text'
                            name='type'
                            placeholder='Soft Skill'
                            updateData={updateData}
                            style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                            value={data.type || ''}
                          />
                        </div>
                        <div className='settings-skill-btns'>
                          <CTAButton
                            label='Discard'
                            handleClick={() => {
                              setSelectedBuzzword(-1)
                              setBuzzwordEdit(false)
                              setIsEdit(false)
                              setData({})
                            }}
                            color={APP_COLORS.GRAY}
                          />
                          <CTAButton
                            label='Save'
                            handleClick={saveBuzzwordData}
                            color={APP_COLORS.GREEN}
                            loading={loading}
                            disabled={!isEdit}
                          />
                        </div>
                      </div>
                      :
                      ''
                    }
                  </div>
                </>
                :
                tab === `Images` ?
                  <>
                    {removeModal ?
                      <div className='remove-modal'>
                        <h4 style={{ textAlign: 'center' }}>Are you sure you want to delete <br />{data.name || data.type || 'this'} image?</h4>
                        <div className='remove-modal-btns'>
                          <CTAButton
                            label='Cancel'
                            handleClick={() => {
                              setRemoveModal(false)
                            }}
                            color={APP_COLORS.GRAY}
                          />
                          <CTAButton
                            label='Confirm'
                            handleClick={removeImage}
                            color={APP_COLORS.RED}
                          />
                        </div>
                      </div> : ''}
                    <div className='settings-new-skill-btn' style={{ filter: removeModal && 'blur(10px)' }}>
                      <CTAButton
                        label='New Image'
                        handleClick={() => {
                          setIsNew(true)
                          setImageData({})
                          setSelectedImage(images.length)
                          setImageEdit(true)
                          setData({})
                        }}
                        color={APP_COLORS.GREEN}
                        disabled={imageEdit}
                      />
                      {selectedImage !== -1 ?
                        <CTAButton
                          label='Delete'
                          handleClick={() => setRemoveModal(true)}
                          color={APP_COLORS.RED}
                        /> : ''}
                    </div>
                    <div className='settings-skills-container' style={{ filter: removeModal && 'blur(10px)' }}>
                      <DataTable
                        title='Images'
                        subtitle='Here is a list of all images in the system'
                        maxRows={9}
                        tableData={images}
                        tableHeaders={imageHeaders}
                        loading={loading}
                        item={selectedImage}
                        setItem={setSelectedImage}
                        isEdit={imageEdit}
                        setIsEdit={setImageEdit}
                      />
                      {imageEdit ?
                        <div className='settings-select-section'>
                          <div className='settings-details'>
                            {imageData.image ?
                              <div className={imageData.type === 'Profile' ? 'profile-image-cover' : ''}>
                                <img
                                  src={imageData.image}
                                  style={imageData.style}
                                  className={imageData.type === 'Profile' ? 'profile-image' : 'settings-image'}
                                  onClick={() => document.getElementById('image').click()}
                                  loading='lazy'
                                />
                              </div>
                              :
                              <img
                                src={DropPhoto}
                                className='profile-image-svg'
                                onClick={() => document.getElementById('image').click()}
                              />}
                            <div className='settings-details-settings'>
                              {imageData.type === 'Profile' ?
                                <div>
                                  <Slider
                                    label='Position X'
                                    sign='%'
                                    value={translateX}
                                    setValue={setTranslateX}
                                    setIsEdit={setIsEdit}
                                    min={-100}
                                    max={100}
                                  />
                                  <Slider
                                    label='Position Y'
                                    sign='%'
                                    value={translateY}
                                    setValue={setTranslateY}
                                    setIsEdit={setIsEdit}
                                    min={-100}
                                    max={100}
                                  />
                                  <Slider
                                    label='Scale'
                                    sign=''
                                    value={scale}
                                    setValue={setScale}
                                    setIsEdit={setIsEdit}
                                    min={0}
                                    max={3}
                                    step={0.01}
                                  />
                                  <Slider
                                    label='Rotate'
                                    sign='°'
                                    value={rotate}
                                    setValue={setRotate}
                                    setIsEdit={setIsEdit}
                                    min={0}
                                    max={360}
                                  />
                                </div> : ''}
                              <Slider
                                label='Contrast'
                                sign='%'
                                value={contrast}
                                setValue={setContrast}
                                setIsEdit={setIsEdit}
                                min={0}
                                max={200}
                              />
                              <Slider
                                label='Brightness'
                                sign='%'
                                value={brightness}
                                setValue={setBrightness}
                                setIsEdit={setIsEdit}
                                min={0}
                                max={200}
                              />
                              <Slider
                                label='Gray Scale'
                                sign='%'
                                value={grayscale}
                                setValue={setGrayscale}
                                setIsEdit={setIsEdit}
                                min={0}
                                max={100}
                              />
                            </div>
                            <InputField
                              label=''
                              type='file'
                              name='image'
                              filename='image'
                              image={imageData}
                              setImage={setImageData}
                              style={{ color: 'rgb(71, 71, 71)' }}
                            />
                            <InputField
                              label='Image name'
                              type='text'
                              name='name'
                              placeholder='Robert Ericsson'
                              updateData={updateData}
                              style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                              value={data.name || ''}
                            />
                            <InputField
                              label='Email'
                              type='text'
                              name='email'
                              placeholder='full.name@sigma.se'
                              updateData={updateData}
                              style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                              value={data.email || ''}
                            />
                            <Dropdown
                              label='Type'
                              name='type'
                              options={imageTypes}
                              value={data.type}
                              updateData={updateData}
                              size='95%'
                            />
                          </div>
                          <div className='settings-skill-btns'>
                            <CTAButton
                              label='Discard'
                              handleClick={() => {
                                setSelectedImage(-1)
                                setImageEdit(false)
                                setIsEdit(false)
                                setData({})
                                setIsNew(false)
                              }}
                              color={APP_COLORS.GRAY}
                            />
                            <CTAButton
                              label='Save'
                              handleClick={saveImageData}
                              color={APP_COLORS.GREEN}
                              loading={loading}
                              disabled={!isEdit}
                            />
                          </div>
                        </div>
                        :
                        ''
                      }
                    </div>
                  </>
                  :
                  ''
        }
      </div>
    </div>
  )
}
