import React, { Fragment, useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import { ColorPicker } from '../../../../components/color/ColorPicker'

export type ThemeColorSelectorProps = {
  colorName: string
  color: { [key: string]: string } | string
  onChange: (newValue: string, variant: string) => void
}

export const ThemeOtherColorSelector = (props: ThemeColorSelectorProps) => {
  const { colorName, color, onChange } = props

  const colorKeys = Object.keys(color).sort((a, b) => (a > b ? 1 : -1))
  const colorsAdj = useMemo(
    () =>
      typeof color === 'string' ? [color] : colorKeys.map((key) => color[key]),
    [color, colorKeys]
  )

  const handleChangeMain = useMemo(
    () =>
      colorsAdj.map((col, cIdx) => (newValue: string) => {
        onChange?.(newValue, colorKeys?.[cIdx])
      }),

    [onChange, colorKeys, colorsAdj]
  )

  return (
    <Box position="relative">
      <CGrid
        gridTemplateColumns="auto 80px 28px"
        alignItems="center"
        position="relative"
        gap={'8px 0'}
      >
        <Box>{colorName}</Box>
        {colorsAdj.map((col, cIdx) => {
          return (
            <Fragment key={cIdx}>
              {!!cIdx && <Box />}
              <Typography variant="body2" justifyContent="space-between">
                {colorKeys?.[cIdx]}
              </Typography>
              <ColorPicker value={col} onChange={handleChangeMain?.[cIdx]} />
            </Fragment>
          )
        })}
      </CGrid>
    </Box>
  )
}
