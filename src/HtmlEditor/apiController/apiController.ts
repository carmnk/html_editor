import axios from 'axios'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import {
  getLinkFromDownloadResponse,
  openDownloadWithLink,
} from '../../utils/api'
import {
  EditorStateType,
  ImageType,
  ProjectType,
} from '../editorController/editorState'
import { makeImageSourcesForExport } from '../utils'
import { API } from '../../api/API'
import {
  EditorStateDbDataType,
  transformEditorStateFromPayload,
  transformEditorStateToPayload,
} from './transformEditorState'
import { reloadSerializedThemes } from './transformEditorStateTheme'
import { createTheme, responsiveFontSizes } from '@mui/material'
import { createMuiTheme } from '../../theme/createTheme'
import { baseComponents } from '../editorComponents/baseComponents'
import { EditorControllerAppStateReturnType } from '../editorController/editorControllerTypes'

export const SESSION_DURATION = 10 * 60 * 1000 // 10 minutes

export type ServerControllerActionsType = {
  login: () => void
  logout: () => void
  handleRequestWebsiteZipBundle: () => void
  saveProjectToCloud: (payload: EditorStateType) => void
  getLoggedInStatus: () => { expires: string | null; email: string | null }
  changeLoginEmail: (email: string) => void
  changeLoginPassword: (password: string) => void
  loadProjectFromCload: (project_id: string) => void
  changeLogInStatus: (isLoggedIn: boolean) => void
  deleteProjectFromCloud: (project_id: string) => void
}

export type ServerControllerType = {
  data: {
    bundleData: {
      loading: boolean
      link: string
      blob: Blob | null
    }
    loginForm: {
      email: string
      password: string
    }
  }
  actions: ServerControllerActionsType
}

