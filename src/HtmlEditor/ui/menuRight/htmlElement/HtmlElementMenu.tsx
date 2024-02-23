import {
  Stack,
  Typography,
  Box,
  useTheme,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { CSelect } from '../../../../components/inputs/CSelect'
import { CTabs } from '../../../../components/navigation/CTabs'
import { RightMenuContentTab } from './ContentTab'
import { RightMenuLayoutTab } from './LayoutTab'
import { RightMenuShapeTab } from './ShapeTab'
import { RightMenuTypographyTab } from './TypographyTab'
import React, { useCallback, useEffect, useMemo } from 'react'
import {
  HTML_TAG_NAMES_BASIC_OPTIONS,
  HTML_TAG_NAMES_STRUCTURED_OPTIONS,
} from '../../../defs/HTMLTagNamesDict'
import { CAutoComplete } from '../../../../components/inputs/CAutoComplete'
import { RightMenuCssRuleTab } from './CssRulesTab'
import CTextField from '../../../../components/inputs/CTextField'
import { makeHtmlElementMenuTabs } from './_defHtmlElementMenuTabs'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ElementType } from '../../../editorController/editorState'
import { groupByCategory } from '../../LeftNavigationMenu/AddElementModal'
import { CommonDetailsHeader } from '../CommonHeader'
import { Flex } from '../../../../components/basics/Flex'
import { uniq } from 'lodash'

export type HtmlElementMenuProps = {
  editorController: EditorControllerType
  selectedComponent?: ElementType<'Button'>
}

const autoCompleteWidthStyle = { width: 220 }

const filteredHtmlElementOptions = HTML_TAG_NAMES_BASIC_OPTIONS.filter(
  (opt) => !['html', 'head', 'body'].includes(opt.value)
)

