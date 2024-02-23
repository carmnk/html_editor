import { Chip, Stack, Typography, useTheme } from '@mui/material'
import React, { useCallback } from 'react'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { ElementType } from '../../../editorController/editorState'
import { GenericForm } from '../../../../components/forms/GenericForm'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { Button } from '../../../../components/buttons/Button/Button'
import { mdiDevices, mdiFormatText } from '@mdi/js'
import { SYSTEM_FONTS_NAMES } from '../../../defs/CssFontFamilies'

export type HtmlElementMenuProps = {
  editorController: EditorControllerType
}

export const FontMenu = (props: HtmlElementMenuProps) => {
  const { editorController } = props
  const {
    editorState,
    actions,
    selectedHtmlElement2: selectedHtmlElement,
    selectedHtmlElement2,
  } = editorController
  const { changeCurrentElementProp } = actions.htmlElement
  const selectedComponent = selectedHtmlElement2 as ElementType<'Button'>

  // const [formData, setFormData] = React.useState<any>({});

  const theme = useTheme()

  // HANDLERS

  const handleChangeElementId = React.useCallback(
    (value: string) => {
      const propName = '_userID'
      changeCurrentElementProp(propName, value)
    },
    [changeCurrentElementProp]
  )

  const selectedFontName =
    editorState.ui.selected.font
      ?.split(',')?.[0]
      ?.replaceAll("'", '')
      ?.replaceAll('"', '') ?? ''
  const fallBackFonts = editorState.ui.selected.font
    ?.split(',')
    ?.slice?.(1)
    ?.map?.((font) => font.replaceAll("'", '').replaceAll('"', ''))

  return (
    editorState.ui.selected.font && (
      <>
        <Stack
          gap={1}
          borderLeft={'1px solid ' + theme.palette.divider}
          // height="100%"
          p={1}
        >
          {/* <ClickTextField
          value={selectedComponent?._userID ?? "Set ID"}
          onChange={handleChangeElementId}
          disabled={true}
        /> */}
          <Stack direction={'row'} gap={1} alignItems="center">
            <Button
              type="text"
              iconButton={true}
              icon={
                SYSTEM_FONTS_NAMES?.includes(selectedFontName)
                  ? mdiDevices
                  : mdiFormatText
              }
              disabled
              tooltip={
                SYSTEM_FONTS_NAMES?.includes(selectedFontName)
                  ? 'System Font'
                  : 'Asset Font (will be included in app)'
              }
            />
            <Typography
              // fontWeight={700}
              color="text.primary"
              // variant="h6"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              variant="h5"
              // {...typographyProps}
            >
              {selectedFontName}
            </Typography>
          </Stack>
          <Typography>Fallback Fonts: </Typography>
          <Stack direction={'row'} gap={1}>
            {fallBackFonts?.map((font, fIdx) => (
              <Chip size="small" label={font} key={font} />
            ))}
          </Stack>
          <Typography fontFamily={editorState.ui.selected.font}>
            abcdefghijklmnopqrstuvwxyz
            <br /> ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br /> 0123456789
          </Typography>
        </Stack>
      </>
    )
  )
}
