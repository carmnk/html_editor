import { useCallback, Dispatch, SetStateAction } from 'react'
import { EditorStateLeftMenuTabs, EditorStateType } from './editorState'
import { EditorControllerUiActionsType } from './editorControllerTypes'
import { UI_POINTER_MODE } from '../defs/uiPointerMode'

export type EditorControllerAppStateParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useEditorControllerUi = (
  params: EditorControllerAppStateParams
): EditorControllerUiActionsType => {
  const { editorState, setEditorState } = params

  const changePointerMode = useCallback(
    (newValue: UI_POINTER_MODE) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          pointerMode: newValue,
        },
      }))
    },
    [setEditorState]
  )

  const toggleEditorTheme = useCallback(
    (themeNameIn: ((currentThemeName: string) => string) | string) => {
      const themeName =
        typeof themeNameIn === 'function'
          ? themeNameIn(editorState?.theme?.name)
          : themeNameIn
      if (!themeName) return
      setEditorState((current) => ({
        ...current,
        theme:
          current.themes?.find?.((t) => t.name === themeName) ?? current?.theme,
      }))
    },
    [editorState?.theme?.name, setEditorState]
  )

  const changeHtmlElementStyleTab = useCallback(
    (newValue: string) => {
      const newValueTyped = newValue as 'layout' | 'shape' | 'typography'
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              activeStylesTab: newValueTyped,
            },
          },
        },
      }))
    },
    [setEditorState]
  )

  const selectHtmlElementCssPropertiesListFilter = useCallback(
    (newValueRaw: string) => {
      const newValue = newValueRaw as 'all' | 'styles' | 'classes'
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              cssRulesFilter: newValue,
            },
          },
        },
      }))
    },
    [setEditorState]
  )

  const selectHtmlPage = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: { ...current.ui.selected, page: newValue, element: null },
        },
      }))
    },
    [setEditorState]
  )

  const selectTheme = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          navigationMenu: {
            ...current.ui.navigationMenu,
            selectedTheme: newValue,
          },
        },
      }))
    },
    [setEditorState]
  )
  const selectStateComponent = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: {
            ...current.ui.selected,
            state: newValue,
          },
        },
      }))
    },
    [setEditorState]
  )

  const selectCssClass = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: { ...current.ui.selected, cssSelector: newValue },
        },
      }))
    },
    [setEditorState]
  )

  const selectImage = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: { ...current.ui.selected, image: newValue },
        },
      }))
    },
    [setEditorState]
  )

  const switchNavigationTab = useCallback(
    (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          navigationMenu: {
            ...current.ui.navigationMenu,
            activeTab: newValue as EditorStateLeftMenuTabs,
          },
        },
      }))
    },
    [setEditorState]
  )

  const selectElement = useCallback(
    (value: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: { ...current.ui.selected, element: value },
        },
      }))
    },
    [setEditorState]
  )
  const expandHtmlElementTreeItem = useCallback(
    (value: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          navigationMenu: {
            ...current.ui.navigationMenu,
            expandedTreeItems:
              current.ui.navigationMenu?.expandedTreeItems?.includes(value)
                ? current.ui.navigationMenu?.expandedTreeItems?.filter(
                    (item) => item !== value
                  )
                : [
                    ...(current.ui.navigationMenu?.expandedTreeItems ?? []),
                    value,
                  ],
          },
        },
      }))
    },
    [setEditorState]
  )

  const toggleElementAddComponentMode = useCallback(
    (nodeId: string | number) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          navigationMenu: {
            ...current.ui.navigationMenu,
            elementAddComponentMode: current.ui.navigationMenu
              .elementAddComponentMode
              ? null
              : (nodeId as any),
          },
        },
      }))
    },
    [setEditorState]
  )

  const selectFont = useCallback(
    (nodeId: string | number) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: { ...current.ui.selected, font: nodeId as string },
        },
      }))
    },
    [setEditorState]
  )

  const togglePreviewMode = useCallback(() => {
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        previewMode: !current.ui.previewMode,
        pointerMode:
          !current.ui.previewMode === true
            ? UI_POINTER_MODE.production
            : UI_POINTER_MODE.mixed,
      },
    }))
  }, [setEditorState])

  return {
    togglePreviewMode,
    changePointerMode,
    toggleEditorTheme,
    selectHtmlPage,
    selectElement,
    selectCssClass,
    selectImage,
    selectFont,
    selectStateComponent,
    navigationMenu: {
      switchNavigationTab,
      toggleElementAddComponentMode: toggleElementAddComponentMode as any,
      expandHtmlElementTreeItem,
      selectTheme,
    },
    detailsMenu: {
      selectHtmlElementCssPropertiesListFilter,
      changeHtmlElementStyleTab,
    },
  }
}
