import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { ProjectsListItemType, ProjectType } from '../../api/projects/Types'
// import { EmployeeType } from '../../api/values/Employee'
// import { RootState, AppThunk } from '../store'
//import { createAsyncThunk } from '@reduxjs/toolkit'

type EmployeeType = any

export interface DataStoreType {
  accounts: {
    accounts: any[]
    accountsCount: number
    filters: { [key: string]: any }
    loading: boolean
    // prospective: null
    allSelected: boolean
  }
  prospectives: {
    selectedProspective: any
    prospects: any[]
    prospectivesCount: number
    loading: boolean
    filters: any
  }
  documents: {
    documents: any[]
    documentsCount: number
    loading: boolean
    filters: any
  }
  intermediaries: {
    intermediaries: any[]
    intermediariesCount: number
    loading: boolean
    filters: any
  }
  projects: {
    projects: any[]
    projectsCount: number
    loading: boolean
    // projectStatus: any
    filters: any
    selectedProject: any | null
    invoicedProjects: any[]
    projectImages: any[]
  }
  cachedData: {
    backOfficeManagers: (EmployeeType & { value: string; label: string })[]
    managers: (EmployeeType & { value: string; label: string })[]
    mainAssetManagers: (EmployeeType & { value: string; label: string })[]
    secondaryAssetManagers: (EmployeeType & { value: string; label: string })[]
    externalManagers: any[]
    volumeIntermediaries: any[]
    employees: (EmployeeType & { value: string; label: string })[]
  }
}

export const initialState: DataStoreType = {
  accounts: {
    accounts: [],
    accountsCount: 0,
    filters: {},
    loading: false,
    // prospective: null
    allSelected: false,
  },
  prospectives: {
    selectedProspective: null,
    prospects: [], // from prospective page
    prospectivesCount: 1,
    loading: true,
    filters: [],
  },
  documents: {
    documents: [],
    documentsCount: 0,
    loading: false,
    filters: [],
  },
  intermediaries: {
    intermediaries: [],
    intermediariesCount: 0,
    loading: false,
    filters: {},
  },
  projects: {
    projects: [],
    projectsCount: 0,
    loading: false,
    filters: [],
    selectedProject: null,
    invoicedProjects: [],
    projectImages: [],
  },
  cachedData: {
    backOfficeManagers: [],
    managers: [],
    mainAssetManagers: [],
    secondaryAssetManagers: [],
    externalManagers: [],
    volumeIntermediaries: [],
    employees: [],
  },
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
//   const response = await fetchCount(amount)
//   // The value we return becomes the `fulfilled` action payload
//   return response.data
// })

export const dataStore = createSlice({
  name: 'data',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // get: (state) => state,
    // update: (state, action: PayloadAction<DataStoreType>) => {
    //   // state.backend = action.payload.backend
    // },
    updateSelectedProject: (state, action: PayloadAction<any | null>) => {
      state.projects.selectedProject = action.payload
    },
    updateInvoicedProjects: (state, action: PayloadAction<any>) => {
      state.projects.invoicedProjects = action.payload
    },
    updateProjectManagers: (state, action: PayloadAction<any[]>) => {
      state.cachedData.managers = action.payload
    },
    updateBackofficeManagers: (state, action: PayloadAction<any[]>) => {
      state.cachedData.backOfficeManagers = action.payload
    },
    updateMainAssetManagers: (state, action: PayloadAction<any[]>) => {
      state.cachedData.mainAssetManagers = action.payload
    },
    updateSecondaryAssetManagers: (state, action: PayloadAction<any[]>) => {
      state.cachedData.secondaryAssetManagers = action.payload
    },
    updateExternalAssetManagers: (state, action: PayloadAction<any[]>) => {
      state.cachedData.externalManagers = action.payload
    },
    updateVolumeIntermediaries: (state, action: PayloadAction<any[]>) => {
      state.cachedData.volumeIntermediaries = action.payload
    },
    updateProjects: (
      state,
      action: PayloadAction<{ projects: any[]; count: number; filters: any }>
    ) => {
      state.projects.projects = action.payload.projects
      state.projects.loading = false
      state.projects.filters = action.payload.filters
      state.projects.projectsCount = action.payload.count
    },
    setProjectsLoading: (state, action: PayloadAction<boolean>) => {
      state.projects.loading = action.payload
    },
    updateAccounts: (state, action: PayloadAction<{ accounts: any[]; count: number; filters: any }>) => {
      state.accounts.accounts = action.payload.accounts
      state.accounts.loading = false
      state.accounts.filters = action.payload.filters
      state.accounts.accountsCount = action.payload.count
    },
    setAccountsLoading: (state, action: PayloadAction<boolean>) => {
      state.accounts.loading = action.payload
    },
    updateIntermediaries: (state, action: PayloadAction<{ intermediaries: any[]; count: number; filters: any }>) => {
      state.intermediaries.intermediaries = action.payload.intermediaries
      state.intermediaries.loading = false
      state.intermediaries.filters = action.payload.filters
      state.intermediaries.intermediariesCount = action.payload.count
    },
    setIntermediariesLoading: (state, action: PayloadAction<boolean>) => {
      state.intermediaries.loading = action.payload
    },
    updateSelectedProspective: (state, action: PayloadAction<any>) => {
      state.prospectives.selectedProspective = action.payload
    },
    updateProspectives: (state, action: PayloadAction<{ prospects: any[]; count: number; filters: any }>) => {
      state.prospectives.prospects = action.payload.prospects
      state.prospectives.loading = false
      state.prospectives.filters = action.payload.filters
      state.prospectives.prospectivesCount = action.payload.count
    },
    setProspectivesLoading: (state, action: PayloadAction<boolean>) => {
      state.prospectives.loading = action.payload
    },
    updateDocuments: (state, action: PayloadAction<{ documents: any[]; count: number; filters: any }>) => {
      state.documents.documents = action.payload.documents
      state.documents.loading = false
      state.documents.filters = action.payload.filters
      state.documents.documentsCount = action.payload.count
    },
    setDocumentsLoading: (state, action: PayloadAction<boolean>) => {
      state.documents.loading = action.payload
    },
    updateEmployees: (state, action: PayloadAction<any[]>) => {
      state.cachedData.employees = action.payload
    },
    updateProjectImages: (state, action: PayloadAction<any[]>) => {
      state.projects.projectImages = action.payload
    },
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
  updateProjectImages,
  updateEmployees,
  updateProjects,
  updateSelectedProject,
  updateInvoicedProjects,
  updateProjectManagers,
  updateBackofficeManagers,
  setProjectsLoading,
  updateMainAssetManagers,
  updateSecondaryAssetManagers,
  updateExternalAssetManagers,
  updateVolumeIntermediaries,
  setIntermediariesLoading,
  updateIntermediaries,
  updateAccounts,
  setAccountsLoading,
  updateSelectedProspective,
  setProspectivesLoading,
  updateProspectives,
  updateDocuments,
  setDocumentsLoading,
} = dataStore.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.user.value

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState())
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount))
//     }
//   }
