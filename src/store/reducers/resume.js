import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAllResumes,
  getResumeByEmail,
  createResume,
  updateResume,
  deleteResume,
  getCVLogo,
  saveCVLogo,
  getResumeById,
  createLog,
  getCVTypeByEmail
} from "../services/reduxServices";

const initialState = {
  resume: null,
}

export const getResumes = createAsyncThunk('GET_RESUMES', getAllResumes)
export const getMyResume = createAsyncThunk('GET_MY_RESUME', getResumeByEmail)
export const getResume = createAsyncThunk('GET_RESUME_BY_ID', getResumeById)
export const saveResume = createAsyncThunk('SAVE_RESUME', createResume)
export const editResume = createAsyncThunk('UPDATE_RESUME', updateResume)
export const getLogo = createAsyncThunk('GET_LOGO', getCVLogo)
export const saveLogo = createAsyncThunk('SAVE_LOGO', saveCVLogo)
export const removeResume = createAsyncThunk('DELETE_RESUME', deleteResume)
export const saveLog = createAsyncThunk('CREATE_LOG', createLog)
export const getCVByType = createAsyncThunk('GET_MASTER_CV', getCVTypeByEmail)

const resumeReducer = createReducer(initialState, {
  [getResumes.fulfilled]: (state, action) => { return { ...state, allResumes: action.payload } },
  [getMyResume.fulfilled]: (state, action) => { return { ...state, myResume: action.payload } },
  [getResume.fulfilled]: (state, action) => { return { ...state, resume: action.payload } },
  [saveResume.fulfilled]: (state, action) => { return { ...state, saved: action.payload } },
  [getLogo.fulfilled]: (state, action) => { return { ...state, CVLogo: action.payload } },
  [saveLogo.fulfilled]: (state, action) => { return { ...state, CVLogo: action.payload } },
  [editResume.fulfilled]: (state, action) => { return { ...state, edited: action.payload } },
  [removeResume.fulfilled]: (state, action) => { return { ...state, removed: action.payload } },
  [saveLog.fulfilled]: (state, action) => { return { ...state, log: action.payload } },
  [getCVByType.fulfilled]: (state, action) => { return { ...state, master: action.payload } }
});

export default resumeReducer;