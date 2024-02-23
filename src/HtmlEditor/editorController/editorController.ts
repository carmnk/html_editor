import { cloneDeep, uniq } from 'lodash'
import { ChangeEvent, useState, useCallback, useMemo } from 'react'
import {
  toBase64,
  createAndDownloadFileWithText,
  dataURLtoFile,
} from '../../utils/file'
import {
  EditorStateType,
  ElementType,
  defaultPageElements,
  defaultEditorState,
} from './editorState'
import { getStylesFromClasses } from '../renderElements'
import { v4 as uuid } from 'uuid'
import {
  getInitialStyles,
  makeImageSourcesForExport,
  // replaceImageSources,
} from '../utils'
import { useEditorControllerElementActions } from './editorControllerElementActions'
import { useEditorControllerCssSelectorActions } from './editorControllerCssSelectorActions'
import { useEditorControllerAppStateActions } from './editorControllerAppStateActions'
import { EditorControllerType } from './editorControllerTypes'
import { useEditorControllerUi } from './editorControllerUi'
import { useEditorControllerThemesActions } from './editorControllerThemesActions'

export const useEditorController = (params?: {
  initialEditorState?: Pick<
    EditorStateType,
    | 'assets'
    | 'cssSelectors'
    | 'defaultTheme'
    | 'elements'
    | 'fonts'
    | 'project'
    | 'themes'
  >
}): EditorControllerType => {
  // load initial state if provided
  const { initialEditorState } = params ?? {}
  const initialEditorStateAdj = {
    ...defaultEditorState(),
    ...(initialEditorState ?? {}),
  }
  const [editorState, setEditorState] = useState(initialEditorStateAdj)

  const selectedHtmlElement2 = useMemo(() => {
    const id = editorState?.ui.selected.element
    return editorState?.elements?.find((el) => el._id === id) ?? null
  }, [editorState.ui.selected.element, editorState?.elements])

  const selectedPageHtmlElements2 = useMemo(() => {
    const selectedPage = editorState.ui.selected.page
    return (
      editorState?.elements?.filter((el) => el._page === selectedPage) ?? []
    )
  }, [editorState.ui.selected.page, editorState?.elements])
  /* eslint-enable react-hooks/exhaustive-deps */

  const selectedHtmlElementStyleAttributes2 = useMemo(() => {
    const className = (selectedHtmlElement2 as ElementType<'div'>)?.attributes
      ?.className
    return {
      ...getInitialStyles(),
      ...getStylesFromClasses(className ?? '', editorState?.cssSelectors),
      ...((selectedHtmlElement2 as any)?.attributes?.style ?? {}),
    }
  }, [
    selectedHtmlElement2,
    editorState.cssSelectors,
    (selectedHtmlElement2 as ElementType<'div'>)?.attributes?.className,
  ])

  const appState = useEditorControllerAppStateActions({
    editorState,
    setEditorState,
  })

  const htmlElementActions = useEditorControllerElementActions({
    editorState,
    appState,
    setEditorState,
    selectedHtmlElement: selectedHtmlElement2,
    selectedHtmlElementStyleAttributes: selectedHtmlElementStyleAttributes2,
    selectedPageHtmlElements: selectedPageHtmlElements2,
  })
  const cssSelectorActions = useEditorControllerCssSelectorActions({
    editorState,
    setEditorState,
  })

  const uiActions = useEditorControllerUi({ editorState, setEditorState })

  const themesActions = useEditorControllerThemesActions({
    editorState,
    setEditorState,
  })

  const getSelectedImage = useCallback(
    (imageId?: string) => {
      const selectedImageId = imageId ?? editorState.ui.selected.image
      const selectedImage =
        editorState.assets.images.find(
          (image) => image._id === selectedImageId
        ) ?? null
      return { ...selectedImage, imageSrcId: imageId ?? '' } as any
    },
    [editorState?.assets.images, editorState.ui.selected.image]
  )

  const saveProject = useCallback(async () => {
    // const { cssSelectors, imageWorkspaces } = editorState
    // const htmlPages = makeImageSourcesForExport(editorState)
    // const assetLessEditorState = cloneDeep({ htmlPages, cssSelectors })
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const convertedImageWorkspaces: any = {}
    // for (const wsName of Object.keys(imageWorkspaces)) {
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   const convertedImageWorkspace: any = {}
    //   const imageWorkspace = imageWorkspaces[wsName]
    //   for (const imageId of Object.keys(imageWorkspace)) {
    //     convertedImageWorkspace[imageId] = {
    //       ...(imageWorkspaces[wsName][imageId] ?? {}),
    //       image: await toBase64(
    //         imageWorkspace[imageId].image as unknown as File
    //       ),
    //       src: `${wsName}/${imageWorkspaces[wsName][imageId].fileName}`,
    //     }
    //   }
    //   convertedImageWorkspaces[wsName] = convertedImageWorkspace
    // }
    // const saveState = {
    //   ...assetLessEditorState,
    //   localImageWorkspaces: convertedImageWorkspaces,
    // }
    // const saveStateStr = JSON.stringify(saveState, null, 2)
    // createAndDownloadFileWithText('website_builder_project.json', saveStateStr)
  }, [editorState])

  const loadProject = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files ?? [])
    const file = files?.[0]
    if (!file) return
    const fileText = await file.text()
    const json = JSON.parse(fileText) as any

    // const { cssSelectors, localImageWorkspaces } = json

    // // doesnt exist anymore
    // const htmlPages: any[] = []
    // const convertedImageWorkspaces: {
    //   [key: string]: {
    //     [key: string]: { image: File; src: string; filename: string }
    //   }
    // } = {}
    // for (const wsName of Object.keys(localImageWorkspaces)) {
    //   const convertedImageWorkspace: {
    //     [key: string]: { image: File; src: string; filename: string }
    //   } = {}
    //   const imageWorkspace = localImageWorkspaces[wsName]
    //   for (const imageId of Object.keys(imageWorkspace)) {
    //     const imageData = imageWorkspace[imageId]
    //     const fileStr = imageData.image as unknown as string
    //     const file = dataURLtoFile(fileStr, imageData.fileName)
    //     convertedImageWorkspace[imageId] = {
    //       ...(localImageWorkspaces[wsName][imageId] ?? {}),
    //       image: file,
    //       src: URL.createObjectURL(file),
    //       filename: imageData.fileName,
    //     }
    //   }
    //   convertedImageWorkspaces[wsName] = convertedImageWorkspace
    // }

    // const loadState = {
    //   htmlPages,
    //   cssSelectors,
    //   imageWorkspaces:
    //     convertedImageWorkspaces as unknown as EditorStateType['imageWorkspaces'],
    // }
    // const newHtmlPages = replaceImageSources(loadState as any)

    // setEditorState((current) => ({
    //   ...current,
    //   ...loadState,
    //   htmlPages: newHtmlPages,
    //   ui: {
    //     ...current.ui,
    //     selected: {
    //       ...current.ui.selected,
    //       page: 'index',
    //       element: null,
    //       cssSelector: null,
    //       image: null,
    //       font: null,
    //     },
    //   },
    // }))
  }, [])

  const changeImageFilename = useCallback(
    (newFileName: string) => {
      if (!newFileName) return
      const selectedFileId = editorState.ui.selected.image
      if (!selectedFileId) return

      setEditorState((current) => ({
        ...current,
        assets: {
          images: current.assets.images.map((image) => {
            if (image._id === selectedFileId) {
              return {
                ...image,
                fileName: newFileName,
              }
            }
            return image
          }),
        },
      }))
    },
    [editorState.ui.selected.image, setEditorState]
  )

  const addHtmlPage = useCallback(() => {
    setEditorState((current) => {
      const currentPages = current.elements?.map((el) => el._page) ?? []
      const newPageName =
        `newPage` +
        (currentPages.includes('newPage')
          ? currentPages
              .map((pageName) => pageName.includes('newPage'))
              ?.filter((x) => x)?.length ?? 1
          : ''
        )?.toString()
      const newDefaultPageElements = defaultPageElements().map((el) => ({
        ...el,
        _page: newPageName,
      }))
      return {
        ...current,
        elements: [...current.elements, ...newDefaultPageElements],
      }
    })
  }, [setEditorState])

  const renameHtmlPage = useCallback(
    (oldPageName: string, newPageName: string) => {
      setEditorState((current) => {
        return {
          ...current,
          elements: current.elements.map((el) => {
            if (el._page === oldPageName) {
              return { ...el, _page: newPageName }
            }
            return el
          }),
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              page: newPageName,
            },
          },
        }
      })
    },
    [setEditorState]
  )

  const duplicateHtmlPage = useCallback(
    (pageName: string) => {
      setEditorState((current) => {
        const currentPages = uniq(current.elements?.map((el) => el._page)) ?? []
        const newPageNameAdj =
          `duplicate_${pageName}` +
          (currentPages.includes(`duplicate_${pageName}`)
            ? currentPages
                .map((pageName) => pageName.includes(`duplicate_${pageName}`))
                ?.filter((x) => x)?.length ?? 1
            : '')
        const duplicatePageElements = current.elements
          ?.filter((el) => el._page === pageName)
          ?.map((el) => ({
            ...el,
            _page: newPageNameAdj,
            // _id: uuid(),
          }))
        // currently only 1 root element!
        const rootElementId = duplicatePageElements?.find(
          (el) => !el?._parentId
        )?._id
        if (!rootElementId) return current

        const sortedParentIds = [rootElementId]
        for (let i = 0; i < duplicatePageElements.length; i++) {
          const parentId = sortedParentIds?.[i]
          if (!parentId) break
          for (let j = 0; j < duplicatePageElements.length; j++) {
            const el = duplicatePageElements[j]
            if (el._parentId === parentId) {
              sortedParentIds.push(el._id)
            }
          }
        }
        const sortedElementsExRoot = sortedParentIds
          .map((parentId) =>
            duplicatePageElements.filter((el) => el._parentId === parentId)
          )
          .flat()
        const rootElement = duplicatePageElements.find(
          (el) => el._id === rootElementId
        )
        if (!rootElement) return current
        const sortedElements = [rootElement, ...sortedElementsExRoot]
        const newIdsKeys = sortedElements.map((el) => {
          return { prevId: el._id, prevParentId: el._parentId, newId: uuid() }
        })
        const newDuplicatePageElements = duplicatePageElements.map((dup) => {
          const newId = newIdsKeys.find((el) => el.prevId === dup._id)?.newId
          const newParentId = newIdsKeys.find(
            (el) => el.prevId === dup._parentId
          )?.newId
          return { ...dup, _id: newId ?? null, _parentId: newParentId ?? null }
        })
        const filteredNewDuplicatePageElements =
          newDuplicatePageElements.filter(
            (dupl) => !!dupl._id
          ) as typeof newDuplicatePageElements & { _id: string }[]
        return {
          ...current,
          elements: [...current.elements, ...filteredNewDuplicatePageElements],
        }
      })
    },
    [setEditorState]
  )

  const removeHtmlPage = useCallback((pageName: string) => {
    setEditorState((current) => {
      return {
        ...current,
        ui: {
          ...current.ui,
          selected: {
            ...current.ui.selected,
            page: current.ui.selected.page === pageName ? 'index' : pageName,
          },
        },
        elements: current.elements.filter((el) => el._page !== pageName),
      }
    })
  }, [])

  const deleteImageFile = useCallback(
    (imageId: string) => {
      setEditorState((current) => {
        return {
          ...current,
          assets: {
            images: current.assets.images.filter(
              (image) => image._id !== imageId
            ),
          },
        }
      })
    },
    [setEditorState]
  )

  const handleProvidedImageFile = useCallback(
    (files: File[]) => {
      setEditorState((current) => ({
        ...current,
        assets: {
          images: [
            ...current.assets.images,
            ...files.map((file) => ({
              _id: uuid(),
              _upload: true,
              image: file as any,
              src: URL.createObjectURL(file),
              fileName: file.name,
            })),
          ],
        },
      }))
    },
    [setEditorState]
  )

  const handleChangeDefaultTheme = useCallback((newDefaultTheme: string) => {
    setEditorState((current) => {
      return {
        ...current,
        defaultTheme: newDefaultTheme as any,
      }
    })
  }, [])

  return {
    selectedHtmlElement2,
    selectedPageHtmlElements2,
    selectedHtmlElementStyleAttributes2,

    editorState,
    appState,
    setEditorState,
    // getSelectedCssClass: getSelectedCssClass as any,
    getSelectedImage,
    actions: {
      project: {
        saveProject,
        loadProject,
        addHtmlPage,
        removeHtmlPage,
        duplicateHtmlPage,
        renameHtmlPage,
        handleChangeDefaultTheme,
      },
      htmlElement: htmlElementActions,
      cssSelector: cssSelectorActions,
      assets: {
        handleProvidedImageFile,
        deleteImageFile,
        changeImageFilename,
      },
      themes: themesActions,
      ui: uiActions,
    },
  }
}
