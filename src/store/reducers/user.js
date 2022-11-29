import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    loginUser, 
    registerUser, 
    setUserVoid, 
    updateUser,
    getImageByEmail,
    changePass,
    resetPassordByEmail,
    getAdminStatus,
    getAllUsers
} from "../services/reduxServices";

const initialState = {
    user: null,
}

export const logIn = createAsyncThunk('LOGIN_USER', loginUser)
export const createUser = createAsyncThunk('CREATE_USER', registerUser)
export const logOut = createAsyncThunk('LOGOUT_USER', setUserVoid)
export const getUsers = createAsyncThunk('GET_ALL_USERS', getAllUsers)
export const getProfileImage = createAsyncThunk('GET_PROFILE_IMAGE', getImageByEmail)
export const sendEmailResetPass = createAsyncThunk('SEND_EMAIL_RESET', resetPassordByEmail)
export const changePassword = createAsyncThunk('CHANGE_PASSWORD', changePass)
export const updateUserData = createAsyncThunk('UPDATE_USER', updateUser)
export const getAdminCredentials = createAsyncThunk('GET_ADMIN_CREDENTIALS', getAdminStatus)

const userReducer = createReducer(initialState, {
  [logIn.fulfilled]: (state, action) => { return { ...state, user: action.payload } },
  [createUser.fulfilled]: (state, action) => { return { ...state, created: action.payload } },
  [getUsers.fulfilled]: (state, action) => { return { ...state, users: action.payload } },
  [getProfileImage.fulfilled]: (state, action) => { return { ...state, profileImage: action.payload } },
  [logOut.fulfilled]: (state, action) => {},
  [sendEmailResetPass.fulfilled]: (state, action) => { return { ...state, sentEmailResetPass: action.payload } },
  [changePassword.fulfilled]: (state, action) => { return { ...state, changedPassword: action.payload } },
  [updateUserData.fulfilled]: (state, action) => { return { ...state, user: action.payload } },
  [getAdminCredentials.fulfilled]: (state, action) => { return { ...state, adminCredentials: action.payload } },
});

export default userReducer;