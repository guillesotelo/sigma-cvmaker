import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    createLog,
    createPublicLog,
    getAllLogs
} from "../services/log";

const initialState = {
    report: null,
}

export const saveLog = createAsyncThunk('CREATE_LOG', createLog)
export const savePublicLog = createAsyncThunk('CREATE_PUBLIC_LOG', createPublicLog)
export const getLogs = createAsyncThunk('GET_ALL_LOGS', getAllLogs)

const logReducer = createReducer(initialState, {
    [saveLog.fulfilled]: (state, action) => { return { ...state, log: action.payload } },
    [savePublicLog.fulfilled]: (state, action) => { return { ...state, publicLog: action.payload } },
    [getLogs.fulfilled]: (state, action) => { return { ...state, logs: action.payload } }
});

export default logReducer;