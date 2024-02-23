import { AxiosResponse } from 'axios'
import React from 'react'
import { usePromiseToast, useToast } from '../../store/reducers/toast'
import { TOASTS } from '../../content/toasts.js'
import { DownloadParamsKeyType, DownloadParamsCreateParams, DownloadParamsType } from '../DOWNLOADS'
import { getLinkFromDownloadResponse, openDownloadWithLink } from './queryResponseHelperFns'

export type UseDownloadQueryType<P> = (
  payload?: P,
  urlParams?: string,
  postprocessing?: any | undefined
) => Promise<AxiosResponse<File>>

export type UseDownloadType<K extends DownloadParamsKeyType> = {
  // query: UseDownloadQueryType<P>
  // successToast?: ToastType | ((link: HTMLAnchorElement) => ToastType)
  // pendingToast?: ToastType
  // errorStatusToasts?: { [statusCode: number]: ToastType }
  downloadParams: DownloadParamsType[K]
  disableOpenDownload?: boolean
  disablePromiseToast?: boolean
}

export const useDownload = <PayloadType, K extends DownloadParamsKeyType>(
  params: UseDownloadType<K>
): ((
  payload: PayloadType,
  urlParams?: DownloadParamsCreateParams<K>,
  searchParams?: string
) => Promise<AxiosResponse<File> | null>) => {
  const {
    downloadParams,
    // successToast: successToastIn,
    // errorStatusToasts,
    disableOpenDownload,
    disablePromiseToast = true,
    // pendingToast,
  } = params

  const showToast = useToast()
  const showLoadingToast = usePromiseToast()

  const download = React.useCallback(
    async (payload: PayloadType, urlParams?: DownloadParamsCreateParams<K>, searchParams?: string) => {
      const urlParamsAdj = urlParams || []
      const queryParams =
        urlParams?.length || searchParams ? (downloadParams as any)?.(...urlParamsAdj) : (downloadParams as any)?.()

      const downloadPromise = new Promise<AxiosResponse<File>>((resolve, reject) => {
        ;(async () => {
          try {
            if (searchParams) (urlParamsAdj as any).push(searchParams)

            const downloadParameters =
              urlParams?.length || searchParams
                ? (downloadParams as any)?.(...urlParamsAdj)
                : (downloadParams as any)?.()
            const query = downloadParameters?.query
            // if (!payload) return null
            const res = await query(payload, searchParams)
            // let result = false
            if (res?.data) {
              const link = getLinkFromDownloadResponse(res)
              if (!disableOpenDownload) {
                openDownloadWithLink(link)
                const successToast: any = downloadParameters?.successToast
                if (successToast && disablePromiseToast) {
                  const toast = typeof successToast === 'function' ? successToast(link) : successToast
                  showToast(toast)
                }
              }
              resolve(res)
            } else throw new Error('no file received')
          } catch (e: any) {
            if (typeof e === 'string') {
              console.error('filename not received from BE')
            }
            const statusToast = queryParams?.errorStatusToasts?.[e?.status ?? -1]
            if (e?.status && statusToast && disablePromiseToast) {
              showToast(statusToast)
              reject(e)
              return
            }
            console.error(e)
            if (disablePromiseToast) showToast(TOASTS.general.genericError)
            reject(e)
            return
          }
          reject(null)
          return
        })()
      })
      if (!disablePromiseToast) {
        const downloadParameters =
          urlParams?.length || searchParams ? (downloadParams as any)?.(...urlParamsAdj) : (downloadParams as any)?.()
        const successToast: any = downloadParameters?.successToast
        const getSuccesToast = (res: { data: AxiosResponse<File> }) =>
          typeof successToast === 'function' ? successToast(getLinkFromDownloadResponse(res?.data)) : successToast
        const getErrorStatusToast = (res: { data: AxiosResponse<File> }) => {
          return queryParams?.errorStatusToasts?.[res.data?.status ?? -1]
        }
        const promiseToast = {
          pendingTitle: queryParams?.pendingToast?.title ?? 'Downloade',
          pendingText: queryParams?.pendingToast?.text ?? 'Die Datei steht in Kürze zur Verfügung',
          successTitle: (promise: any) => {
            return getSuccesToast(promise)?.title ?? 'Downloaded'
          },
          successText: (promise: any) => getSuccesToast(promise)?.text ?? 'Die Datei wurde heruntergeladen',
          errorTitle: (promise: any) => {
            return getErrorStatusToast(promise)?.title ?? 'Fehler beim Download'
          },
          errorText: (promise: any) =>
            getErrorStatusToast(promise)?.text ?? 'Die Datei konnte nicht heruntergeladen werden',
          promise: downloadPromise,
        }
        showLoadingToast(promiseToast)
      }
      return downloadPromise
    },
    [
      showToast,
      downloadParams,
      // successToastIn,
      // errorStatusToasts,
      disableOpenDownload,
      disablePromiseToast,
      showLoadingToast,
      // pendingToast,
    ]
  )

  return download
}
