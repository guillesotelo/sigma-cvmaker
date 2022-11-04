import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    getAllResumes,
    getResumeByEmail,
    createResume, 
    updateResume,
    deleteResume
} from "../services/reduxServices";

const initialState = {
    resume: null,
}

export const getResumes = createAsyncThunk('GET_RESUMES', getAllResumes)
export const getMyResume = createAsyncThunk('GET_MY_RESUME', getResumeByEmail)
export const saveResume = createAsyncThunk('SAVE_RESUME', createResume)
export const editResume = createAsyncThunk('UPDATE_RESUME', updateResume)
export const removeResume = createAsyncThunk('DELETE_RESUME', deleteResume)

const resumeReducer = createReducer(initialState, {
  [getResumes.fulfilled]: (state, action) => action.payload,
  [getMyResume.fulfilled]: (state, action) => action.payload,
  [saveResume.fulfilled]: (state, action) => action.payload,
  [editResume.fulfilled]: (state, action) => action.payload,
  [removeResume.fulfilled]: (state, action) => action.payload
});

export default resumeReducer;