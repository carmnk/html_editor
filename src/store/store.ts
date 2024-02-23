import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
// import { dataStore } from './reducers/dataReducer'
// import { UserStoreType } from './reducers/userStore'
// import counterReducer from '../features/counter/counterSlice'
// import { userStore } from './reducers/userStore'
import { entityModelReducer } from './reducers/entityModelReducer'
import { userStore } from './reducers/userStore'

export const store = configureStore({
  reducer: {
    entityModelReducer: entityModelReducer.reducer,
    userReducer: userStore.reducer,
    // dataReducer: dataStore.reducer,
  },
})

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
