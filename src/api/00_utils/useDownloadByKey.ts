import { AxiosResponse } from 'axios'
import { ToastType } from '../../store/reducers/toast'
import {
  DownloadParamsCreateParams,
  DownloadParamsKeyType,
  DownloadParamsPayloadType,
  DownloadParamsType,
  DOWNLOADS_PARAMS,
} from '../DOWNLOADS'
import { useDownload } from './useDownload'

export type UseDownloadByKeyParameterType<K extends DownloadParamsKeyType> = {
  key: K
  disableOpenDownload?: boolean
  disablePromiseToast?: boolean
}

export const useDownloadByKey = <K extends DownloadParamsKeyType>(param: UseDownloadByKeyParameterType<K>) => {
  const { key, disableOpenDownload, disablePromiseToast } = param
  const downloadParams = DOWNLOADS_PARAMS?.[key] as DownloadParamsType[K]
  const download = useDownload({
    downloadParams,
    disableOpenDownload,
    disablePromiseToast,
  })
  return download as (
    payload?: DownloadParamsPayloadType<K>,
    createUrlParams?: DownloadParamsCreateParams<K>,
    searchParams?: string
  ) => Promise<AxiosResponse<File>>
}
