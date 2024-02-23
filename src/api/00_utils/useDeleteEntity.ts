export const a = 1
// import React from 'react'
// import { TOASTS } from '../../content/toasts'
// import { useToast } from '../../store/reducers/toast'
// import { API } from '../API'
// import { AlertType, useAlert } from '../../store/reducers/alert'

// export const getValidDeleteUrls = (id: number | string) =>
//   Object.keys(API)
//     .map((key) => (typeof API[key as keyof typeof API] === 'function' ? API[key as keyof typeof API] : null))
//     ?.filter((param) => (typeof param === 'function' ? (param as any)?.(id).type === 'DELETE' : null))
//     .map((param) => (typeof param === 'function' ? (param as any)?.(id).url : null))
//     ?.filter((val) => val)

// // const deleteKeys = [
// //   'deleteUserSelection',
// //   'deleteProject',
// //   'deleteComment',
// //   'deleteTask',
// //   'deleteTaskGroup',
// //   'deleteTaskDocument',
// //   'deleteRequiredDocument',
// //   'deleteTemplate',
// //   'deleteAccount',
// //   'deleteDocument',
// //   'deleteDeveloper',
// //   'deleteAccountFee',
// //   'deleteTransactionsFee',
// // ]

// export type useDeleteEntityParams = {
//   ApiQuery: (typeof API)[keyof typeof API]
//   confirmAlert?: AlertType
// }

// export const useDeleteEntity = (params: useDeleteEntityParams) => {
//   const { ApiQuery, confirmAlert } = params
//   const showToast = useToast()
//   const showAlert = useAlert()

//   const deleteEntity = React.useCallback(
//     async (id: number | string) => {
//       if (!id) return
//       if (typeof ApiQuery !== 'function') return
//       try {
//         const query = (ApiQuery as any)(id)
//         const url = query?.url
//         if (!getValidDeleteUrls(id)?.includes(url)) {
//           console.warn(`Invalid delete url: ${url}`)
//         }
//         const res = await query?.query?.()
//       } catch (e) {
//         showToast(TOASTS.general.genericError)
//         console.error(e)
//       }
//     },
//     [showToast, ApiQuery]
//   )

//   const handleDelete = React.useCallback(
//     async (id: number | string) => {
//       if (!id) return
//       const handleOnConfirm = async () => {
//         deleteEntity(id)
//       }
//       if (confirmAlert) {
//         const newAlert = { ...confirmAlert, onConfirm: handleOnConfirm }
//         showAlert(newAlert)
//       } else handleOnConfirm()
//     },
//     [showAlert, confirmAlert, deleteEntity]
//   )

//   return handleDelete
// }
