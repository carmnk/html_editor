import { MatchingObjectKeys } from './Types/general'
import { makeApiQuery } from './00_utils/makeApiQuery'
import { ENTITY_DATA_MODEL_TYPE } from 'common/entity_model'

//SETTING BASE URL
export const BASE_URL = 'http://localhost/' // 'http://h2972909.stratoserver.net:3001/'  process.env.REACT_APP_API_URL

export const API = {
  login: makeApiQuery<any, any>('auth/login', 'POST'),
  logout: makeApiQuery<any, any>('auth/logout', 'POST'),

  test: makeApiQuery<any, any>('auth/test', 'POST'),
  saveProject: makeApiQuery<any, any>('_api/editor/save', 'POST'),
  loadProject: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/load/${project_id}`, 'GET'),
  deleteProject: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/delete/${project_id}`, 'DELETE'),

  getProjects: makeApiQuery<any, any>('_api/editor/projects', 'GET'),
  getAsset: (asset_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/assets/${asset_id}`, 'GET_FILE'),

  exportProjectToZip: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/export/${project_id}`, 'POST'),
  // BASE-FULLSTACK
  entityModel: makeApiQuery<undefined, ENTITY_DATA_MODEL_TYPE>(
    'entity_model',
    'GET'
  ),

  createEntity: (entity_category: string) =>
    makeApiQuery<any, any>(`admin/${entity_category}/add`, 'POST'),

  deleteEntity: (entity_category: string, id: number) =>
    makeApiQuery<any, any>(`admin/${entity_category}/${id}`, 'DELETE'),

  editEntity: (entity_category: string, id: number) =>
    makeApiQuery<any, any>(`admin/${entity_category}/${id}`, 'PUT'),

  // getPaginatedEntityInstances
  getPagedEntityInstances: (entity_list_id: number) =>
    makeApiQuery<any, any>(`data/list/${entity_list_id}`),
  getPagedEntityInstancesXlsxExport: (entity_list_id: number) =>
    makeApiQuery<any, any>(`data/export/${entity_list_id}/xlsx/`, 'GET_FILE'),

  getEntityInstance: (entity_id: number, instance_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}/${instance_id}`, 'GET'),

  editEntityInstance: (entity_id: number, instance_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}/${instance_id}`, 'PUT'),
  deleteEntityInstance: (entity_id: number, instance_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}/${instance_id}`, 'DELETE'),
  createEntityInstance: (entity_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}`, 'POST'),

  getEntityValues: (entity_values_id: number) =>
    makeApiQuery<any, any>(`data/v/${entity_values_id}`, 'GET'),

  getDataChanges: (entityListId: number | string, entityInstanceId: number) =>
    makeApiQuery<any, any>(`_dc/${entityListId}/${entityInstanceId}`, 'GET'),

  // documents
  uploadDocument: () => makeApiQuery<FormData, any>(`_doc/`, 'POST'),
  downloadDocument: (document_id: number) =>
    makeApiQuery<undefined, any>(`_doc/${document_id}`, 'GET_FILE'),
  replaceDocument: (document_id: number) =>
    makeApiQuery<FormData, any>(`_doc/${document_id}`, 'PUT'),
  deleteDocument: (document_id: number) =>
    makeApiQuery<undefined, any>(`_doc/${document_id}`, 'DELETE'),
}

//
type API_TYPE = typeof API
type API_TYPE_KEYS = keyof API_TYPE

type API_FUNCTION_KEYS = MatchingObjectKeys<API_TYPE, Function>
type API_OBJECT_KEYS = Exclude<API_TYPE_KEYS, API_FUNCTION_KEYS>

type API_QUERY_PARAMS = ReturnType<API_TYPE[API_FUNCTION_KEYS]>

type SPECIFIC_API_FUNCTION_QUERY_PARAMS<
  T extends API_FUNCTION_KEYS = API_FUNCTION_KEYS
> = ReturnType<API_TYPE[T]>
type SPECIFIC_API_OBJECT_QUERY_PARAMS<
  T extends API_OBJECT_KEYS = API_OBJECT_KEYS
> = API_TYPE[T]

export type SPECIFIC_API_OBJECT_RESPONSE_TYPE<
  T extends API_OBJECT_KEYS = API_OBJECT_KEYS
> = ReturnType<SPECIFIC_API_OBJECT_QUERY_PARAMS<T>['query']>
export type SPECIFIC_API_FUNCTION_RESPONSE_TYPE<
  T extends API_FUNCTION_KEYS = API_FUNCTION_KEYS
> = ReturnType<SPECIFIC_API_FUNCTION_QUERY_PARAMS<T>['query']>

export type SPECIFIC_API_OBJECT_PAYLOAD_TYPE<
  T extends API_OBJECT_KEYS = API_OBJECT_KEYS
> = Parameters<SPECIFIC_API_OBJECT_QUERY_PARAMS<T>['query']>[0]
export type SPECIFIC_API_FUNCTION_PAYLOAD_TYPE<
  T extends API_FUNCTION_KEYS = API_FUNCTION_KEYS
> = Parameters<SPECIFIC_API_FUNCTION_QUERY_PARAMS<T>['query']>[0]

export type API_QUERY_RESPONSE_TYPE<
  T extends API_FUNCTION_KEYS | API_OBJECT_KEYS
> = T extends API_OBJECT_KEYS
  ? SPECIFIC_API_OBJECT_RESPONSE_TYPE<T>
  : T extends API_FUNCTION_KEYS
  ? SPECIFIC_API_FUNCTION_RESPONSE_TYPE<T>
  : never

export type API_QUERYS_RESPONSE_TYPES = {
  [T in API_FUNCTION_KEYS | API_OBJECT_KEYS]?: API_QUERY_RESPONSE_TYPE<T>
}
