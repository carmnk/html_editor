import {
  EditorStateType,
  ElementKeyType,
  ProjectType,
} from '../editorController/editorState'
import { v4 as uuid } from 'uuid'
import {
  reloadSerializedThemes,
  transformEditorStateTheme,
} from './transformEditorStateTheme'
import { baseComponents } from '../editorComponents/baseComponents'
import { isComponentType } from '../renderElements'

export type EditorStatePayloadType = Omit<
  EditorStateType,
  'fonts' | 'theme' | 'themes'
> & {
  project: ProjectType
}

export type SerializedThemeType = {
  id: string
  project_id: string
  name: string
  // palette
  primary_main: string
  primary_light: string
  primary_dark: string
  primary_contrastText: string
  secondary_main: string
  secondary_light: string
  secondary_dark: string
  secondary_contrastText: string
  error_main: string
  error_light: string
  error_dark: string
  error_contrastText: string
  warning_main: string
  warning_light: string
  warning_dark: string
  warning_contrastText: string
  info_main: string
  info_light: string
  info_dark: string
  info_contrastText: string
  success_main: string
  success_light: string
  success_dark: string
  success_contrastText: string
  text_primary: string
  text_secondary: string
  text_disabled: string
  background_default: string
  background_paper: string
  action_active: string
  action_hover: string
  action_selected: string
  action_disabled: string
  action_disabled_background: string
  action_focus: string
}

export type EditorStateDbDataType = {
  project: ProjectType
  elements: {
    element_id: string
    element_html_id: string | null
    project_id: string
    parent_id: string | null
    content: string | null
    image_src_id: string | null
    element_type: string
    element_disable_delete: boolean | null
    element_page: string | null
  }[]
  props: {
    element_id: string
    prop_name: string
    prop_value: string
    project_id: string
  }[]
  attributes: {
    element_id: string
    attr_name: string
    attr_value: string
    project_id: string
  }[]
  cssSelectors: {
    css_selector_id: string
    css_selector_name: string
    project_id: string
  }[]
  images: {
    asset_id: string
    // image: typeof Image
    // src: string
    asset_filename: string
    project_id: string
  }[]
  imageFiles?: {
    asset_id: string
    image: File
    // src: string
    // fileName: string
  }[]
  themes: SerializedThemeType[]
}

export const transformEditorStateToPayload = (
  payload: EditorStateType
): EditorStateDbDataType | null => {
  const projectIn = payload?.project ?? {}
  const project_id = projectIn.project_id
  if (!project_id) {
    alert('project_id is missing')
    console.log(
      'project_id is missing:',
      projectIn,
      `(projectIn)`,
      payload,
      `(payload)`
    )
    return null
  }
  const uiIn = payload.ui as Omit<EditorStateType['ui'], 'detailsMenu'>
  const {
    page = null,
    cssSelector = null,
    image = null,
    state = null,
    element = null,
    font = null,
  } = uiIn.selected
  // save with project
  const uiOut = {
    selected_page: page,
    selected_css_selector: cssSelector,
    selected_image: image,
    selected_state: state,
    selected_element: element,
    selected_font: font,
    active_tab: uiIn?.navigationMenu?.activeTab ?? null,
    pointer_mode: uiIn?.pointerMode ?? null,
  }
  const projectOut = {
    ...projectIn,
    ...uiOut,
    default_theme: payload.defaultTheme,
  }
  // insert project and retrieve id

  const elementsIn = payload?.elements || []
  const elementsOut = elementsIn.map((element) => {
    return {
      element_id: element._id,
      element_html_id: element?._userID ?? null,
      project_id,
      // _user,
      parent_id: element?._parentId ?? null,
      content: element?._content ?? null,
      image_src_id: element?._imageSrcId ?? null,
      element_type: element?._type ?? null,
      element_disable_delete: element?._disableDelete ?? null,
      element_page: element?._page ?? null,
    }
  })

  // stringify props and attributes if value is objectish
  const props =
    elementsIn
      ?.map?.((el) =>
        'props' in el && el.props
          ? Object.keys(el.props)
              .map((key) => {
                const prop_value_raw = (el.props as any)?.[key]
                const prop_value = ['function', 'object'].includes(
                  typeof prop_value_raw
                )
                  ? JSON.stringify(prop_value_raw)
                  : prop_value_raw
                return {
                  prop_id: uuid(),
                  element_id: el._id,
                  prop_name: key,
                  prop_value,
                  project_id,
                  // _user,
                }
              })
              ?.filter((prop) => prop.prop_value && prop.prop_name)
          : []
      )
      ?.flat() ?? []

  const attributes =
    elementsIn
      ?.map?.((el) =>
        'attributes' in el && el.attributes
          ? Object.keys(el.attributes)
              .map((key) => {
                const attr_value_raw = (el.attributes as any)?.[key]
                const matchingImageSrcSerializes =
                  (key === 'src' &&
                    typeof attr_value_raw === 'string' &&
                    payload.assets.images?.find(
                      (img) => img.src === attr_value_raw
                    )?._id) ||
                  null
                const attr_value = matchingImageSrcSerializes
                  ? matchingImageSrcSerializes
                  : ['function', 'object'].includes(typeof attr_value_raw)
                  ? JSON.stringify(attr_value_raw)
                  : attr_value_raw

                return {
                  attr_id: uuid(),
                  element_id: el._id,
                  attr_name: key,
                  attr_value,
                  project_id,
                  // _user,
                }
              })
              ?.filter((attr) => attr.attr_value && attr.attr_name)
          : []
      )
      ?.flat() ?? []

  const cssSelectorsIn = payload?.cssSelectors || []
  const cssSelectorsOut = cssSelectorsIn.map((cssSelector) => {
    return {
      css_selector_id: cssSelector._id,
      css_selector_name: cssSelector?._userId ?? [],
      project_id,
      // _user,
      //   selector_page?: string
      //   selector_type?: string
    }
  })

  // seperate handling! -> must be multipart form data!!!!
  const images = payload.assets.images?.map((image) => {
    return {
      asset_id: image._id,
      // image: typeof Image
      // src: string
      project_id,
      asset_filename: image.fileName,
    }
  })
  const imageFiles = payload.assets.images
    ?.filter((img) => (img as any)._upload)
    ?.map((image) => {
      return {
        asset_id: image._id,
        image: image.image as any,
        // src: string
        //   fileName: image.fileName,
      }
    })

  const themes: EditorStateDbDataType['themes'] = transformEditorStateTheme(
    payload.themes,
    project_id
  )
  return {
    project: projectOut as any,
    elements: elementsOut,
    props,
    attributes,
    cssSelectors: cssSelectorsOut,
    images,
    imageFiles,
    themes,
  }
}