export const HtmlElementMenu = (props: HtmlElementMenuProps) => {
  const { editorController, selectedComponent } = props
  const {
    editorState,
    getSelectedImage,
    actions,
    selectedHtmlElement2: selectedHtmlElement,
  } = editorController
  const selectedElementAdj = selectedComponent ?? selectedHtmlElement
  const {
    changeCurrentHtmlElement,
    changeCurrentHtmlElementAttribute,
    changeCurrentElementProp,
  } = actions.htmlElement
  const { changeHtmlElementStyleTab } = actions.ui.detailsMenu

  const selectedHtmlElementStyleIntersection =
    selectedElementAdj as ElementType<'img'>

  const theme = useTheme()
  const [ui, setUi] = React.useState({
    internalHref: true,
  })

  useEffect(() => {
    setUi((prev) => ({
      ...prev,
      internalHref:
        selectedHtmlElementStyleIntersection?.attributes?.href?.startsWith?.(
          '/'
        ) ?? true,
    }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHtmlElementStyleIntersection?._id])

  const pageOptions = useMemo(() => {
    const pages = uniq(editorState?.elements?.map((el) => el._page) ?? [])
    return pages.map((page) => ({
      value: '/' + page,
      label: page,
    }))
  }, [editorState?.elements])

  const handleSwitchInternalHrefChange = useCallback(() => {
    const href = selectedHtmlElementStyleIntersection?.attributes?.href
    const pageOption = pageOptions.find((opt) => opt.value === href)
    // can only toggle back when value in field is among pageOptions
    if (!ui?.internalHref && !pageOption) {
      changeCurrentHtmlElementAttribute('href', '')
    }
    setUi((prev) => ({ ...prev, internalHref: !prev.internalHref }))
  }, [
    selectedHtmlElementStyleIntersection,
    changeCurrentHtmlElementAttribute,
    ui,
    pageOptions,
  ])

  const isOverheadHtmlElement = ['html', 'head', 'body'].includes(
    selectedElementAdj?._type ?? ''
  )

  const menuTabs = React.useMemo(() => {
    if (!selectedElementAdj) return []
    return makeHtmlElementMenuTabs({
      theme,
      selectedHtmlElement: selectedElementAdj,
      elements: editorState?.elements,
    })
  }, [theme, selectedElementAdj, editorState?.elements])

  const trimmedClassName = (
    selectedElementAdj as any
  )?.attributes?.className?.trim()
  const classNames: string[] | null = useMemo(
    () =>
      trimmedClassName
        ? trimmedClassName
            ?.split?.(' ')
            ?.map(
              (id: any) =>
                editorState.cssSelectors.find((sel) => sel._id === id.trim())
                  ?._userId
            ) || null
        : null,
    [trimmedClassName, editorState.cssSelectors]
  )

  const classNameOptions = useMemo(
    () =>
      editorState.cssSelectors
        ?.map?.((sel) => ({
          value: sel._id,
          label: sel._userId,
        }))
        ?.filter((opt) => !classNames?.includes(opt.value)),
    [classNames, editorState?.cssSelectors]
  )
  const imageSrcOptions = React.useMemo(() => {
    return editorState.assets.images?.map((image) => ({
      value: image._id,
      label: image?.fileName ?? '',
      src: image?.src,
    }))
  }, [editorState?.assets?.images])

  // HANDLERS
  const handleChangeElementType = React.useCallback(
    (newValue: string) => {
      const propName = '_type'
      changeCurrentElementProp(propName, newValue)
    },
    [changeCurrentElementProp]
  )

  const handleChangeElementId = React.useCallback(
    (value: string) => {
      const propName = 'id'
      changeCurrentHtmlElementAttribute(propName, value)
    },
    [changeCurrentHtmlElementAttribute]
  )

  const handleChangeElementClasses = React.useCallback(
    (attributeValue: string) => {
      const attributeName = 'className'
      changeCurrentHtmlElementAttribute(attributeName, attributeValue)
    },
    [changeCurrentHtmlElementAttribute]
  )

  const handleAddClass = React.useCallback(
    (newValue: string) => {
      const classToAdd = newValue?.trim() ?? ''
      if (!classToAdd) return

      const newClassNames = classNames?.length
        ? classNames
            ?.map((classId) =>
              editorState.cssSelectors.find((sel) => sel._id === classId)
            )
            ?.filter((val) => val)
            ?.join(' ') +
          ' ' +
          classToAdd
        : '' + classToAdd

      handleChangeElementClasses(newClassNames)
    },
    [classNames, handleChangeElementClasses, editorState.cssSelectors]
  )

  const handleRemoveClass = React.useCallback(
    (classname: string) => {
      const newClassNames = classNames?.filter((cn) => cn !== classname)
      const newClassName = newClassNames?.join(' ') ?? ''
      handleChangeElementClasses(newClassName)
    },
    [classNames, handleChangeElementClasses]
  )

  const handleChangeImageSource = React.useCallback(
    (newValue: string) => {
      const { imageSrcId, ...selectedImage } =
        getSelectedImage?.(newValue) ?? {}
      if (!('src' in selectedImage) || !imageSrcId) return
      const src = selectedImage?.src
      changeCurrentHtmlElement((current) => {
        const currentAttributes =
          'attributes' in current ? current.attributes : {}
        return {
          ...current,
          imageSrcId,
          attributes: { ...currentAttributes, src } as any,
        }
      })
    },
    [getSelectedImage, changeCurrentHtmlElement]
  )

  const handleChangeLinkHref = React.useCallback(
    (newValue: string | number) => {
      const attributeValue = newValue.toString() // e?.target?.value;
      const attributeName = 'href'
      changeCurrentHtmlElementAttribute(attributeName, attributeValue)
    },
    [changeCurrentHtmlElementAttribute]
  )

  // EFFECTS
  // switch tab if children have been added
  const activeStylesTab =
    editorState?.ui?.detailsMenu?.htmlElement?.activeStylesTab
  useEffect(() => {
    if (
      editorState?.elements?.find(
        (el) => el._parentId === selectedElementAdj?._id
      ) &&
      // selectedElementAdj?.children?.length &&
      activeStylesTab === 'content'
    ) {
      changeHtmlElementStyleTab('layout')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElementAdj])

  const handleChangeInternalHref = useCallback(
    (newValue: string) => {
      const newValueAdj = newValue
      console.log('CHANGE HREF TO ', newValueAdj)
      changeCurrentHtmlElementAttribute('href', newValueAdj)
    },
    [changeCurrentHtmlElementAttribute]
  )

  return (
    <>
      <Stack
        gap={2}
        borderLeft={'1px solid ' + theme.palette.divider}
        // height="100%"
        p={1}
      >
        <CommonDetailsHeader
          idPlaceholder={`<${selectedElementAdj?._type}> Set ID`}
          idValue={(selectedElementAdj as any)?.attributes?.id}
          handleChangeElementId={handleChangeElementId}
          typeLabel="HTML Element"
          typePlaceholder="Set Type"
          typeValue={selectedElementAdj?._type}
          typeDisabled={isOverheadHtmlElement}
          handleChangeElementType={handleChangeElementType}
        />

        {selectedElementAdj?._type === 'img' && (
          <Box>
            <CAutoComplete
              label="src"
              name="img_src"
              options={imageSrcOptions}
              value={
                imageSrcOptions?.find(
                  (opt) => opt.src === selectedElementAdj?.attributes?.src
                )?.value ?? ''
              }
              onChange={handleChangeImageSource}
              freeSolo={false}
              sx={autoCompleteWidthStyle}
            />
          </Box>
        )}
        {selectedElementAdj?._type === 'a' && (
          <Flex justifyContent="space-between">
            {ui?.internalHref ? (
              <Box width={220}>
                <CSelect
                  fullWidth
                  label="href"
                  name="a_href"
                  value={selectedHtmlElementStyleIntersection?.attributes?.href}
                  options={pageOptions}
                  onChange={handleChangeInternalHref}
                />
              </Box>
            ) : (
              <CTextField
                label="href"
                name="a_href"
                value={selectedHtmlElementStyleIntersection?.attributes?.href}
                onChange={handleChangeLinkHref}
              />
            )}
            <Box>
              <FormControlLabel
                value="top"
                control={
                  <Switch
                    color="primary"
                    value={ui.internalHref}
                    checked={ui.internalHref}
                    onChange={handleSwitchInternalHrefChange}
                  />
                }
                label="Internal"
                componentsProps={{ typography: { variant: 'caption' } }}
                labelPlacement="top"
              />
            </Box>
          </Flex>
        )}
        <Flex alignItems="center" gap={'0 16px'} flexWrap="wrap">
          <Typography>Classes</Typography>
          <Flex alignItems="center" gap={1} flexWrap="wrap">
            {classNames?.map?.((className) => (
              <Chip
                label={className}
                size="small"
                onDelete={() => handleRemoveClass(className)}
              />
            )) || <Chip label="No classes" color="default" size="small" />}
            <Box>
              <ClickTextField
                value={''}
                onChange={handleAddClass}
                variant="autocomplete"
                options={classNameOptions}
              />
            </Box>
          </Flex>
        </Flex>
      </Stack>

      <CTabs
        value={activeStylesTab}
        onChange={changeHtmlElementStyleTab}
        items={menuTabs}
      />

      {/* Layout */}
      {activeStylesTab === 'layout' ? (
        <RightMenuLayoutTab editorController={editorController} />
      ) : activeStylesTab === 'shape' ? (
        <RightMenuShapeTab editorController={editorController} />
      ) : activeStylesTab === 'typography' ? (
        <RightMenuTypographyTab editorController={editorController} />
      ) : activeStylesTab === 'content' ? (
        <RightMenuContentTab editorController={editorController} />
      ) : activeStylesTab === 'css_rules' ? (
        <RightMenuCssRuleTab editorController={editorController} />
      ) : null}
    </>
  )
}
