import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    getReports,
    createReport
} from "../services/reduxServices";

const initialState = {
    report: null,
}

export const getAllReports = createAsyncThunk('GET_REPORTS', getReports)
export const saveReport = createAsyncThunk('SAVE_REPORT', createReport)

const reportReducer = createReducer(initialState, {
    [getAllReports.fulfilled]: (state, action) => { return { ...state, allReports: action.payload } },
    [saveReport.fulfilled]: (state, action) => { return { ...state, saved: action.payload } }
});

export default reportReducer;