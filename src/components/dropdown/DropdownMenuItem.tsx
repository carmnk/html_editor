import React from 'react'
import {
  MenuItem,
  Tooltip,
  Stack,
  CircularProgress,
  useTheme,
  Divider,
  Typography,
} from '@mui/material'
import Icon from '@mdi/react'

export type DropDownMenuItemProps = {
  onClick: (e: React.MouseEventHandler<HTMLLIElement>) => void
  tooltip?: React.ReactNode
  icon?: React.ReactNode
  id: string
  disabled?: boolean
  loading?: boolean
  label: string
  onPointerDown?: any
  onKeyDown?: any
}

export const SlimDivider = () => (
  <Divider
    sx={{ mt: '0px !important', mb: '0px !important' }}
    key={'menu-offer-divider'}
  />
)

export const DropdownMenuItem = (props: DropDownMenuItemProps) => {
  const {
    onClick,
    tooltip,
    id,
    icon,
    disabled,
    loading,
    label,
    onPointerDown,
    onKeyDown,
  } = props
  const theme = useTheme()

  const handleOnClick = React.useCallback(
    (e: any) => {
      if (disabled || loading) return
      onClick(e)
    },
    [disabled, loading, onClick]
  )

  return (
    <>
      <MenuItem
        sx={{ px: 2, py: 1.25 }}
        key={id}
        onClick={handleOnClick}
        disabled={disabled}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <Tooltip title={tooltip} placement="top" arrow>
          <Stack
            direction="row"
            justifyItems="center"
            alignItems="center"
            gap={loading || icon ? 2 : 0}
          >
            <Stack
              direction="row"
              alignItems="center"
              width={loading || icon ? '17px' : 0}
            >
              {loading ? (
                <CircularProgress color="inherit" size={17} />
              ) : typeof icon === 'string' ? (
                <Icon
                  path={icon}
                  size={'20px'}
                  color={
                    disabled
                      ? theme.palette.action.disabled
                      : theme.palette.text.primary
                  }
                />
              ) : (
                icon
              )}
            </Stack>

            <Typography
              sx={{
                // fontWeight: 700,
                color: disabled
                  ? theme.palette.action.disabled
                  : theme.palette.text.primary,
              }}
              variant="body2"
            >
              {label}
            </Typography>
          </Stack>
        </Tooltip>
      </MenuItem>
      <SlimDivider />
    </>
  )
}
