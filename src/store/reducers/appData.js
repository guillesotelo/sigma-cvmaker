import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    createAppData,
    getAppDataByType,
    getAllAppData,
    updateAppDataItem,
    getRemovedItems,
    restoreItemfromTrash,
    permanentlyRemove
} from "../services/appData";

const initialState = {
    appData: null,
}

export const getOneAppData = createAsyncThunk('GET_APP_DATA', getAppDataByType)
export const getAppData = createAsyncThunk('GET_APP_DATA', getAllAppData)
export const saveAppData = createAsyncThunk('SAVE_APP_DATA', createAppData)
export const updateAppData = createAsyncThunk('UPDATE_APP_DATA', updateAppDataItem)
export const getTrashCan = createAsyncThunk('GET_REMOVED_ITEMS', getRemovedItems)
export const restoreItemFromTrash = createAsyncThunk('RESTORE_ITEM', restoreItemfromTrash)
export const deletePermanently = createAsyncThunk('REMOVE_PERMANENTLY', permanentlyRemove)

const appDataReducer = createReducer(initialState, {
    [getAppData.fulfilled]: (state, action) => { return { ...state, allAppData: action.payload } },
    [getOneAppData.fulfilled]: (state, action) => { return { ...state, oneAppData: action.payload } },
    [saveAppData.fulfilled]: (state, action) => { return { ...state, saved: action.payload } },
    [updateAppData.fulfilled]: (state, action) => { return { ...state, updated: action.payload } },
    [getTrashCan.fulfilled]: (state, action) => { return { ...state, trashCan: action.payload } },
    [restoreItemFromTrash.fulfilled]: (state, action) => { return { ...state, itemRestored: action.payload } },
    [deletePermanently.fulfilled]: (state, action) => { return { ...state, itemDestroyed: action.payload } }
});

export default appDataReducer;