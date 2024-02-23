import { CSSProperties, HTMLProps } from 'react'
import { baseHtmlDocument } from '../defs/baseHtmlElements'
import {
  ExtendedTheme,
  muiDarkSiteTheme,
  muiLightSiteTheme,
} from '../../theme/muiTheme'
import { cloneDeep } from 'lodash'
import { SYSTEM_FONTS_CSS_STRINGS } from '../defs/CssFontFamilies'
import { BaseComponentType } from '../editorComponents/baseComponents'
import { UI_POINTER_MODE } from '../defs/uiPointerMode'
import { v4 as uuid } from 'uuid'

export type ComponentElementTypes = BaseComponentType['type']

export type ElementKeyType = keyof HTMLElementTagNameMap | ComponentElementTypes

export type GenericElementType<T extends ElementKeyType = ElementKeyType> = {
  _id: string // -> _
  _userID: string | null // -> instead of attributes.id !!! (comp: -> _) // name!
  _parentId: string | null // -> _ was children before !!!
  _content?: string // -> _
  _imageSrcId?: string // -> _
  _type: T //  -> _
  _disableDelete?: boolean
  _page: string
}

export type ComponentElementType<T extends ElementKeyType = 'Button'> =
  GenericElementType<T> & {
    props?: { [key: string]: any }
  }

export type ElementType<T extends ElementKeyType = ElementKeyType> =
  T extends keyof HTMLElementTagNameMap
    ? GenericElementType<T> & {
        attributes?: HTMLProps<HTMLElementTagNameMap[T]> // subtable
      }
    : ComponentElementType<T>

export enum EditorStateLeftMenuTabs {
  PROJECT = 'project',
  PAGE = 'page',
  CSS = 'css',
  ASSETS = 'assets',
  Image = 'image',
  Localization = 'localization',
  Theme = 'theme',
  Font = 'font',
  State = 'state',
}

export type CssWorkspaceType = {
  [classes: string]: CSSProperties
}
export type CssSelectorType = CSSProperties & {
  _id: string
  _userId: string
  _page?: string
  _type?: string
}

export type ImageType = {
  _id: string
  image: typeof Image
  src: string
  fileName: string
}

export type ProjectType = {
  project_name?: string
  project_description?: string
  project_id: string
  // _user: string -> server

  active_tab?: string
  pointer_mode?: string
  selected_css_selector?: string
  selected_element?: string
  selected_font?: string
  selected_image?: string
  selected_page?: string
  selected_state?: string
  default_theme?: string
}

export type EditorStateType = {
  project: ProjectType
  elements: ElementType[]
  cssSelectors: CssSelectorType[]
  assets: {
    images: ImageType[]
  }
  defaultTheme: 'light' | 'dark'
  // -> to be serialized later, currently only default themes
  theme: ExtendedTheme
  themes: ExtendedTheme[]
  // currently const
  fonts: string[]

  // partly serialize for now
  ui: {
    pointerMode: UI_POINTER_MODE.mixed | UI_POINTER_MODE.production
    previewMode: boolean
    selected: {
      page: string | null
      element: string | null
      cssSelector: string | null
      image: string | null
      font: string | null
      state: string | null
    }
    // dont sync yet
    detailsMenu: {
      width: number
      ruleName: string
      ruleValue: string
      addRuleName: string
      addRuleValue: string
      htmlElement: {
        editCssRuleName: string | null
        editCssRuleValue: string | null
        cssRulesFilter: 'all' | 'classes' | 'styles'
        activeStylesTab: 'layout' | 'shape' | 'typography' | 'content'
        classEditMode: boolean
      }
    }
    navigationMenu: {
      activeTab: EditorStateLeftMenuTabs
      expandedTreeItems: string[] // -> only elements!
      // dont sync rest yet
      elementAddComponentMode: string | null // remove?
      selectedTheme: string | null // change?
    }
  }
}

export const defaultPageElements = () =>
  cloneDeep(baseHtmlDocument)?.map((el) => ({
    ...el,
    _id: uuid(),
    _parentId: null,
    _userID: null,
    _type: el._type as any,
    _page: 'index',
  })) ?? []

export const defaultEditorState = (): EditorStateType => {
  return {
    defaultTheme: 'light',
    project: {
      project_id: uuid(),
    },
    elements: defaultPageElements(),
    // cssWorkspaces: {
    //   common: {},
    // },
    cssSelectors: [],
    assets: {
      images: [],
    },
    // themes2: [],
    theme: muiLightSiteTheme,
    themes: [muiLightSiteTheme, muiDarkSiteTheme] as any,
    ui: {
      previewMode: false,
      pointerMode: UI_POINTER_MODE.mixed,
      selected: {
        page: 'index',
        element: null,
        cssSelector: null,
        image: null,
        font: null,
        state: null,
      },
      detailsMenu: {
        width: 350,
        ruleName: '',
        ruleValue: '',
        addRuleName: '',
        addRuleValue: '',
        htmlElement: {
          editCssRuleName: null,
          editCssRuleValue: null,
          cssRulesFilter: 'all',
          activeStylesTab: 'layout',
          classEditMode: false,
        },
      },
      navigationMenu: {
        expandedTreeItems: [],
        activeTab: EditorStateLeftMenuTabs.PAGE,
        elementAddComponentMode: null,
        selectedTheme: null,
      },
    },
    fonts: [...SYSTEM_FONTS_CSS_STRINGS, "'Roboto'"],
  }
}
