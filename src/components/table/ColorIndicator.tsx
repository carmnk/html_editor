import React from 'react'
import { Box } from '@mui/material'
import { EllipsisTextWithTooltip } from '../EllipsisTooltip'
import { ActionsMenu } from '../ActionsMenu'

export type ColorIndicatorColors = 'green' | 'red' | 'blue' | 'yellow' | 'white' | 'orange'

export type ColorIndicatorProps = {
  color?: ColorIndicatorColors
  onClick?: (e: any) => any
  label: string
  onSelectMenuItem?: (item: any) => any
  menuItems?: { value: string; label: string | React.ReactNode }[]
  disabled?: boolean
  disableTabstop?: boolean
  children?: any
}

const greenStyle = {
  background: 'rgba(0, 132, 0, 0.22)',
  color: '#007500',
}
const blueStyle = {
  background: 'rgba(38,75,150,.22)',
  color: '#005ACD',
}
const redStyle = {
  background: 'rgba(212, 32, 46, 0.22)',
  color: '#C8061C',
}
// const darkRedStyle = {
//   background: 'rgba(133,61,58,.22)',
//   color: '#853d3a',
// }
const yellowStyle = {
  background: 'rgba(246, 188, 0, 0.3)',
  color: '#846900',
}
const orangeStyle = {
  background: 'rgba(241,161,81,.22)',
  color: '#f1a151',
}
const whiteStyle = {
  background: 'rgba(162, 162, 162, 0.22)',
  color: '#212529',
}
const transparentStyle = {
  background: 'transparent',
  color: '#007500',
}

const styles = {
  position: 'relative',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontSize: '0.75rem',
  lineHeight: '1rem',
  fontWeight: 700,
  borderRadius: '4px',
  // display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '30px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}
const disabledStyles = { ...styles, cursor: 'auto' }

export const ColorIndicator = (props: ColorIndicatorProps) => {
  const { color, onClick, label, onSelectMenuItem, menuItems, disabled, disableTabstop, children } = props
  const alwaysPointerCursorInt = !!onClick
  const [open, setOpen] = React.useState<any>(null)

  const indicatorStyles = React.useMemo(() => {
    const colorStyle =
      color === 'green'
        ? greenStyle
        : color === 'blue'
        ? blueStyle
        : color === 'red'
        ? redStyle
        : color === 'orange'
        ? orangeStyle
        : color === 'white'
        ? whiteStyle
        : color === 'yellow'
        ? yellowStyle
        : color === 'transparent'
        ? transparentStyle
        : {}
    const isButton = menuItems?.length
    const defaultStyles = disabled || !isButton || onClick ? disabledStyles : styles
    return { ...defaultStyles, ...colorStyle }
  }, [color, disabled, menuItems?.length, alwaysPointerCursorInt])

  const handleCloseMenu = React.useCallback(() => {
    setOpen(false)
  }, [])
  const handleOpenMenu = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setOpen(e?.target)
      }
      onClick?.(e)
    },
    [onClick, disabled]
  )

  const handleSelectEachMenuItem = React.useMemo(
    () =>
      menuItems?.map((item) => () => {
        onSelectMenuItem?.(item)
        setOpen(null)
      }),
    [menuItems, onSelectMenuItem]
  )

  return (
    <>
      <Box
        component="button"
        width="100%"
        p="8px"
        overflow="hidden"
        sx={indicatorStyles}
        onClick={handleOpenMenu}
        tabIndex={disableTabstop ? -1 : 0}
      >
        {children || <EllipsisTextWithTooltip label={label} />}
      </Box>
      {!!menuItems?.length && !disabled && (
        <ActionsMenu
          // PaperProps={{
          //   sx: { width: openStatus?.width },
          // }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          onClose={handleCloseMenu}
          items={menuItems?.map?.((item, iIdx) => ({
            label: typeof item?.label !== 'string' ? item?.label : <EllipsisTextWithTooltip label={item?.label} />,
            onClick: handleSelectEachMenuItem?.[iIdx],
          }))}
        />
      )}
    </>
  )
}