export const useServerController = (
  editorState: EditorStateType,
  setEditorState: Dispatch<SetStateAction<EditorStateType>>,
  appState: EditorControllerAppStateReturnType
): ServerControllerType => {
  const [data, setData] = useState({
    bundleData: {
      loading: false,
      link: '',
      blob: null as Blob | null,
    },
    loginForm: {
      email: 'cm@cm.mt',
      password: 'password',
      isLoggedIn: false,
    },
  })

  const changeLogInStatus = useCallback(
    (isLoggedIn: boolean) => {
      localStorage.removeItem('expires')
      localStorage.removeItem('email')
      setData((current) => ({
        ...current,
        loginForm: {
          ...current.loginForm,
          isLoggedIn,
        },
      }))
    },
    [setData]
  )

  const changeLoginEmail = useCallback((email: string) => {
    setData((current) => ({
      ...current,
      loginForm: {
        ...current.loginForm,
        email,
      },
    }))
  }, [])

  const changeLoginPassword = useCallback((password: string) => {
    setData((current) => ({
      ...current,
      loginForm: {
        ...current.loginForm,
        password,
      },
    }))
  }, [])

  const login = useCallback(async () => {
    try {
      const email = data.loginForm.email
      const password = data.loginForm.password
      const expiresAt = +new Date() + SESSION_DURATION
      try {
        const res = await API.login.query({ email, password })
        localStorage.setItem('expiresAt', expiresAt.toString())
        localStorage.setItem('email', email)
        setData((current) => ({
          ...current,
          loginForm: {
            ...current.loginForm,
            isLoggedIn: true,
          },
        }))
      } catch (e) {
        console.error(e)
      }

      // updateRoutes()
      // navigate?.(INITIAL_ROUTE)
    } catch (err) {
      // showToast(TOASTS.general.genericError)
      console.log(err)
    }
  }, [data.loginForm.email, data.loginForm.password])

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('expiresAt')
      localStorage.removeItem('email')
      try {
        const res = await API.logout.query()
      } catch (e) {
        console.error(e)
      }

      setData((current) => ({
        ...current,
        loginForm: {
          ...current.loginForm,
          isLoggedIn: false,
        },
      }))
      // updateRoutes()
      // navigate?.(INITIAL_ROUTE)
    } catch (err) {
      // showToast(TOASTS.general.genericError)
      console.error(err)
    }
  }, [])

  const handleRequestWebsiteZipBundle = useCallback(async () => {
    setData((current) => ({
      ...current,
      bundleData: {
        ...current.bundleData,
        loading: true,
      },
    }))
    try {
      const res = await API.exportProjectToZip(
        editorState.project.project_id
      ).query()
      console.log('CREATE_BUNDLE- RESPONSE', res)
      //   const baseUrl = import.meta.env.VITE_WEBSITE_BUILDER_SERVER
      //   const url = baseUrl + '/fe_gen/zip_export'
      //   /* eslint-disable @typescript-eslint/no-unused-vars */
      //   const {
      //     // selectedCssClass,
      //     // selectedHtmlElementName,
      //     // selectedImage,
      //     // selectedFont
      //     // selectedPage,
      //     // expandedTreeItems,
      //     // imageWorkspaces,
      //     // htmlPages: htmlPagesIn, // !!! ???
      //     // cssWorkspaces,
      //     ui,
      //     ...dataRaw
      //   } = editorState
      //   /* eslint-enable @typescript-eslint/no-unused-vars */
      //   const htmlPages = makeImageSourcesForExport(editorState)
      //   const formData = new FormData()
      //   formData.append('cssWorkspaces', JSON.stringify(cssWorkspaces))
      //   formData.append('htmlPages', JSON.stringify(htmlPages))
      //   for (let f = 0; f < Object.keys(imageWorkspaces.common).length; f++) {
      //     const key = Object.keys(imageWorkspaces.common)[f]
      //     const image = imageWorkspaces.common[key]
      //     formData.append('image', image.image as unknown as File)
      //   }
      //   const res = await axios.post(url, formData, {
      //     responseType: 'blob',
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   })
      //   const link = getLinkFromDownloadResponse(res)
      //   openDownloadWithLink(link)
    } catch (e) {
      console.error('error', e)
      alert('an error occurred while downloading the file')
    }
    setData((current) => ({
      ...current,
      bundleData: {
        ...current.bundleData,
        loading: false,
      },
    }))
  }, [editorState])

  // internal Fn to process server response
  const loadProjectFromServerResponse = useCallback(
    async (serverResponse: EditorStateDbDataType) => {
      const newEditorState = transformEditorStateFromPayload(
        serverResponse,
        editorState
      )

      const currentEditorImageIds = editorState?.assets.images.map(
        (image) => image._id
      )
      const imageIdsFromDb = newEditorState?.assets.images?.map(
        (image) => image._id
      )
      const missingImageIds = imageIdsFromDb?.filter(
        (imageId) => !currentEditorImageIds?.includes(imageId)
      )

      const imageFiles: {
        url: string
        image: File
        _id: string
        src: string
      }[] = []
      for (let i = 0; i < missingImageIds?.length; i++) {
        const imageId = missingImageIds[i]
        const res = await API.getAsset(imageId).query()
        const blob = res?.data
        const url = URL.createObjectURL(blob)
        const file = new File([blob], imageId, {
          type: blob.type,
        })

        imageFiles.push({ url, image: file, _id: imageId, src: url })
      }

      const newThemes = newEditorState?.themes?.map((theme) => {
        const muiTheme = createMuiTheme(theme)
        // const palette = theme.palette
        // const paletteMainKeys = Object.keys(palette)
        // const newPalette = paletteMainKeys.reduce((acc, key) => {
        //   const mainColor = palette[key as keyof typeof palette]
        //   const mainColorSubColorNames = Object.keys(mainColor)
        //   const subColorNames = mainColorSubColorNames.filter(
        //     (colorName) => (mainColor as any)[colorName]
        //   )
        //   const subColors = subColorNames.reduce((acc, subColorName) => {
        //     const value = (mainColor as any)[subColorName]
        //     return {
        //       ...acc,
        //       [subColorName]: value,
        //     }
        //   }, {})
        //   const newValue = typeof mainColor === 'object' ? subColors : mainColor
        //   return {
        //     ...acc,
        //     [key]: newValue,
        //   }
        // }, {})
        // const cleanedTheme = {
        //   ...theme,
        //   palette: newPalette,
        // }

        return muiTheme
      })

      const newAssets = {
        ...newEditorState.assets,
        images: (newEditorState.assets.images
          ? newEditorState.assets.images?.map((image) => {
              const imageFile = imageFiles.find(
                (imageFile) => imageFile._id === image._id
              )
              return {
                ...image,
                ...((imageFile || {}) as any),
              }
            }) ?? []
          : editorState?.assets.images) as ImageType[],
        // ...imageFiles.map((imageFile) => ({
        //   _id: imageFile.url,
        //   image: imageFile.url,
        // })),
      }
      const elementsWithNewImages = newEditorState.elements.map(
        (el) => {
          // const srcAttribute =
          return el?._type === 'img'
            ? {
                ...el,
                attributes: {
                  ...el.attributes,
                  src:
                    (
                      newAssets.images.find(
                        (as) => as._id === el?.attributes?.src
                      ) || {}
                    )?.src || el?.attributes?.src,
                },
              }
            : el
        }

        // src: (newAssets.images.find((as) => as._id === el. )) } : el}
        // : el
      )

      elementsWithNewImages.forEach((el) => {
        const defaultComponentProps = baseComponents.find(
          (comp) => comp.type === el._type
        )
        if (!defaultComponentProps) return
        if ('state' in defaultComponentProps) {
          const _id = el._id
          appState.actions.addProperty(
            _id,
            (defaultComponentProps as any)?.state ?? ''
          )
        }
      })

      const defaultTheme = serverResponse.project.default_theme as any
      const newEditorStateWithImages = {
        ...newEditorState,
        elements: elementsWithNewImages,
        assets: newAssets,
        themes: newThemes,
        theme: newThemes.find(
          (theme) => theme.palette.mode === defaultTheme
        ) as any,
      }
      console.log(
        'LOAD_PROJECT- data in,',
        serverResponse,
        newEditorState,
        newEditorStateWithImages
      )
      setEditorState(newEditorStateWithImages)

      return newEditorStateWithImages
    },
    [editorState, setEditorState]
  )

  const loadProjectFromCload = useCallback(
    async (project_id: string) => {
      if (!project_id) return
      try {
        const res = await API.loadProject(project_id).query()
        const resDataIn = res?.data?.data
        const newEditorState = await loadProjectFromServerResponse(resDataIn)
      } catch (err) {
        console.error(err)
      }
    },
    [loadProjectFromServerResponse]
  )

  const deleteProjectFromCloud = useCallback(async (project_id: string) => {
    if (!project_id) return
    try {
      const res = await API.deleteProject(project_id).query()
    } catch (err) {
      console.error(err)
    }
  }, [])

  const saveProjectToCloud = useCallback(
    async (payload: EditorStateType) => {
      const payloadDbDataRaw = transformEditorStateToPayload(payload)
      if (!payloadDbDataRaw) {
        return
      }
      console.log(
        'SAVE_PROJECT- BEFORE SAVE, payload: ',
        payloadDbDataRaw,
        'pre-processed payload: ',
        payload
      )
      const payloadDbData = new FormData()
      const { imageFiles, ...payloadJsonData } = payloadDbDataRaw
      payloadDbData.append('data', JSON.stringify(payloadJsonData))
      for (let f = 0; f < (imageFiles?.length ?? 0); f++) {
        const imageFile = imageFiles?.[f]
        if (!imageFile) continue
        const file = imageFile?.image as File
        const newFile = new File([file], imageFile.asset_id, {
          type: file.type,
        })

        payloadDbData.append('image', newFile)
      }

      try {
        const res = await API.saveProject.query(
          payloadDbData,
          undefined,
          undefined,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        const resDataIn = res?.data?.data
        const newEditorState = await loadProjectFromServerResponse(resDataIn)
        // const newEditorState = transformEditorStateFromPayload(
        //   resDataIn,
        //   editorState
        // )
        // setEditorState(newEditorState)
        console.log(
          'SAVE_PROJECT- After Save, data in:',
          resDataIn,
          'new state',
          newEditorState
        )
      } catch (err) {
        console.error(err)
      }
    },
    [loadProjectFromServerResponse]
  )

  const getLoggedInStatus = useCallback(() => {
    const expires = localStorage.getItem('expires')
    const email = localStorage.getItem('email')
    return { expires, email }
  }, [])

  return {
    data,
    actions: {
      login,
      logout,
      handleRequestWebsiteZipBundle,
      saveProjectToCloud,
      loadProjectFromCload,
      getLoggedInStatus,
      changeLoginEmail,
      changeLoginPassword,
      changeLogInStatus,
      deleteProjectFromCloud,
    },
  }
}
