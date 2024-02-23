import { Theme } from '@mui/material'
import { CSSProperties, ChangeEvent } from 'react'
import {
  EditorStateType,
  ComponentElementTypes,
  ElementType,
} from './editorState'
import { UI_POINTER_MODE } from '../defs/uiPointerMode'

export type EditorControllerType = {
  editorState: EditorStateType
  appState: EditorControllerAppStateReturnType
  setEditorState: React.Dispatch<React.SetStateAction<EditorStateType>>

  // getSelectedCssClass: (className?: string) => CSSProperties;
  getSelectedImage: (imageId?: string) => {
    image: typeof Image
    fileName: string
    src: string
    imageSrcId: string
  } | null
  //
  selectedHtmlElement2: ElementType | null
  selectedPageHtmlElements2: ElementType[]
  selectedHtmlElementStyleAttributes2: React.CSSProperties

  actions: {
    project: {
      saveProject: () => void
      loadProject: (e: ChangeEvent<HTMLInputElement>) => void
      addHtmlPage: () => void
      removeHtmlPage: (pageName: string) => void
      duplicateHtmlPage: (pageName: string) => void
      renameHtmlPage: (oldPageName: string, newPageName: string) => void
      handleChangeDefaultTheme: (themeName: string) => void
    }
    assets: {
      handleProvidedImageFile: (files: File[]) => void
      deleteImageFile: (imageId: string) => void
      changeImageFilename: (newFileName: string) => void
    }
    themes: EditorControllerThemesActionsType
    htmlElement: EditorControllerHtmlElementActionsType
    cssSelector: EditorControllerCssSelectorActionsType
    ui: EditorControllerUiActionsType
  }
}

export type EditorControllerAppStateType = { [key: string]: any }
export type EditorControllerAppStateReturnType = {
  state: EditorControllerAppStateType
  // values: { [key: string]: string[] };
  actions: {
    addProperty: (key: string, value: any) => void
    removeProperty: (key: string) => void
    updateProperty: (key: string, value: any) => void
  }
  // setStateValues: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
}

export type EditorControllerCssSelectorActionsType = {
  removeRule: (ruleName: string) => void
  addNewRule: () => void
  toggleEditRule: (ruleName: keyof CSSProperties) => void
  changeEditRuleValue: (newValue: string) => void
  changeClassName: (newClassName: string, currentId: string) => void
  changeAddClassRuleName: (newValue: string) => void
  changeAddClassRuleValue: (newValue: string) => void
  deleteCssSelector: (name: string) => void
  addCssSelector: (newVal: string) => void
}

export type EditorControllerHtmlElementActionsType = {
  deleteElement: (newValue: string | number) => void
  addHtmlChild: (newValue: string, newElementType?: string) => void
  toggleHtmlElementEditCssRule: (attributeName: string) => void
  changeHtmlElementEditedCssRuleValue: (
    newValue: string,
    activeEditRule: string
  ) => void
  changeCurrentHtmlElement: (
    newHtmlElement: ElementType | ((current: ElementType) => ElementType)
  ) => void
  changeCurrentHtmlElementStyleAttribute: (
    ruleName: string,
    ruleValue: string
  ) => void
  changeCurrentHtmlElementAttribute: (
    attributeName: string,
    attributeValue: string
  ) => void
  changeCurrentElementProp: (
    propName: keyof ElementType,
    propValue: string
  ) => void
  changeElementProp: (
    elementId: string,
    propName: keyof ElementType,
    propValue: string
  ) => void
  removeCurrentHtmlElementStyleAttribute: (ruleName: string) => void
  addComponentChild: (newValue: string, type: ComponentElementTypes) => void
  changeSelectedComponentProp: (key: string, value: any) => void
  changeComponentProp: (componentId: string, key: string, value: any) => void
  swapHtmlElements: (elementId: string, targetElementId: string) => void
  insertElementIntoElement: (elementId: string, targetElementId: string) => void
}

export type EditorControllerThemesActionsType = {
  changeThemePaletteColor: (params: {
    themeName: string
    colorKey: keyof Theme['palette']
    subKey?: string
    newValue: string
  }) => void
  changeTypographyStyle: (params: {
    variantKey: keyof Theme['typography']
    //   styleKey: keyof Theme['typography']['caption']
    newVariantStyles: any
  }) => void
}

export type EditorControllerUiActionsType = {
  togglePreviewMode: () => void
  changePointerMode: (newValue: UI_POINTER_MODE) => void
  selectStateComponent: (newValue: string) => void
  selectFont: (fontFamily: string) => void
  // changeThemePaletteColor: (params: {
  //   themeName: string
  //   colorKey: keyof Theme['palette']
  //   subKey?: string
  //   newValue: string
  // }) => void
  toggleEditorTheme: (currentThemeName: string) => void
  selectHtmlPage: (newValue: string) => void
  selectElement: (newValue: string) => void
  selectCssClass: (newValue: string) => void
  selectImage: (newValue: string) => void
  navigationMenu: {
    switchNavigationTab: (newValue: string) => void
    toggleElementAddComponentMode: (nodeId: string | null) => void
    expandHtmlElementTreeItem: (newValue: string) => void
    selectTheme: (newValue: string) => void
  }
  detailsMenu: {
    selectHtmlElementCssPropertiesListFilter: (newValue: string) => void
    changeHtmlElementStyleTab: (newValue: string) => void
  }
}
