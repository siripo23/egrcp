import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import procurementReducer from './slices/procurementSlice'
import vendorReducer from './slices/vendorSlice'
import riskReducer from './slices/riskSlice'
import complianceReducer from './slices/complianceSlice'
import auditReducer from './slices/auditSlice'
import reportReducer from './slices/reportSlice'
import notificationReducer from './slices/notificationSlice'
import uiReducer from './slices/uiSlice'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'],
}

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['themeMode', 'sidebarOpen'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  dashboard: dashboardReducer,
  procurement: procurementReducer,
  vendor: vendorReducer,
  risk: riskReducer,
  compliance: complianceReducer,
  audit: auditReducer,
  report: reportReducer,
  notification: notificationReducer,
  ui: persistReducer(uiPersistConfig, uiReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)
export default store
