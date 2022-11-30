import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    createAppData,
    getAppDataByType,
    getAllAppData,
    updateAppDataItem
} from "../services/reduxServices";

const initialState = {
    appData: null,
}

export const getOneAppData = createAsyncThunk('GET_APP_DATA', getAppDataByType)
export const getAppData = createAsyncThunk('GET_APP_DATA', getAllAppData)
export const saveAppData = createAsyncThunk('SAVE_APP_DATA', createAppData)
export const updateAppData = createAsyncThunk('UPDATE_APP_DATA', updateAppDataItem)

const appDataReducer = createReducer(initialState, {
    [getAppData.fulfilled]: (state, action) => { return { ...state, allAppData: action.payload } },
    [getOneAppData.fulfilled]: (state, action) => { return { ...state, oneAppData: action.payload } },
    [saveAppData.fulfilled]: (state, action) => { return { ...state, saved: action.payload } },
    [updateAppData.fulfilled]: (state, action) => { return { ...state, updated: action.payload } }
});

export default appDataReducer;