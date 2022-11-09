import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAllResumes,
  getResumeByEmail,
  getImageById,
  createResume,
  updateResume,
  deleteResume
} from "../services/reduxServices";

const initialState = {
  resume: null,
}

export const getResumes = createAsyncThunk('GET_RESUMES', getAllResumes)
export const getMyResume = createAsyncThunk('GET_MY_RESUME', getResumeByEmail)
export const getProfileImage = createAsyncThunk('GET_PROFILE_IMAGE', getImageById)
export const saveResume = createAsyncThunk('SAVE_RESUME', createResume)
export const editResume = createAsyncThunk('UPDATE_RESUME', updateResume)
export const removeResume = createAsyncThunk('DELETE_RESUME', deleteResume)

const resumeReducer = createReducer(initialState, {
  [getResumes.fulfilled]: (state, action) => { return { ...state, allResumes: action.payload } },
  [getMyResume.fulfilled]: (state, action) => { return { ...state, myResume: action.payload } },
  [getProfileImage.fulfilled]: (state, action) => { return { ...state, profileImage: action.payload } },
  [saveResume.fulfilled]: (state, action) => { return { ...state, saved: action.payload } },
  [editResume.fulfilled]: (state, action) => { return { ...state, edited: action.payload } },
  [removeResume.fulfilled]: (state, action) => { return { ...state, removed: action.payload } }
});

export default resumeReducer;