import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { UserType } from '../../api/values/Employee'
import { AlertType } from './alert'
import { AppThunk } from '../store'
// import { RootState, AppThunk } from '../store'
// import { fetchCount } from './counterAPI'
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserType = any

export interface UserStoreType {
  user: any
  loading: boolean
  success: boolean
  error: string
  theme: {
    name: string
    primary: string
    secondary: string
  }

  appState: {
    projectDrawer: {
      minified: boolean
    }
    firstLocation: string
    toasts: any[]
    alerts: AlertType[]
    tableParameters: {
      selection: any[]
      [key: string]: any
    }
    backendStatus: {
      blocked: boolean
      reason: string
    }
    documentUpload: {
      open: boolean
      type?: string | null
      id?: number | null
    }
    projectStatus: { newStatus: string; currentStatus: string } | null
  }
}

export const dbcTheme = {
  name: 'dbc',
  primary: '#C00021', // #cc003d
  secondary: '#FF002B', // #9b233a
}

export const drBauerTheme = {
  name: 'drb',
  primary: '#407BA7', // #cc003d
  secondary: '#152C5E', // #9b233a
}

export const initialState: UserStoreType = {
  user: {} as any,
  theme: {
    name: 'dbc',
    primary: '#C00021',
    secondary: '#FF002B',
  },

  loading: false,
  success: false,
  error: '',

  appState: {
    projectDrawer: { minified: false },
    firstLocation: '/',
    toasts: [],
    alerts: [],
    tableParameters: {
      projects: null,
      accounts: null,
      subscriptions: null,
      intermediaries: null,
      backoffice: null,
      commissions: null,
      subscriptionHistory: null,
      selection: [],
      searchTerm: '',
    },
    backendStatus: {
      blocked: false,
      reason: '',
    },
    documentUpload: {
      open: false,
      type: '',
      id: 0,
    },
    projectStatus: null,
  },
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAlertsAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
//   const response = await fetchCount(amount)
//   // The value we return becomes the `fulfilled` action payload
//   return response.data
// })

export const userStore = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // get: (state) => state,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    // setError: (state, action: PayloadAction<string>) => {
    //   state.error = action.payload
    // },
    toggleTheme: (state) => {
      state.theme = state.theme.name === 'dbc' ? drBauerTheme : dbcTheme
    },
    updateUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload
    },
    updateFirstLocation: (state, action: PayloadAction<string>) => {
      state.appState.firstLocation = action.payload
    },
    updateProjectDrawerMinified: (state, action: PayloadAction<boolean>) => {
      state.appState.projectDrawer.minified = action.payload
    },
    appendToast: (state, action: PayloadAction<any>) => {
      state.appState.toasts = [...state.appState.toasts, action.payload]
    },
    reduceToast: (state) => {
      state.appState.toasts = state.appState.toasts.slice(1)
    },
    appendAlert: (state, action: PayloadAction<any>) => {
      state.appState.alerts = [...state.appState.alerts, action.payload]
    },
    reduceAlert: (state) => {
      state.appState.alerts = state.appState.alerts.slice(1)
    },
    updateTabeConfig: (
      state,
      action: PayloadAction<{ path: string; newValue: any }>
    ) => {
      const { path, newValue } = action.payload
      state.appState.tableParameters[path] = newValue
    },
    updateTableSearchValue: (
      state,
      action: PayloadAction<{ path: string; newValue: any }>
    ) => {
      const { path, newValue } = action.payload
      state.appState.tableParameters[path] = {
        ...(state.appState.tableParameters[path] ?? {}),
        searchParam: newValue,
      }
    },
    updateSubscriptionTableSearchValue: (
      state,
      action: PayloadAction<{ project_id: number | string; newValue: any }>
    ) => {
      const { project_id, newValue } = action.payload
      state.appState.tableParameters['subscriptions'][project_id] = {
        ...(state.appState.tableParameters['subscriptions'][project_id] ?? {}),
        searchParam: newValue,
      }
    },
    toggleOpenDocumentUpload: (
      state,
      action: PayloadAction<
        { open: boolean; type?: string; id?: number } | undefined
      >
    ) => {
      state.appState.documentUpload = action.payload || {
        open: false,
        type: null,
        id: null,
      }
    },

    updateTheme: (state, action: PayloadAction<any>) => {
      state.theme = action.payload
    },
    updateProjectStatusForwarding: (
      state,
      action: PayloadAction<{
        currentStatus: string
        newStatus: string
      } | null>
    ) => {
      state.appState.projectStatus = action.payload
    },
    updateTableSelection: (state, action: PayloadAction<any>) => {
      state.appState.tableParameters.selection = action.payload
    },
    updateBackendState: (state, action: PayloadAction<any>) => {
      state.appState.backendStatus = action.payload
    },
    // update: (state, action: PayloadAction<UserType>) => {
    //   state.user = action.payload
    // },
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading'
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle'
  //       state.value += action.payload
  //     })
  //     .addCase(incrementAsync.rejected, (state) => {
  //       state.status = 'failed'
  //     })
  // },
})

export const {
  updateFirstLocation,
  updateUser,
  toggleTheme,
  // setError,
  setLoading,
  updateProjectDrawerMinified,
  appendToast,
  reduceToast,
  updateTabeConfig,
  toggleOpenDocumentUpload,
  updateTheme,
  updateProjectStatusForwarding,
  updateTableSelection,
  updateBackendState,
  updateSubscriptionTableSearchValue,
  updateTableSearchValue,
  reduceAlert,
  appendAlert,
} = userStore.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.user.value

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const appendAlert2 =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentAlerts = (getState())?.userReducer?.appState?.alerts
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount))
//     }
//   }
