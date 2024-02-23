import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { Stack, Typography, Box, TextField, useTheme } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import {
  displayButtons,
  directionButtons,
  alignButtons,
  justifyButtons,
  positionButtons,
} from '../../defs/_defCssPropertyButtonGroups'
import { StyleSpacingSelector } from './CssSpacingSelector'
import { ButtonGroup } from '../../../../components/buttons/ButtonGroupButton'
import { CssSizeSelector } from './CssSizeSelector'
import { getSizeMode } from '../../../utils'
import { CUSTOM_CSS_PROPERTY_BUTTON_GROUP_DEFS } from '../../defs/_defCssPropertyCustomButtonGroups'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { Flex } from '../../../../components/basics/Flex'

export type RightMenuLayoutTabProps = {
  editorController: EditorControllerType
}

const editableProps = [
  'display',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'gap',
  'position',
  'width',
  'height',
  'backgroundColor',
  'color',
  'borderWidth',
  'borderColor',
  'borderStyle',
]

const { transformers, isSelectedFns } = CUSTOM_CSS_PROPERTY_BUTTON_GROUP_DEFS

export const RightMenuLayoutTab = (props: RightMenuLayoutTabProps) => {
  const { editorController } = props
  const {
    actions,
    selectedHtmlElementStyleAttributes2: elementStyles,
    selectedHtmlElement2: selectedHtmlElement,
  } = editorController
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement

  const theme = useTheme()

  const handleChangeStyleProp: { [key: string]: (newValue: string) => void } =
    useMemo(() => {
      const handlers = editableProps.reduce((acc, propName: string) => {
        return {
          ...acc,
          [propName]: (newValue: string) => {
            const valueAdj =
              propName in transformers && propName in elementStyles
                ? transformers[propName as keyof typeof transformers](
                    newValue,
                    (elementStyles as any)[propName]
                  )
                : newValue
            changeCurrentHtmlElementStyleAttribute(valueAdj, propName)
          },
        }
      }, {})
      return handlers
    }, [changeCurrentHtmlElementStyleAttribute, elementStyles])

  const handleChangeColumnGap = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e?.target?.value
      const secondValue =
        elementStyles?.gap?.toString?.()?.split?.(' ')?.[1] || '0'
      const firstValue = newValue?.replace(/\D/g, '')
      const adjValue = firstValue + 'px ' + secondValue
      changeCurrentHtmlElementStyleAttribute(adjValue, 'gap')
    },
    [changeCurrentHtmlElementStyleAttribute, elementStyles?.gap]
  )
  const handleChangeRowGap = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e?.target?.value

      const secondValue = newValue?.replace(/\D/g, '')
      const firstValue =
        elementStyles?.gap?.toString?.()?.split?.(' ')?.[0] || '0'
      const adjValue = firstValue + ' ' + secondValue + 'px'
      changeCurrentHtmlElementStyleAttribute(adjValue, 'gap')
    },
    [changeCurrentHtmlElementStyleAttribute, elementStyles?.gap]
  )

  return (
    <>
      <Stack
        gap={2}
        borderLeft={'1px solid ' + theme.palette.divider}
        // height="100%"
        p={1}
      >
        <Typography fontWeight={700} color="text.primary">
          Positioning
        </Typography>
        <Box>
          <CGrid gridTemplateColumns="auto auto" gap={1}>
            {/* Display */}
            <Box>Display</Box>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup
                isSelected={isSelectedFns.display}
                value={elementStyles.display ?? ''}
                buttons={displayButtons}
                onChange={handleChangeStyleProp.display}
                transformValue={transformers.display}
              />
            </Box>

            {/* Flexbox/Grid styles */}
            {((elementStyles?.display ?? '').includes('flex') ||
              (elementStyles?.display ?? '').includes('grid')) && (
              <>
                {/* Direction */}
                <Box>Direction</Box>
                <Box display="flex" justifyContent="flex-end">
                  <ButtonGroup
                    value={elementStyles.flexDirection ?? ''}
                    buttons={directionButtons}
                    onChange={handleChangeStyleProp.flexDirection}
                    transformValue={transformers.flexDirection}
                    isSelected={isSelectedFns.flexDirection}
                  />
                </Box>

                {/* Align */}
                <Box>Align</Box>
                <Box display="flex" justifyContent="flex-end">
                  <ButtonGroup
                    value={elementStyles.alignItems ?? ''}
                    buttons={alignButtons}
                    onChange={handleChangeStyleProp.alignItems}
                  />
                </Box>

                {/* Justify */}
                <Box>Justify</Box>
                <Box display="flex" justifyContent="flex-end">
                  <ButtonGroup
                    value={elementStyles.justifyContent ?? ''}
                    buttons={justifyButtons}
                    onChange={handleChangeStyleProp.justifyContent}
                  />
                </Box>

                {/* Gap */}
                <Box>Gap</Box>
                <Flex justifyContent="flex-end">
                  <Flex gap={0.25} width="max-content">
                    <Box width={100}>
                      <TextField
                        size="small"
                        inputProps={{ sx: { p: 0.5, px: 1 } }}
                        onChange={handleChangeColumnGap}
                        value={
                          elementStyles?.gap
                            ?.toString?.()
                            ?.split?.(' ')?.[0]
                            ?.replace(/\D/g, '') ?? ''
                        }
                      />
                    </Box>
                    <Box width={100}>
                      <TextField
                        size="small"
                        inputProps={{ sx: { p: 0.5, px: 1 } }}
                        onChange={handleChangeRowGap}
                        value={
                          elementStyles?.gap
                            ?.toString?.()
                            ?.split?.(' ')?.[1]
                            ?.replace(/\D/g, '') ?? ''
                        }
                      />
                    </Box>
                  </Flex>
                </Flex>
              </>
            )}

            {/* Poistion */}
            <Box>Position</Box>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup
                value={elementStyles.position ?? ''}
                buttons={positionButtons}
                onChange={handleChangeStyleProp.position}
              />
            </Box>

            {/* Spacing */}
            <Box>Spacing</Box>
            <StyleSpacingSelector
              elementStyles={elementStyles}
              editorController={editorController}
            />
          </CGrid>
        </Box>
      </Stack>

      {/* Size */}
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Size
        </Typography>
        <Box>
          <CGrid gridTemplateColumns="auto auto" gap={1}>
            {/* width */}
            <Box>Width</Box>
            <CssSizeSelector
              sizeValue={elementStyles.width as string}
              changeSizeValue={handleChangeStyleProp.width}
              // attributeName="width"
              // editorController={editorController}
              defaultSizeMode={getSizeMode(
                (selectedHtmlElement as any)?.attributes?.style?.width,
                'auto'
              )}
            />

            {/* height */}
            <Box>Height</Box>
            <CssSizeSelector
              // attributeName="height"
              // editorController={editorController}
              sizeValue={elementStyles.height as string}
              changeSizeValue={handleChangeStyleProp.height}
              defaultSizeMode={getSizeMode(
                (selectedHtmlElement as any)?.attributes?.style?.height,
                'auto'
              )}
            />
          </CGrid>
        </Box>
      </Stack>
    </>
  )
}
