import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAllResumes,
  getResumeByEmail,
  createResume,
  updateResume,
  deleteResume,
  getCVLogo,
  getPublicCVHeaderLogo,
  saveCVLogo,
  getResumeById,
  getPublicCVById,
  publishCV,
  getCVTypeByEmail
} from "../services/resume";

const initialState = {
  resume: null,
}

export const getResumes = createAsyncThunk('GET_RESUMES', getAllResumes)
export const getMyResume = createAsyncThunk('GET_MY_RESUME', getResumeByEmail)
export const getResume = createAsyncThunk('GET_RESUME_BY_ID', getResumeById)
export const getPublicCV = createAsyncThunk('GET_PUBLIC_RESUME_BY_ID', getPublicCVById)
export const makeCVPublic = createAsyncThunk('MAKE_CV_PUBLIC', publishCV)
export const saveResume = createAsyncThunk('SAVE_RESUME', createResume)
export const editResume = createAsyncThunk('UPDATE_RESUME', updateResume)
export const getLogo = createAsyncThunk('GET_LOGO', getCVLogo)
export const getPublicCVLogo = createAsyncThunk('GET_PUBLIC_CV_LOGO', getPublicCVHeaderLogo)
export const saveLogo = createAsyncThunk('SAVE_LOGO', saveCVLogo)
export const removeResume = createAsyncThunk('DELETE_RESUME', deleteResume)
export const getCVByType = createAsyncThunk('GET_MASTER_CV', getCVTypeByEmail)

const resumeReducer = createReducer(initialState, {
  [getResumes.fulfilled]: (state, action) => { return { ...state, allResumes: action.payload } },
  [getMyResume.fulfilled]: (state, action) => { return { ...state, myResume: action.payload } },
  [getResume.fulfilled]: (state, action) => { return { ...state, resume: action.payload } },
  [getPublicCV.fulfilled]: (state, action) => { return { ...state, publicCV: action.payload } },
  [makeCVPublic.fulfilled]: (state, action) => { return { ...state, publishedCV: action.payload } },
  [saveResume.fulfilled]: (state, action) => { return { ...state, saved: action.payload } },
  [getLogo.fulfilled]: (state, action) => { return { ...state, CVLogo: action.payload } },
  [getPublicCVLogo.fulfilled]: (state, action) => { return { ...state, publicCVLogo: action.payload } },
  [saveLogo.fulfilled]: (state, action) => { return { ...state, CVLogo: action.payload } },
  [editResume.fulfilled]: (state, action) => { return { ...state, edited: action.payload } },
  [removeResume.fulfilled]: (state, action) => { return { ...state, removed: action.payload } },
  [getCVByType.fulfilled]: (state, action) => { return { ...state, master: action.payload } }
});

export default resumeReducer;