export const transformEditorStateFromPayload = (
  data: EditorStateDbDataType,
  currentEditorState: EditorStateType,
  disableThemeReload = false
): EditorStateType => {
  const {
    selected_css_selector,
    selected_element,
    selected_font,
    selected_image,
    selected_page,
    selected_state,
    active_tab,
    pointer_mode,
    default_theme: defaultTheme,
    ...project
  } = data.project

  const ui = {
    ...currentEditorState.ui,
    selected: {
      ...currentEditorState.ui.selected,
      cssSelector: selected_css_selector ?? null,
      element: selected_element ?? null,
      font: selected_font ?? null,
      image: selected_image ?? null,
      page: selected_page ?? null,
      state: selected_state ?? null,
    },
    navigationMenu: {
      ...currentEditorState.ui.navigationMenu,
      activeTab: active_tab as any,
    },
    pointerMode: pointer_mode as any,
  }

  const newImageAssets = {
    images: data?.images?.map?.((image) => ({
      ...((currentEditorState?.assets?.images?.find?.(
        (img) => img._id === image.asset_id
      ) ?? {}) as any),
      _id: image.asset_id,
      fileName: image.asset_filename,
      created_datetime: (image as any).created_datetime,
      edited_datetime: (image as any).edited_datetime,
      // src:
    })),
  }
  return {
    ...currentEditorState,
    defaultTheme: defaultTheme as any,
    project,
    elements:
      data?.elements?.map?.((el) => ({
        ...(isComponentType(el.element_type as ElementKeyType)
          ? baseComponents.find((bc) => bc.type === el.element_type)
          : {}),
        _id: el.element_id,
        _userID: el.element_html_id,
        _parentId: el.parent_id,
        _content: el.content as any,
        _imageSrcId: el.image_src_id ?? undefined,
        _type: el.element_type as any,
        _disableDelete: el.element_disable_delete ?? undefined,
        _page: el.element_page as string,
        props: data?.props
          ?.filter?.((prop) => prop.element_id === el.element_id)
          ?.reduce((acc, prop) => {
            const value =
              prop.prop_name === 'items'
                ? JSON.parse(prop.prop_value)
                : prop.prop_value
            return { ...acc, [prop.prop_name]: value }
          }, {}),
        attributes: data?.attributes
          ?.filter?.((attr) => attr.element_id === el.element_id)
          ?.reduce((acc, attr) => {
            const value =
              attr.attr_name === 'style' && typeof attr.attr_value === 'string'
                ? JSON.parse(attr.attr_value)
                : attr.attr_value
            return {
              ...acc,
              [attr.attr_name]: value,
            }
          }, {}),
      })) ?? [],
    cssSelectors:
      data?.cssSelectors?.map?.((cssSelector) => ({
        ...cssSelector,
        _id: cssSelector.css_selector_id,
        _userId: cssSelector.css_selector_name,
      })) ?? [],
    ui,
    assets: newImageAssets,
    themes: disableThemeReload
      ? (data.themes as any)
      : reloadSerializedThemes(data.themes as any, currentEditorState.themes),
  }
}
