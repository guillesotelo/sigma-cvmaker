import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    getAllImages,
    removeImage,
    saveImage,
    updateImage
} from "../services/reduxServices";

const initialState = {
    images: null,
}

export const getImages = createAsyncThunk('GET_ALL_IMAGES', getAllImages)
export const createImage = createAsyncThunk('SAVE_IMAGE', saveImage)
export const updateImageData = createAsyncThunk('UPDATE_IMAGE', updateImage)
export const deleteImage = createAsyncThunk('REMOVE_IMAGE', removeImage)

const imageReducer = createReducer(initialState, {
    [getImages.fulfilled]: (state, action) => { return { ...state, images: action.payload } },
    [createImage.fulfilled]: (state, action) => { return { ...state, created: action.payload } },
    [updateImageData.fulfilled]: (state, action) => { return { ...state, updated: action.payload } },
    [deleteImage.fulfilled]: (state, action) => { return { ...state, deleted: action.payload } }
});

export default imageReducer;