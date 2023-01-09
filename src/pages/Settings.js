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
import {
  getAppData,
  getOneAppData,
  saveAppData,
  updateAppData,
  getTrashCan,
  deletePermanently,
  restoreItemFromTrash
} from '../store/reducers/appData'
import {
  createImage,
  deleteImage,
  getImages,
  updateImageData
} from '../store/reducers/image'
import {
  skillHeaders,
  buzzwordHeaders,
  imageHeaders,
  userHeaders,
  cvHeaders
} from '../constants/tableHeaders'

export default function Settings() {
  const [tab, setTab] = useState('user')
  const [data, setData] = useState({})
  const [appData, setAppData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [cvLogo, setcvLogo] = useState({})
  const [skills, setSkills] = useState([])
  const [itemEdit, setItemEdit] = useState(false)
  const [removedItems, setRemovedItems] = useState({})
  const [trashHeaders, setTrashHeaders] = useState([])
  const [trash, setTrash] = useState([])
  const [selectedItem, setSelectedItem] = useState(-1)
  const [imageData, setImageData] = useState({})
  const [images, setImages] = useState([])
  const [buzzwords, setBuzzwords] = useState([])
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
  const tabs = [`CV Logo`, `Skills`, `Buzzwords`, `Images`, `Trash`]
  const trashModules = [`CV's`, 'Images', 'Users']

  useEffect(() => {
    if (!user || !user.email || !isManager) history.push('home')
    setTab('CV Logo')
  }, [])

  useEffect(() => {
    if (selectedItem > -1) {
      if (tab === 'Skills') setData({ ...data, ...skills[selectedItem] })
      if (tab === 'Buzzwords') setData({ ...data, ...buzzwords[selectedItem] })
    }
  }, [selectedItem])

  useEffect(() => {
    if (tab === 'Images') {
      if (selectedItem > -1 && images[selectedItem]) {
        setData({ ...images[selectedItem] })

        if (images[selectedItem].data) {
          const imageStyle = images[selectedItem].style && JSON.parse(images[selectedItem].style) || {}
          setImageData({
            image: images[selectedItem].data,
            style: imageStyle,
            type: images[selectedItem].type
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
    }
  }, [selectedItem])

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
    setIsEdit(false)
    if (tab === 'CV Logo' && !cvLogo.cvImage) getCVLogo()
    else if (tab === 'Skills' || tab === 'Buzzwords' && !appData.length) pullAppData()
    if (tab === 'Images') getAllImages()
    if (tab === 'Trash') getRemovedItems()
  }, [tab])

  useEffect(() => {
    if (data.module === `CV's`) {
      setTrashHeaders(cvHeaders)
      setTrash(removedItems.resumes || [])
    }
    else if (data.module === 'Images') {
      setTrashHeaders(imageHeaders)
      setTrash(removedItems.images || [])
    }
    else if (data.module === 'Users') {
      setTrashHeaders(userHeaders)
      setTrash(removedItems.users || [])
    }
    else setTrash([])
  }, [data.module, removedItems])

  const getRemovedItems = async () => {
    try {
      setLoading(true)
      const removed = await dispatch(getTrashCan(user)).then(data => data.payload)
      if (removed) {
        setRemovedItems(removed)
        if (!data.module) setTimeout(() => updateData('module', `CV's`), 200)
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const getAllImages = async () => {
    try {
      setLoading(true)
      const _images = await dispatch(getImages()).then(data => data.payload)
      if (_images && _images.length) {
        const nonRemoved = _images.filter(image => !image.removed)
        setImages(nonRemoved)
        setImageTypes(['Profile', 'Client Logo', 'CV Logo', 'Experience Company'])
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
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
    updatedSkills[selectedItem] = {
      name: data.name,
      field: data.field
    }
    saveSkills(updatedSkills)
    setSelectedItem(-1)
    if (itemEdit) {
      setItemEdit(false)
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
      setSelectedItem(-1)
      setItemEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
      await getAllImages()

    } catch (err) {
      console.error(err)
      toast.error('Error saving image')
      setLoading(false)
      setSelectedItem(-1)
      setItemEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
    }
  }

  const saveBuzzwordData = () => {
    const updatedBuzzwords = buzzwords
    updatedBuzzwords[selectedItem] = {
      name: data.name,
      type: data.type
    }
    saveBuzzwords(updatedBuzzwords)
    setSelectedItem(-1)
    if (itemEdit) {
      setItemEdit(false)
    }
    setData({})
  }

  const removeImage = async () => {
    try {
      setRemoveModal(false)
      setLoading(true)

      const removed = await dispatch(deleteImage({ ...data, user })).then(data => data.payload)
      if (!removed) return toast.error('Error deleting Image, try again later')

      toast.success('Image moved to trash')

      setLoading(false)
      setSelectedItem(-1)
      setItemEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
      await getAllImages()

    } catch (err) {
      toast.error('Error deleting Image, try again later')
      console.error(err)
      setLoading(false)
      setSelectedItem(-1)
      setItemEdit(false)
      setIsEdit(false)
      setData({})
      setIsNew(false)
    }
  }

  const restoreItem = async () => {
    try {
      setLoading(true)
      setRemoveModal(false)

      const restored = await dispatch(restoreItemFromTrash({
        email: user.email,
        _id: trash[selectedItem]._id,
        item: data.module
      })).then(data => data.payload)

      if (!restored) return toast.error('Error restoring item, try again lataer')
      toast.success('Item restored successfully')
      getRemovedItems()
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const removeItem = async () => {
    try {
      setLoading(true)
      setRemoveModal(false)

      const removed = await dispatch(deletePermanently({
        email: user.email,
        _id: trash[selectedItem]._id,
        item: data.module
      })).then(data => data.payload)

      if (!removed) return toast.error('Error removing item, try again lataer')
      toast.success('Item removed successfully')
      getRemovedItems()
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className='settings-container'>
      <div className='settings-tabs' style={{ filter: removeModal && 'blur(10px)' }}>
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
                      setSelectedItem(skills.length)
                      setItemEdit(true)
                    }}
                    color={APP_COLORS.GREEN}
                    disabled={itemEdit}
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
                    item={selectedItem}
                    setItem={setSelectedItem}
                    isEdit={itemEdit}
                    setIsEdit={setItemEdit}
                  />
                  {itemEdit ?
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
                            setSelectedItem(-1)
                            setItemEdit(false)
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
                        setSelectedItem(buzzwords.length)
                        setItemEdit(true)
                      }}
                      color={APP_COLORS.GREEN}
                      disabled={itemEdit}
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
                      item={selectedItem}
                      setItem={setSelectedItem}
                      isEdit={itemEdit}
                      setIsEdit={setItemEdit}
                    />
                    {itemEdit ?
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
                              setSelectedItem(-1)
                              setItemEdit(false)
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
                          setSelectedItem(images.length)
                          setItemEdit(true)
                          setData({})
                        }}
                        color={APP_COLORS.GREEN}
                        disabled={itemEdit}
                      />
                      {selectedItem !== -1 ?
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
                        item={selectedItem}
                        setItem={setSelectedItem}
                        isEdit={itemEdit}
                        setIsEdit={setItemEdit}
                      />
                      {itemEdit ?
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
                            {imageData.type === 'Profile' || imageData.type === 'Signature' || data.email ?
                              <InputField
                                label='Email'
                                type='text'
                                name='email'
                                placeholder='full.name@sigma.se'
                                updateData={updateData}
                                style={{ color: 'rgb(71, 71, 71)', width: '93%' }}
                                value={data.email || ''}
                              /> : ''}
                            <Dropdown
                              label='Type'
                              name='type'
                              options={imageTypes}
                              value={data.type}
                              updateData={updateData}
                              size='15.6vw'
                            />
                          </div>
                          <div className='settings-skill-btns'>
                            <CTAButton
                              label='Discard'
                              handleClick={() => {
                                setSelectedItem(-1)
                                setItemEdit(false)
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
                  : tab === `Trash` ?
                    <>
                      {removeModal ?
                        <div className='remove-modal'>
                          <h4 style={{ textAlign: 'center' }}>Are you sure you want to permanently delete this item?</h4>
                          <div className='remove-modal-btns'>
                            <CTAButton
                              label='Cancel'
                              handleClick={() => {
                                setRemoveModal(false)
                              }}
                              color={APP_COLORS.GRAY}
                            />
                            <CTAButton
                              label='Delete'
                              handleClick={removeItem}
                              color={APP_COLORS.RED}
                            />
                          </div>
                        </div> : ''}
                      <div className='settings-trash-header' style={{ filter: removeModal && 'blur(10px)' }}>
                        <Dropdown
                          placeholder='Select module'
                          name='module'
                          options={trashModules}
                          value={data.module}
                          updateData={updateData}
                          size='10vw'
                        />
                        <div className='settings-trash-btns'>
                          <CTAButton
                            label='Restore'
                            handleClick={restoreItem}
                            color={APP_COLORS.GREEN}
                            disabled={selectedItem === -1}
                          />
                          <CTAButton
                            label='Delete'
                            handleClick={() => setRemoveModal(true)}
                            color={APP_COLORS.RED}
                            disabled={selectedItem === -1}
                          />
                        </div>
                      </div>
                      <div className='settings-skills-container' style={{ filter: removeModal && 'blur(10px)' }}>
                        <DataTable
                          title='Trash'
                          subtitle={`Here is a list of all removed ${data.module ? data.module.toLowerCase() : 'items'} in the system`}
                          maxRows={9}
                          tableData={trash}
                          tableHeaders={trashHeaders}
                          loading={loading}
                          item={selectedItem}
                          setItem={setSelectedItem}
                          isEdit={itemEdit}
                          setIsEdit={setItemEdit}
                        />
                      </div>
                    </>
                    :
                    ''
        }
      </div>
    </div>
  )
}
