import { Box } from '@mui/system'
import React from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../hooks'
import { appendToast, reduceToast } from './userStore'
import { AxiosResponse } from 'axios'
import { Typography } from '@mui/material'

export type PromiseToast<P> = {
  pendingTitle?: React.ReactNode | ((promise: { data: P }) => React.ReactNode)
  pendingText?: React.ReactNode | ((promise: { data: P }) => React.ReactNode)
  successTitle?: React.ReactNode | ((promise: { data: P }) => React.ReactNode)
  successText?: React.ReactNode | ((promise: { data: P }) => React.ReactNode)
  errorTitle?: React.ReactNode | ((promise: { data: P }) => React.ReactNode)
  errorText?: React.ReactNode | ((promise: { data: P }) => React.ReactNode)
  promise: Promise<P>
}
type defautFileResponse = AxiosResponse<File | null>
export const usePromiseToast = <P extends any = defautFileResponse>() => {
  const dispatch = useAppDispatch()
  const showToast = ({
    pendingTitle,
    pendingText,
    successTitle,
    successText,
    errorTitle,
    errorText,
    promise,
  }: PromiseToast<P>) => {
    dispatch(
      appendToast({
        type: 'promise',
        pendingTitle,
        pendingText,
        successTitle,
        successText,
        errorTitle,
        errorText,
        promise,
      })
    )
  }
  return showToast
}

export type ToastType = {
  title: string
  text?: string
  timeout?: number | null
  type: string
}
export const useToast = () => {
  const dispatch = useAppDispatch()
  const showToast = React.useCallback(
    ({ title, text, timeout, type }: ToastType) => {
      console.log('should show toast')
      dispatch(
        appendToast({
          type,
          title,
          text,
          timeout,
        })
      )
    },
    [dispatch]
  )
  return showToast
}

export const ToastMessage = (props: Pick<ToastType, 'title' | 'text'>) => {
  const { title, text } = props
  return (
    <Box>
      <Box>
        <Typography>{title}</Typography>
      </Box>
      {text && (
        <Typography variant="body2" mt={1}>
          {text}
        </Typography>
      )}
    </Box>
  )
}

export const useToastSender: any = () => {
  const { appState } = useAppSelector((state) => state?.userReducer ?? {})
  const toasts = appState?.toasts
  const dispatch = useAppDispatch()
  // const [activeToastsState, setActiveToasts] = React.useState(true)
  const [toggleRender, setToggleRender] = React.useState(true)
  const handleReRender = React.useCallback(() => {
    setToggleRender((current) => !current)
  }, [])
  const activeToasts = React.useRef(0)

  React.useEffect(() => {
    const handleAddActiveToasts = () => {
      if (
        toasts.length &&
        activeToasts.current < 2 &&
        ['success', 'error', 'warning', 'info', 'promise'].includes(
          toasts?.[0]?.type
        ) &&
        typeof toasts?.[0]?.onClose === 'function'
      ) {
        toasts?.[0]?.onClose?.()
      }

      handleReRender()
    }
    const handleReduceActiveToasts = () => {
      if (
        toasts.length &&
        activeToasts.current < 2 &&
        ['success', 'error', 'warning', 'info', 'promise'].includes(
          toasts?.[0]?.type
        ) &&
        typeof toasts?.[0]?.onClose === 'function'
      ) {
        toasts?.[0]?.onClose?.()
      }
      activeToasts.current = activeToasts.current - 1
      handleReRender()
    }

    if (toasts.length && activeToasts.current < 2) {
      if (toasts?.[0]?.type === 'promise') {
        const nextToast = toasts?.[0]
        activeToasts.current = activeToasts.current + 1
        dispatch(reduceToast())
        toast.promise(
          nextToast?.promise,
          {
            pending: {
              render: () => (
                <ToastMessage
                  title={nextToast?.pendingTitle}
                  text={nextToast?.pendingText}
                />
              ),
            },
            success: {
              render: (promise) => {
                const title =
                  typeof nextToast?.successTitle === 'function'
                    ? nextToast?.successTitle?.(promise)
                    : nextToast?.successTitle
                const text =
                  typeof nextToast?.successText === 'function'
                    ? nextToast?.successText?.(promise)
                    : nextToast?.successText
                return <ToastMessage title={title} text={text} />
              },
            },
            error: {
              render: (promise) => {
                const title =
                  typeof nextToast?.errorTitle === 'function'
                    ? nextToast?.errorTitle?.(promise)
                    : nextToast?.errorTitle
                const text =
                  typeof nextToast?.errorText === 'function'
                    ? nextToast?.errorText?.(promise)
                    : nextToast?.errorText
                return <ToastMessage title={title} text={text} />
              },
            },
          },
          {
            bodyClassName: 'custom-toast-body',
            onClose: handleReduceActiveToasts,
            onOpen: handleAddActiveToasts,
          }
        )
      } else if (
        ['success', 'error', 'warning', 'info'].includes(toasts?.[0]?.type)
      ) {
        const nextToast = toasts?.[0]
        activeToasts.current = activeToasts.current + 1

        toast[toasts[0].type as 'success' | 'error' | 'warning' | 'info'](
          <ToastMessage title={nextToast?.title} text={nextToast?.text} />,
          {
            bodyClassName: 'custom-toast-body',
            autoClose: !nextToast?.timeout ? false : nextToast?.timeout,
            onClose: handleReduceActiveToasts,
            onOpen: handleAddActiveToasts,
          }
        )
        dispatch(reduceToast())
      }
    }
  }, [toasts, dispatch, toggleRender])
}
