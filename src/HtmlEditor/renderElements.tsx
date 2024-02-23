import {
  ComponentElementTypes,
  ElementKeyType,
  ElementType,
} from './editorController/editorState'
import { StyledTreeItemProps } from '../components/treeview/CTreeItem'
import { v4 as uuid } from 'uuid'
import { ElementBox } from './ElementBox'
import { EditorStateType } from './editorController/editorState'
import { AppBar, Box, Paper } from '@mui/material'
import { mdiCodeBlockTags, mdiReact } from '@mdi/js'
import Icon from '@mdi/react'
import { baseComponents } from './editorComponents/baseComponents'
import { EditorControllerType } from './editorController/editorControllerTypes'
import React from 'react'
import { PropertyType } from './editorComponents/rawSchema'

export const isStringLowerCase = (str: string): boolean => {
  return str === str.toLowerCase()
}

export const isComponentType = (
  type: ElementKeyType
): type is ComponentElementTypes => !isStringLowerCase(type.slice(0, 1))

export const renderHtmlElements = (
  elements: ElementType[],
  editorController: EditorControllerType,
  onSelectElement: (element: ElementType, isHovering: boolean) => void,
  isProduction?: boolean,
  icons?: { [key: string]: string },
  parentId?: string,
  isPointerProduction?: boolean
): React.ReactNode => {
  const { editorState, actions, appState } = editorController

  const elementsAdj = (
    !parentId
      ? elements?.filter((el) => !el._parentId)
      : elements?.filter((el) => el._parentId === parentId)
  )?.filter((el) => el._page === editorState.ui.selected.page)

  const rawElements = elementsAdj.map((element, eIdx) => {
    const typeFirstLetter = element._type.slice(0, 1)
    const isHtmlElement = isStringLowerCase(typeFirstLetter)

    const props = (element as any)?.schema?.properties ?? {}
    const elementIconKeys = isHtmlElement
      ? []
      : Object.keys(props)?.filter(
          (key) => props[key]?.type === PropertyType.icon
        )
    const elementArrayKeys = isHtmlElement
      ? []
      : Object.keys(props)?.filter((key) => {
          const itemsProps = (props?.[key] as any)?.items?.[0]?.properties
          return (
            props[key]?.type === PropertyType.Array &&
            Object.keys(itemsProps)?.filter?.(
              (key) => itemsProps[key]?.type === PropertyType.icon
            )
          )
        })
    const elementArrayIconInjectionDict = elementArrayKeys
      .map((key) => {
        const itemsProps = (props?.[key] as any)?.items?.[0]?.properties
        return Object.keys(itemsProps)
          ?.filter((key) => itemsProps[key]?.type === PropertyType.icon)
          ?.map((itemKey) => ({ key, itemKey }))
      })
      .flat()
      ?.reduce((acc, it) => {
        return {
          ...acc,
          [it.key]: (element as any)?.props?.[it.key]?.map?.((item: any) => ({
            ...item,
            [it.itemKey]: icons?.[item[it.itemKey]],
          })),
        }
      }, {})

    // e.g. {...., icon: mdiPencil, ... }
    const injectedIconsDict = elementIconKeys?.reduce(
      (acc, key) => ({
        ...acc,
        [key]: icons?.[(element as any)?.props?.[key]],
      }),
      {}
    )

    const baseComponent = baseComponents?.find(
      (com) => com.type === element?._type
    )
    const CurrentComponent =
      baseComponent &&
      'component' in baseComponent &&
      (baseComponent.component as React.ComponentType<any>)

    const elementAdj = {
      ...element,
      props: {
        ...(((element as any)?.props as any) ?? {}),
        // ...iconInjection,
        // ...endIconInjection,
        ...injectedIconsDict,

        ...elementArrayIconInjectionDict,
      },
    }

    const navValueState = (appState as any)?.state?.[element?._id] ?? {}
    const onTabChange = (tabValue: string) => {
      appState.actions.updateProperty(element?._id, tabValue)
    }

    const elementChildren =
      editorState?.elements?.filter((el) => el._parentId === element._id) ?? []
    const tabChildren =
      element?._type === ('NavContainer' as any)
        ? (() => {
            const sourceControlElementId = (element as any)?.props
              ?.navigationElementId

            if (!sourceControlElementId) return []
            const activeTab = appState?.state?.[sourceControlElementId]
            const activeId = (element as any)?.props?.items?.find(
              (item: any) => item.value === activeTab
            )?.childId
            const activeChild = elementChildren?.find?.(
              (child) => child._id === activeId
            )
            const children = activeChild ? [activeChild] : []
            return children
          })()
        : []

    const renderedElementChildren =
      !!elementChildren?.length &&
      renderHtmlElements(
        elementChildren,
        editorController,
        onSelectElement,
        isProduction,
        icons,
        element._id,
        isPointerProduction
      )

    const TabChildren =
      !!tabChildren?.length &&
      renderHtmlElements(
        tabChildren,
        editorController,
        onSelectElement,
        isProduction,
        icons,
        element._id,
        isPointerProduction
      )

    // console.log(
    //   element._type,
    //   element,
    //   ['Tabs', 'BottomNavigation', 'ListNavigation', 'ButtonGroup'].includes(
    //     element?._type
    //   ),
    //   CurrentComponent
    // )
    return isHtmlElement ? (
      <ElementBox
        element={element}
        onSelectElement={onSelectElement}
        editorState={editorState}
        key={element._id}
        isProduction={isProduction || isPointerProduction}
      >
        {renderedElementChildren}
      </ElementBox>
    ) : // components
    isComponentType(element._type) ? (
      ['Button', 'Chip', 'Typography'].includes(element?._type) &&
      CurrentComponent ? (
        <CurrentComponent {...((elementAdj as any)?.props ?? {})} />
      ) : //  NAVIGATION ELEMENTS (slightly different interface)
      ['Tabs', 'BottomNavigation', 'ListNavigation', 'ButtonGroup'].includes(
          element?._type
        ) && CurrentComponent ? (
        <CurrentComponent
          {...((elementAdj as any)?.props ?? {})} // icon injections needed ? -> more generic approach
          onChange={onTabChange}
          value={navValueState}
        >
          {renderedElementChildren}
        </CurrentComponent>
      ) : element?._type === 'AppBar' ? (
        <AppBar
          {...((element?.props as any) ?? {})}
          sx={
            (element?.props?.position === 'fixed' ||
              !element?.props?.position) &&
            !isProduction
              ? {
                  top: 42,
                  left: 364,
                  width: 'calc(100% - 364px - 350px)',
                }
              : {}
          }
          onChange={onTabChange}
          value={navValueState}
        >
          {renderedElementChildren}
        </AppBar>
      ) : element?._type === 'Paper' ? (
        <Paper
          {...((element?.props as any) ?? {})}
          onChange={onTabChange}
          value={navValueState}
        >
          {renderedElementChildren}
        </Paper>
      ) : // Navigation Container -> specific render case (but could be component, too)
      element?._type === 'NavContainer' ? (
        (() => {
          const { children, ...childLessProps } = element?.props ?? {}
          return <Box {...(childLessProps ?? {})}>{TabChildren}</Box>
        })()
      ) : null
    ) : null
  })
  return rawElements
}

