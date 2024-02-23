import React, { useCallback, useMemo } from 'react'
import { Stack, Typography, Box, useTheme } from '@mui/material'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { CssTypographySelector } from './CssTypographySelector'

export type RightMenuTypographyTabProps = {
  editorController: EditorControllerType
}

export const RightMenuTypographyTab = (props: RightMenuTypographyTabProps) => {
  const { editorController } = props
  const {
    selectedHtmlElementStyleAttributes2: elementStyles,
    actions,
    editorState,
  } = editorController
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement
  const theme = useTheme()

  const handleChangeFontColor = useCallback(
    (newValue: string) => {
      changeCurrentHtmlElementStyleAttribute(newValue, 'color')
    },
    [changeCurrentHtmlElementStyleAttribute]
  )

  const handleChangeFontStyle = useCallback(
    (newValue: string) =>
      changeCurrentHtmlElementStyleAttribute(newValue, 'fontStyle'),
    [changeCurrentHtmlElementStyleAttribute]
  )
  const handleChangeFontWeight = useCallback(
    (newValue: string) =>
      changeCurrentHtmlElementStyleAttribute(newValue, 'fontWeight'),
    [changeCurrentHtmlElementStyleAttribute]
  )

  const handleChangeFontFamily = useCallback(
    (newValue: string) =>
      changeCurrentHtmlElementStyleAttribute(newValue, 'fontFamily'),
    [changeCurrentHtmlElementStyleAttribute]
  )

  const fontOptions = useMemo(() => {
    return editorState.fonts.map((font) => ({
      label: font,
      value: font,
    }))
  }, [editorState.fonts])

  return (
    <>
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Font
        </Typography>
        <Box>
          <CssTypographySelector
            styles={elementStyles}
            
            editorController={editorController}
            changeStyle={changeCurrentHtmlElementStyleAttribute}
          />
        </Box>
      </Stack>
    </>
  )
}
