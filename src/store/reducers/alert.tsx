import React from 'react'
import { useAppDispatch } from '../hooks'
import { appendAlert, reduceAlert } from './userStore'

export type AlertType = {
  header: string
  content?: string
  isConfirmation?: boolean
  confirmationDisabled?: boolean
  confirmationIcon?: React.ReactNode
  confirmationLabel?: string
  cancelConfirmationIcon?: React.ReactNode
  cancelConfirmationLabel?: string
  // disableCloseOnConfirmation?: boolean
  secondaryActionIcon?: React.ReactNode
  secondaryActionLabel?: string
  placeNonConfirmationButtonOnLeft?: boolean
  nonConfirmationLabel?: string
  // hideConfirmationButton?: boolean
  // loading?: boolean
  subheader?: React.ReactNode
} & Partial<UseAlertParams>

export type UseAlertParams = {
  onClose?: () => void
  onConfirm?: () => void
  onSecondaryAction?: () => void
}

export const useAlert = (params?: UseAlertParams) => {
  const { onClose } = params ?? {}
  // const { alerts } = useAppSelector((state) => state.userReducer.appState)
  const dispatch = useAppDispatch()

  const handleCloseAlert = React.useCallback(() => {
    dispatch(reduceAlert())
    onClose?.()
  }, [onClose, dispatch])

  const showAlert = React.useCallback(
    (alert: AlertType) => {
      const newAlert = {
        ...alert,
        ...params,
        onClose: handleCloseAlert,
      }

      dispatch(appendAlert(newAlert))
    },
    [dispatch, handleCloseAlert, params]
  )
  return showAlert
}
