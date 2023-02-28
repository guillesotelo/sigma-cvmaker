import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    getAllImages,
    removeImage,
    saveImage,
    updateImage,
    getCompanyLogo,
    getPublicLogo,
    getImageByEmailAndType,
    getAllCompanyLogos,
    getPublicImageByType
} from "../services/image";

const initialState = {
    images: null,
}

export const getImages = createAsyncThunk('GET_ALL_IMAGES', getAllImages)
export const getImageByType = createAsyncThunk('GET_IMAGE_BY_TYPE', getImageByEmailAndType)
export const getPublicImage = createAsyncThunk('GET_PUBLIC_IMAGE_BY_TYPE', getPublicImageByType)
export const getClientLogo = createAsyncThunk('GET_CLIENT_LOGO', getCompanyLogo)
export const getPublicClientLogo = createAsyncThunk('GET_PUBLIC_CLIENT_LOGO', getPublicLogo)
export const getAllClientLogos = createAsyncThunk('GET_ALL_CLIENT_LOGOS', getAllCompanyLogos)
export const createImage = createAsyncThunk('SAVE_IMAGE', saveImage)
export const updateImageData = createAsyncThunk('UPDATE_IMAGE', updateImage)
export const deleteImage = createAsyncThunk('REMOVE_IMAGE', removeImage)

const imageReducer = createReducer(initialState, {
    [getImages.fulfilled]: (state, action) => { return { ...state, images: action.payload } },
    [createImage.fulfilled]: (state, action) => { return { ...state, created: action.payload } },
    [updateImageData.fulfilled]: (state, action) => { return { ...state, updated: action.payload } },
    [getImageByType.fulfilled]: (state, action) => { return { ...state, image: action.payload } },
    [getPublicImage.fulfilled]: (state, action) => { return { ...state, publicImage: action.payload } },
    [getPublicClientLogo.fulfilled]: (state, action) => { return { ...state, publicLogo: action.payload } },
    [getClientLogo.fulfilled]: (state, action) => { return { ...state, clientLogo: action.payload } },
    [getAllClientLogos.fulfilled]: (state, action) => { return { ...state, allClientLogos: action.payload } },
    [deleteImage.fulfilled]: (state, action) => { return { ...state, deleted: action.payload } }
});

export default imageReducer;