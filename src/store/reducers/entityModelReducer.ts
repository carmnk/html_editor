import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ENTITY_DATA_MODEL_TYPE } from 'common/entity_model'
// import { RootState, AppThunk } from '../store'
//import { createAsyncThunk } from '@reduxjs/toolkit'

export interface EntityModelStoreType {
  entityModel: ENTITY_DATA_MODEL_TYPE
  // {
  //   entities: ENTITY_TYPE[]
  //   entity_fields: ENTITY_FIELD_TYPE[]
  //   entity_lists: ENTITY_LIST_TYPE[]
  //   entity_list_fields: ENTITY_LIST_FIELD_TYPE[]
  //   entity_values: ENTITY_VALUES_RESPONSE_TYPE[]
  // }
}

export const initialState: EntityModelStoreType = {
  entityModel: {
    entities: [],
    entity_fields: [],
    entity_lists: [],
    entity_list_fields: [],
    entity_values: [],
    entity_joinings: [],
    structuredEntityJoinings: [[]],
    _entity_types: [],
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

export const entityModelReducer = createSlice({
  name: 'data',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // get: (state) => state,
    // update: (state, action: PayloadAction<DataStoreType>) => {
    //   // state.backend = action.payload.backend
    // },
    updateEntityModel: (
      state,
      action: PayloadAction<EntityModelStoreType['entityModel']>
    ) => {
      state.entityModel = action.payload
    },
    updateStructuredJoiningsModel: (
      state,
      action: PayloadAction<
        EntityModelStoreType['entityModel']['structuredEntityJoinings']
      >
    ) => {
      state.entityModel.structuredEntityJoinings = action.payload
    },
  },
})

export const { updateEntityModel, updateStructuredJoiningsModel } =
  entityModelReducer.actions

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
