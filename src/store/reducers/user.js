import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import {
  loginUser,
  registerUser,
  setUserVoid,
  updateUser,
  getImageByEmail,
  getSignatureByEmail,
  changePass,
  resetPassordByEmail,
  getUserPermissions,
  getAllUsers,
  getManagers,
  removeUser,
  getAllLogs
} from "../services/reduxServices";

const initialState = {
  user: null,
}

export const logIn = createAsyncThunk('LOGIN_USER', loginUser)
export const createUser = createAsyncThunk('CREATE_USER', registerUser)
export const logOut = createAsyncThunk('LOGOUT_USER', setUserVoid)
export const getUsers = createAsyncThunk('GET_ALL_USERS', getAllUsers)
export const getAllManagers = createAsyncThunk('GET_ALL_MANAGERS', getManagers)
export const getLogs = createAsyncThunk('GET_ALL_LOGS', getAllLogs)
export const deleteUser = createAsyncThunk('DELETE_USER', removeUser)
export const getProfileImage = createAsyncThunk('GET_PROFILE_IMAGE', getImageByEmail)
export const getSignature = createAsyncThunk('GET_SIGNATURE', getSignatureByEmail)
export const sendEmailResetPass = createAsyncThunk('SEND_EMAIL_RESET', resetPassordByEmail)
export const changePassword = createAsyncThunk('CHANGE_PASSWORD', changePass)
export const updateUserData = createAsyncThunk('UPDATE_USER', updateUser)
export const getUserPermission = createAsyncThunk('GET_USER_PERMISSIONS', getUserPermissions)

const userReducer = createReducer(initialState, {
  [logIn.fulfilled]: (state, action) => { return { ...state, user: action.payload } },
  [createUser.fulfilled]: (state, action) => { return { ...state, created: action.payload } },
  [getUsers.fulfilled]: (state, action) => { return { ...state, users: action.payload } },
  [getAllManagers.fulfilled]: (state, action) => { return { ...state, managers: action.payload } },
  [deleteUser.fulfilled]: (state, action) => { return { ...state, deleted: action.payload } },
  [getLogs.fulfilled]: (state, action) => { return { ...state, logs: action.payload } },
  [getProfileImage.fulfilled]: (state, action) => { return { ...state, profileImage: action.payload } },
  [getSignature.fulfilled]: (state, action) => { return { ...state, signature: action.payload } },
  [logOut.fulfilled]: (state, action) => { },
  [sendEmailResetPass.fulfilled]: (state, action) => { return { ...state, sentEmailResetPass: action.payload } },
  [changePassword.fulfilled]: (state, action) => { return { ...state, changedPassword: action.payload } },
  [updateUserData.fulfilled]: (state, action) => { return { ...state, user: action.payload } },
  [getUserPermission.fulfilled]: (state, action) => { return { ...state, userPermissions: action.payload } },
});

export default userReducer;