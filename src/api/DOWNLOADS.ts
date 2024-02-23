import { TOASTS } from '../content/toasts'
import { API } from './API'

//: { [key: string]: (...params: any[]) => { query: any; errorStatusToasts?: any } }

export const DOWNLOADS_PARAMS = {
  getPagedEntityInstancesXlsxExport: (entity_list_id: number) => ({
    query: API.getPagedEntityInstancesXlsxExport(entity_list_id).query,
  }),
  downloadDocument: (document_id: number) => ({
    query: API.downloadDocument(document_id).query,
  }),
}

// DOWNLOADS_PARAMS.subscriptionForm('1').query

export type DownloadParamsType = typeof DOWNLOADS_PARAMS
export type DownloadParamsKeyType = keyof typeof DOWNLOADS_PARAMS
export type DownloadParamsCreateParams<K extends DownloadParamsKeyType> =
  Parameters<DownloadParamsType[K]>

export type DownloadParamsQueryType<K extends DownloadParamsKeyType> =
  ReturnType<DownloadParamsType[K]>['query']
export type DownloadParamsPayloadType<K extends DownloadParamsKeyType> =
  Parameters<DownloadParamsQueryType<K>>[0]
