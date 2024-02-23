import React, { useCallback, useMemo } from 'react'
import { Box } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import { ColorPicker } from '../../../../components/color/ColorPicker'
import { CSelect } from '../../../../components/inputs/CSelect'
import { HTML_FONT_STYLES_OPTIONS } from '../../../defs/CssFontStyleDict'
import { fontWeightButtons } from '../../defs/_defCssPropertyButtonGroups'
import { CssSizeSelector } from './CssSizeSelector'
import { ButtonGroup } from '../../../../components/buttons/ButtonGroupButton'

export type CssTypographySelectorProps = {
  editorController: any
  changeStyle: (newValue: string, key: string) => void
  disableSizeSelector?: boolean
  styles: { [key: string]: any }
}

export const CssTypographySelector = (props: CssTypographySelectorProps) => {
  const { editorController, changeStyle, styles, disableSizeSelector } = props
  const { editorState } = editorController

  const handleChangeFontColor = useCallback(
    (newValue: string) => {
      changeStyle(newValue, 'color')
    },
    [changeStyle]
  )

  const handleChangeFontStyle = useCallback(
    (newValue: string) => changeStyle(newValue, 'fontStyle'),
    [changeStyle]
  )
  const handleChangeFontWeight = useCallback(
    (newValue: string) => changeStyle(newValue, 'fontWeight'),
    [changeStyle]
  )

  const handleChangeFontFamily = useCallback(
    (newValue: string) => changeStyle(newValue, 'fontFamily'),
    [changeStyle]
  )
  const handleChangeFontSize = useCallback(
    (newValue: string) => changeStyle(newValue, 'fontSize'),
    [changeStyle]
  )

  const fontOptions = useMemo(() => {
    return editorState.fonts.map((font: any) => ({
      label: font,
      value: font,
    }))
  }, [editorState.fonts])

  return (
    <CGrid gridTemplateColumns="auto auto" gap={1}>
      {!disableSizeSelector && (
        <>
          <Box>Size</Box>
          <CssSizeSelector
            sizeValue={styles.fontSize}
            changeSizeValue={handleChangeFontSize}
          />
        </>
      )}

      {/* Color */}
      <Box>Color</Box>
      <Box display="flex" justifyContent="flex-end">
        <ColorPicker value={styles.color} onChange={handleChangeFontColor} />
      </Box>
      <Box>Weight</Box>
      <Box display="flex" justifyContent="flex-end">
        <ButtonGroup
          // isSelected={elementStyles.fontWeight}
          value={styles.fontWeight ?? ''}
          buttons={fontWeightButtons as any}
          onChange={handleChangeFontWeight}
          // transformValue={transformers.display}
        />
      </Box>

      <Box>Style</Box>
      <Box display="flex" justifyContent="flex-end">
        <CSelect
          disableLabel={true}
          value={styles?.fontStyle}
          onChange={handleChangeFontStyle}
          options={HTML_FONT_STYLES_OPTIONS}
        />
      </Box>

      <Box>Font Family</Box>
      <Box display="flex" justifyContent="flex-end">
        <CSelect
          disableLabel={true}
          value={styles?.fontFamily}
          onChange={handleChangeFontFamily}
          options={fontOptions}
        />
      </Box>
    </CGrid>
  )
}
