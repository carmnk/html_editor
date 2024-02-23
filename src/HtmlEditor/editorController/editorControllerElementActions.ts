import { cloneDeep } from 'lodash'
import { CSSProperties, useCallback, Dispatch, SetStateAction } from 'react'
import {
  EditorStateType,
  ComponentElementTypes,
  ElementType,
} from './editorState'
import { v4 as uuid } from 'uuid'
import { baseComponents } from '../editorComponents/baseComponents'
import {
  EditorControllerAppStateReturnType,
  EditorControllerHtmlElementActionsType,
  EditorControllerType,
} from './editorControllerTypes'

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  selectedPageHtmlElements: EditorControllerType['selectedPageHtmlElements2']
  selectedHtmlElement: EditorControllerType['selectedHtmlElement2'] | null
  selectedHtmlElementStyleAttributes: CSSProperties | null
  appState: EditorControllerAppStateReturnType
}

export const useEditorControllerElementActions = (
  params: EditorControllerHtmlElementActionsParams
): EditorControllerHtmlElementActionsType => {
  const {
    editorState,
    setEditorState,
    selectedPageHtmlElements,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes,
    appState,
  } = params
  const handleChangeCurrentHtmlElement = useCallback(
    (
      newHtmlElementIn: ElementType | ((current: ElementType) => ElementType)
    ) => {
      if (!selectedHtmlElement) return
      const newHtmlElement =
        typeof newHtmlElementIn === 'function'
          ? newHtmlElementIn(selectedHtmlElement)
          : newHtmlElementIn

      setEditorState((current) => {
        const currentElement = current.elements.find(
          (el) => el._id === newHtmlElement._id
        )
        const newStateNewElement: ElementType = {
          ...newHtmlElement,
          _parentId: currentElement?._parentId ?? null,
        }
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === newHtmlElement._id ? newStateNewElement : el
          ),
        }
      })
    },
    [setEditorState, selectedHtmlElement]
  )

  const swapHtmlElements = useCallback(
    (elementId: string, targetElementId: string) => {
      setEditorState((current) => {
        const element1 = cloneDeep(
          current.elements.find((el) => el._id === elementId)
        )
        const element2 = cloneDeep(
          current.elements.find((el) => el._id === targetElementId)
        )
        if (!element1 || !element2) return current
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === elementId
              ? element2
              : el._id === targetElementId
              ? element1
              : el
          ),
        }
      })
    },
    [setEditorState]
  )

  const deleteElement = useCallback(
    (id: string | number) => {
      setEditorState((current) => ({
        ...current,
        elements: current.elements.filter((el) => el._id !== id),
      }))
    },
    [setEditorState]
  )

  const insertElementIntoElement = useCallback(
    (elementId: string, targetElementId: string) => {
      setEditorState((current) => {
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === elementId
              ? {
                  ...el,
                  _parentId: targetElementId,
                }
              : el
          ),
        }
      })
    },
    [setEditorState]
  )

  const handleChangeCurrentHtmlElementStyleAttribute = useCallback(
    (ruleValue: string, ruleName: string) => {
      if (!selectedHtmlElement) return

      handleChangeCurrentHtmlElement((current) => {
        const currentAttributes =
          'attributes' in current ? current.attributes : {}
        const newAttributes = {
          ...currentAttributes,
          style: {
            ...(currentAttributes?.style ?? {}),
            [ruleName]: ruleValue,
          },
        }
        return {
          ...current,
          attributes: newAttributes as any,
        }
      })
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  )

  const removeCurrentHtmlElementStyleAttribute = useCallback(
    (ruleName: string) => {
      if (!selectedHtmlElement) return
      handleChangeCurrentHtmlElement((current) => {
        const currentAttributes =
          'attributes' in current ? current.attributes : {}
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          [ruleName as keyof CSSProperties]: rOut,
          ...attributesExRemoved
        } = currentAttributes?.style ?? {}
        return {
          ...current,
          attributes: {
            ...(currentAttributes as any),
            style: attributesExRemoved,
          },
        }
      })
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  )

  const handleChangeCurrentHtmlElementAttribute = useCallback(
    (attributeName: string, attributeValue: string) => {
      handleChangeCurrentHtmlElement((current) => {
        const currentAttributes =
          'attributes' in current ? current.attributes : {}
        const newAttributes = {
          ...currentAttributes,
          [attributeName]: attributeValue,
        }
        return {
          ...current,
          attributes: newAttributes as any,
        }
      })
    },
    [handleChangeCurrentHtmlElement]
  )

  const changeCurrentElementProp = useCallback(
    (propName: keyof ElementType, propValue: string, elementId?: string) => {
      handleChangeCurrentHtmlElement((current) => {
        return {
          ...current,
          [propName]: propValue,
        }
      })
    },
    [handleChangeCurrentHtmlElement]
  )

  const changeElementProp = useCallback(
    (elementId: string, propName: keyof ElementType, propValue: string) => {
      setEditorState((current) => ({
        ...current,
        elements: current.elements.map((el) =>
          el._id === elementId
            ? {
                ...el,
                [propName]: propValue,
              }
            : el
        ),
      }))
    },
    [setEditorState]
  )

  const toggleHtmlElementEditCssRule = useCallback(
    (attributeName: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              editCssRuleName: current.ui.detailsMenu.htmlElement
                ?.editCssRuleName
                ? null
                : attributeName,
              editCssRuleValue: current.ui.detailsMenu.htmlElement
                ?.editCssRuleName
                ? null
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (selectedHtmlElementStyleAttributes as any)?.[
                    attributeName
                  ] ?? '',
            },
          },
        },
      }))
    },
    [selectedHtmlElementStyleAttributes, setEditorState]
  )

  const handleChangeHtmlElementEditedCssRuleValue = useCallback(
    (newValue: string, activeEditRule: string) => {
      handleChangeCurrentHtmlElementStyleAttribute(
        newValue,
        activeEditRule ?? ''
      )
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              editCssRuleName: null,
              editCssRuleValue: null,
            },
          },
        },
      }))
    },
    [handleChangeCurrentHtmlElementStyleAttribute, setEditorState]
  )

  const addHtmlChild = useCallback(
    (currentElementId: string, newElementType?: string) => {
      setEditorState((current) =>
        !current.ui.selected.page
          ? current
          : {
              ...current,

              elements: [
                ...current.elements,
                {
                  _id: uuid(),
                  _type: (newElementType as any) ?? 'div',
                  _parentId: currentElementId,
                  _page: current.ui.selected.page,
                  _userID: '',
                  attributes: {},
                },
              ],
              ui: {
                ...current.ui,
                navigationMenu: {
                  ...current.ui.navigationMenu,
                  expandedTreeItems:
                    current.ui.navigationMenu?.expandedTreeItems?.includes(
                      currentElementId
                    )
                      ? current.ui.navigationMenu?.expandedTreeItems
                      : [
                          ...(current.ui.navigationMenu?.expandedTreeItems ??
                            []),
                          currentElementId,
                        ],
                },
              },
            }
      )
    },
    [setEditorState]
  )
  const addComponentChild = useCallback(
    (newValue: string, type: ComponentElementTypes) => {
      const defaultComponentProps = baseComponents.find(
        (comp) => comp.type === type
      )
      const _id = uuid()
      setEditorState((current) =>
        !current.ui.selected.page
          ? current
          : {
              ...current,
              elements: [
                ...current.elements,
                {
                  props: {},
                  ...defaultComponentProps, // -> TODO -> untangle instance and template
                  _id,
                  _page: current.ui.selected.page,
                  _userID: '',
                  // _content: newElement.content,
                  _type: type,
                  // _imageSrcId: newElement.imageSrcId,
                  // attributes: newElement.attributes,
                  _parentId: newValue,
                },
              ],
              ui: {
                ...current.ui,
                navigationMenu: {
                  ...current.ui.navigationMenu,
                  expandedTreeItems:
                    current.ui.navigationMenu?.expandedTreeItems?.includes(
                      newValue
                    )
                      ? current.ui.navigationMenu.expandedTreeItems
                      : [
                          ...(current.ui.navigationMenu.expandedTreeItems ??
                            []),
                          newValue,
                        ],
                },
              },
            }
      )
      if ('state' in (defaultComponentProps ?? {})) {
        appState.actions.addProperty(_id, (defaultComponentProps as any)?.state ?? '')
      }
    },
    [setEditorState, appState]
  )

  const changeSelectedComponentProp = useCallback(
    (key: string, value: any) => {
      if (!selectedHtmlElement) return
      // TODO: Generic approad
      if (key === 'items') {
        const newTabNames = value
          .map((tab: any) => tab.value)
          ?.sort((a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0))
        const currentTabNames =
          (selectedHtmlElement as any)?.props?.items?.map?.(
            (tab: any) => tab.value
          ) || []
        // const currentTabNames = appState.values?.[selectedHtmlElement.id]?.sort(
        //   (a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0)
        // );

        // Tabs are different!
        if (newTabNames?.join('') !== currentTabNames?.join('')) {
          // change state value in NavContainers
          console.log('CHANGE NavContainer, too and current tab if needed!')
        }
      }
      handleChangeCurrentHtmlElement((current) => {
        return {
          ...current,
          props: {
            ...((current as any).props ?? {}),
            [key]: value,
          },
        }
      })
    },
    [handleChangeCurrentHtmlElement, selectedHtmlElement]
  )

  const changeComponentProp = useCallback(
    (elementId: string, key: string, value: any) => {
      setEditorState((current) => ({
        ...current,
        elements: current.elements.map((el) =>
          el._id === elementId
            ? {
                ...el,
                props: {
                  ...((el as any).props ?? {}),
                  [key]: value,
                },
              }
            : el
        ),
      }))
    },
    [setEditorState]
  )

  return {
    changeHtmlElementEditedCssRuleValue:
      handleChangeHtmlElementEditedCssRuleValue,
    changeCurrentHtmlElement: handleChangeCurrentHtmlElement,
    changeCurrentHtmlElementStyleAttribute:
      handleChangeCurrentHtmlElementStyleAttribute,
    changeCurrentHtmlElementAttribute: handleChangeCurrentHtmlElementAttribute,
    changeCurrentElementProp,
    changeElementProp,
    deleteElement,
    addHtmlChild,
    toggleHtmlElementEditCssRule,
    removeCurrentHtmlElementStyleAttribute,
    addComponentChild,
    changeSelectedComponentProp,
    swapHtmlElements,
    insertElementIntoElement,
    changeComponentProp,
  }
}
