import { configureStore } from "@reduxjs/toolkit"
import logger from 'redux-logger'
import userReducer from "./reducers/user"
import resumeReducer from "./reducers/resume"
import reportReducer from "./reducers/report"
import appDataReducer from "./reducers/appData"
import imageReducer from "./reducers/image"

const logs = process.env.NODE_ENV === '!development' ? logger : []

const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logs),
    devTools: process.env.NODE_ENV !== 'production',
    reducer: {
        user: userReducer,
        resume: resumeReducer,
        report: reportReducer,
        appData: appDataReducer,
        image: imageReducer
    }
})

export default store