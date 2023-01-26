import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
    getReports,
    createReport,
    updateReportData
} from "../services/report";

const initialState = {
    report: null,
}

export const getAllReports = createAsyncThunk('GET_REPORTS', getReports)
export const saveReport = createAsyncThunk('SAVE_REPORT', createReport)
export const updateReport = createAsyncThunk('UPDATE_REPORT', updateReportData)

const reportReducer = createReducer(initialState, {
    [getAllReports.fulfilled]: (state, action) => { return { ...state, allReports: action.payload } },
    [saveReport.fulfilled]: (state, action) => { return { ...state, saved: action.payload } },
    [updateReport.fulfilled]: (state, action) => { return { ...state, updated: action.payload } }
});

export default reportReducer;