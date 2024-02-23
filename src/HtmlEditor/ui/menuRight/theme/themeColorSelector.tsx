import { Box, Typography } from '@mui/material'
import { CGrid } from '../../../../components/basics/CGrid'
import { ColorPicker } from '../../../../components/color/ColorPicker'
import { useCallback } from 'react'

export type ThemeColorSelectorProps = {
  colorName: string
  light: string
  main: string
  dark: string
  contrastText: string
  onChange: (newValue: string, variant: 'light' | 'main' | 'dark') => void
}

export const ThemeColorSelector = (props: ThemeColorSelectorProps) => {
  const { colorName, light, main, dark, contrastText, onChange } = props

  // const handleChangeLight = useCallback(
  //   (newValue: string) => {
  //     onChange(newValue, "light");
  //   },
  //   [onChange]
  // );
  const handleChangeMain = useCallback(
    (newValue: string) => {
      onChange(newValue, 'main')
    },
    [onChange]
  )
  // const handleChangeDark = useCallback(
  //   (newValue: string) => {
  //     onChange(newValue, "dark");
  //   },
  //   [onChange]
  // );

  const disabledSelectorSize = 21
  return (
    <Box position="relative">
      <CGrid
        gridTemplateColumns="auto 80px 28px"
        alignItems="center"
        position="relative"
        gap={'8px 0'}
      >
        <Box>{colorName}</Box>
        <Typography
          variant="body2"
          justifyContent="space-between"
          color="action.disabled"
        >
          light
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ColorPicker
            value={light}
            disabled={true}
            selectorSize={disabledSelectorSize}
          />
        </Box>
        <Box />
        <Typography variant="body2">main</Typography>
        <ColorPicker value={main} onChange={handleChangeMain} />
        <Box />
        <Typography variant="body2" color="action.disabled">
          dark
        </Typography>{' '}
        <Box display="flex" justifyContent="center" alignItems="center">
          <ColorPicker
            value={dark}
            disabled={true}
            selectorSize={disabledSelectorSize}
          />
        </Box>
        <Box />
        <Typography variant="body2" color="action.disabled">
          contrastText
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ColorPicker
            value={contrastText}
            disabled={true}
            selectorSize={disabledSelectorSize}
          />
        </Box>
      </CGrid>
    </Box>
  )
}