export const mapHtmlElementsToTreeItems = (
  elements: ElementType[],
  allElements: ElementType[],
  isDraggable: boolean,
  rootElements?: ElementType[],
  parentNavContainerId?: string
): StyledTreeItemProps[] => {
  const treeItems = elements.map((element, eIdx) => {
    const id = element?._id ?? uuid()

    const parentNavContainer = parentNavContainerId
      ? allElements?.find((el) => el._id === parentNavContainerId)
      : null
    const parentNavContainerItems =
      (parentNavContainer as any)?.props?.items ?? []
    const caseName = parentNavContainerItems?.find(
      (item: any) => item.childId === id
    )?.value

    const children = allElements?.filter((el) => el._parentId === id)
    return {
      _parentId: element._parentId,
      key: id,
      type: element._type,
      parentNavContainerId,
      nodeId: id,
      element,
      labelIcon: (
        <Icon
          path={
            isComponentType(element._type)
              ? baseComponents?.find((com) => com.type === element?._type)
                  ?.icon ?? mdiReact
              : mdiCodeBlockTags
          }
          size={1}
        />
      ),
      labelText:
        (parentNavContainerId ? (caseName ? '↦' + caseName + ':' : '⚠:') : '') +
        (element._type +
          ((element as any).attributes?.id ?? element?._userID
            ? `#${(element as any).attributes?.id ?? element?._userID}`
            : '')),
      children: children?.length
        ? mapHtmlElementsToTreeItems(
            children,
            allElements,
            isDraggable,
            rootElements ?? elements,
            element?._type === ('NavContainer' as any) ? id : undefined
          )
        : [],
      useDraggable: isDraggable,
    } as StyledTreeItemProps
  }) as StyledTreeItemProps[]
  return treeItems as any
}

export const getStylesFromClasses = (
  selectorId: string,
  cssSelectors: EditorStateType['cssSelectors']
): React.CSSProperties => {
  const className = cssSelectors.find((sel) => sel._id === selectorId)?._userId

  const classNames = className?.trim?.()?.split?.(' ') || []
  const cssSelector = cssSelectors?.find(
    (selector) => classNames.includes(selector._userId) // or _id?!
  )

  const classStyles = cssSelector ?? {}

  // const stylesFromClasses = classStyles?.reduce?.((acc, curr) => {
  //   return {
  //     ...acc,
  //     ...curr,
  //   };
  // }, {});
  return classStyles
}
