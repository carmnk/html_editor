import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Stack, Typography, Box, useTheme } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import { ColorPicker } from '../../../../components/color/ColorPicker'
import { CSelect } from '../../../../components/inputs/CSelect'
import { HTML_BORDER_STYLES_OPTIONS } from '../../../defs/CssBorderStyleDict'
import { borderRadiusCornerModeButtons } from '../../defs/_defCssPropertyButtonGroups'
import { ButtonGroup } from '../../../../components/buttons/ButtonGroupButton'
import { CssSizeSelector } from './CssSizeSelector'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'

export type RightMenuShapeTabProps = {
  editorController: EditorControllerType
}

const editableProps = [
  'backgroundColor',
  'color',
  'borderColor',
  'borderStyle',
  'borderWidth',
  'borderRadius',
]

export const RightMenuShapeTab = (props: RightMenuShapeTabProps) => {
  const { editorController } = props
  const {
    selectedHtmlElement2: selectedHtmlElement,
    selectedHtmlElementStyleAttributes2: elementStyles,
    actions,
  } = editorController
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement
  const theme = useTheme()

  const [ui, setUi] = useState({
    borderRadiusCornerMode:
      elementStyles?.borderRadius
        ?.toString?.()
        ?.split?.(' ')
        ?.length.toString() ?? '0',
  })

  const handleChangeStyleProp: { [key: string]: (newValue: string) => void } =
    useMemo(() => {
      const handlers = editableProps.reduce((acc, propName: string) => {
        return {
          ...acc,
          [propName]: (newValue: string) => {
            changeCurrentHtmlElementStyleAttribute(newValue, propName)
          },
        }
      }, {})
      return handlers
    }, [changeCurrentHtmlElementStyleAttribute])

  const handleChangeBorderRadiusCornerMode = useCallback(
    (newValue: string) => {
      if (!parseInt(newValue)) {
        handleChangeStyleProp.borderRadius('0')
      }
      setUi((current) => ({
        ...current,
        borderRadiusCornerMode: newValue.toString(),
      }))
    },
    [setUi, handleChangeStyleProp]
  )

  // reset borderCornerMode when changing element
  useEffect(() => {
    setUi((current) => ({
      ...current,
      borderRadiusCornerMode:
        elementStyles?.borderRadius
          ?.toString?.()
          ?.split?.(' ')
          ?.length?.toString() ?? '0',
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHtmlElement?._id])

  return (
    <>
      {/* Colors */}
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Colors
        </Typography>
        <Box>
          <CGrid gridTemplateColumns="auto auto" gap={1}>
            {/* Background */}
            <Box>Background</Box>
            <Box display="flex" justifyContent="flex-end">
              <ColorPicker
                value={elementStyles.backgroundColor}
                onChange={handleChangeStyleProp.backgroundColor}
              />
            </Box>

            <Box>Color</Box>
            <Box display="flex" justifyContent="flex-end">
              <ColorPicker
                value={elementStyles?.color}
                onChange={handleChangeStyleProp.color}
              />
            </Box>
          </CGrid>
        </Box>
      </Stack>

      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Borders
        </Typography>
        <Box>
          <CGrid gridTemplateColumns="auto auto" gap={1}>
            {/* BorderWidth */}
            <Box>BorderWidth</Box>
            <CssSizeSelector
              sizeValue={elementStyles.borderWidth as string}
              changeSizeValue={handleChangeStyleProp.borderWidth}
            />
            <Box>Color</Box>
            <Box display="flex" justifyContent="flex-end">
              <ColorPicker
                value={elementStyles?.borderColor}
                onChange={handleChangeStyleProp.borderColor}
              />
            </Box>

            <Box>Style</Box>
            <Box display="flex" justifyContent="flex-end">
              <CSelect
                disableLabel={true}
                value={elementStyles?.borderStyle}
                onChange={handleChangeStyleProp.borderStyle}
                options={HTML_BORDER_STYLES_OPTIONS}
              />
            </Box>
          </CGrid>
        </Box>
      </Stack>

      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          BorderRadius
        </Typography>
        <Box>
          <CGrid gridTemplateColumns="auto auto" gap={1}>
            <Box>Corners</Box>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup
                value={ui?.borderRadiusCornerMode || '0'}
                buttons={borderRadiusCornerModeButtons}
                onChange={handleChangeBorderRadiusCornerMode}
              />
            </Box>
            {!!parseInt(ui?.borderRadiusCornerMode) && (
              <>
                <Box>Radius</Box>
                <CssSizeSelector
                  sizeValue={elementStyles.borderRadius as string}
                  changeSizeValue={handleChangeStyleProp.borderRadius}
                />
              </>
            )}
          </CGrid>
        </Box>
      </Stack>
    </>
  )
}
