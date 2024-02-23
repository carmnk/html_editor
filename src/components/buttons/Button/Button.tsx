import React, { useMemo } from 'react'
import {
  useTheme,
  Button as MuiButton,
  Box,
  ButtonProps,
  Tooltip,
  Typography,
} from '@mui/material'

import type { ButtonDropdown, ButtonType } from './Types'
import { ButtonEndIcon, ButtonStartIcon } from './ButtonIcons'

const disabledHoverStyles = {
  background: 'transparent',
  '&: hover': {
    background: 'transparent',
  },
}

export type CButtonProps = Pick<
  ButtonProps,
  'onClick' | 'onPointerDown' | 'onKeyDown' | 'size' | 'sx'
> & {
  type?: ButtonType

  label?: React.ReactNode
  children?: React.ReactNode

  loading?: boolean
  icon?: React.ReactNode
  endIcon?: React.ReactNode
  dropdown?: ButtonDropdown
  iconButton?: boolean

  // spanSx?: any
  disableHover?: boolean // onl

  tooltip?: string
  color?: ButtonProps['color']
  iconColor?: string

  fontColor?: string
  iconSize?: string
  disableTabstop?: boolean
  title?: string
  name?: string
  disabled?: boolean

  disableInteractiveTooltip?: boolean
}

export interface abc {}

export const Button = React.forwardRef(
  (props: CButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const {
      icon,
      type,
      label,
      disableHover,
      children,
      endIcon,
      loading,
      dropdown,
      disabled: disabledIn,
      iconButton,
      iconSize,
      color,
      iconColor,
      fontColor,
      disableTabstop,
      disableInteractiveTooltip,
      ...rest
    } = props
    const theme = useTheme()
    const disabled = disabledIn || loading

    const disableHoverStyles = useMemo(
      () => (disableHover ? disabledHoverStyles : {}),
      [disableHover]
    )
    const startIcon = useMemo(
      () => (
        <ButtonStartIcon
          icon={icon}
          iconColor={iconColor}
          iconSize={iconSize}
          disabled={disabled}
          loading={loading}
          type={type}
        />
      ),
      [icon, iconColor, iconSize, disabled, loading, type]
    )
    const endIconAdj = useMemo(
      () => (
        <ButtonEndIcon
          disabled={disabled}
          endIcon={endIcon}
          iconColor={iconColor}
          type={type}
          dropdown={dropdown}
        />
      ),
      [disabled, endIcon, iconColor, type, dropdown]
    )

    const padding = iconButton ? '4px' : type === 'text' ? '5px 15px' : 'auto'
    const commonStyles = useMemo(
      () =>
        ({
          minWidth: 0,
          textTransform: 'none',
          display: 'flex',
          justifyContent: iconButton ? 'center' : 'flex-start',
          height: iconButton ? 28 : 'auto',
          padding,
          boxShadow: 'none',
          '& .MuiButton-startIcon': {
            ml: iconButton ? 'auto' : 0,
            mr: !icon ? 0 : iconButton ? 'auto' : '8px',
          },
          '& .MuiButton-endIcon': {
            ml: 'auto',
            pl: '5px',
          },
          width: iconButton && dropdown ? 53 : iconButton ? 28 : 'auto',
        } as any),
      [iconButton, dropdown, padding, icon]
    )

    const secondaryBgColor =
      theme.palette.mode === 'light'
        ? !disabled
          ? '#E1E1E1'
          : '#F3F3F3'
        : !disabled
        ? '#666'
        : '#666'

    const buttonStyles = useMemo(
      () =>
        type === 'secondary'
          ? {
              ...commonStyles,
              border: '0px solid ' + theme.palette.primary.main + ' !important',
              background: secondaryBgColor,
              '&: hover': {
                border: '0px solid ' + theme.palette.primary.main,
                background: theme.palette.mode === 'light' ? '#CCCCCC' : '#999',
              },
              padding,
              ...(rest?.sx ?? {}),
            }
          : type === 'text'
          ? {
              ...commonStyles,
              background: disableHover ? 'transparent' : undefined,
              '&: hover': {
                border: '0px solid ' + theme.palette.primary.main,
                background: disableHover
                  ? 'transparent'
                  : theme.palette.mode === 'light'
                  ? '#E1E1E1'
                  : '#999',
              },
              ...disableHoverStyles,
              padding,
              ...(rest?.sx ?? {}),
            }
          : {
              ...commonStyles,
              '&: hover': {
                boxShadow: 'none',
              },
              ...(rest?.sx ?? {}),
            },
      [
        commonStyles,
        rest?.sx,
        theme.palette.primary.main,
        type,
        padding,
        disableHoverStyles,
        theme.palette.mode,
        disableHover,
        secondaryBgColor,
      ]
    )

    const Button = useMemo(
      () =>
        type === 'secondary' ? (
          <MuiButton
            color={color as any}
            ref={ref}
            variant="outlined"
            disableElevation
            startIcon={startIcon}
            endIcon={endIconAdj}
            disabled={disabled}
            {...rest}
            tabIndex={disableTabstop ? -1 : 0}
            sx={buttonStyles}
          >
            {!iconButton && (
              <Typography
                variant="body2"
                color={
                  disabled ? 'action.disabled' : fontColor ?? 'text.primary'
                }
                fontWeight={700}
              >
                {label ?? children}
              </Typography>
            )}
          </MuiButton>
        ) : type === 'text' ? (
          <MuiButton
            color={color as any}
            ref={ref}
            size="small"
            variant="text"
            startIcon={startIcon}
            endIcon={endIconAdj}
            disabled={disabled}
            {...rest}
            tabIndex={disableTabstop ? -1 : 0}
            sx={buttonStyles}
          >
            {!iconButton && (
              <Typography
                variant="body2"
                color={
                  disabled ? 'action.disabled' : fontColor ?? 'text.primary'
                }
                fontWeight={700}
              >
                {label ?? children}
              </Typography>
            )}
          </MuiButton>
        ) : (
          <MuiButton
            color={color as any}
            ref={ref}
            variant="contained"
            disableElevation
            startIcon={startIcon}
            endIcon={endIconAdj}
            disabled={disabled}
            {...rest}
            tabIndex={disableTabstop ? -1 : 0}
            sx={buttonStyles}
          >
            {!iconButton && (
              <Typography
                variant="body2"
                color={
                  disabled
                    ? 'action.disabled'
                    : fontColor ?? 'primary.contrastText'
                }
                fontWeight={700}
              >
                {label ?? children}
              </Typography>
            )}
          </MuiButton>
        ),
      [
        color,
        disableTabstop,
        iconButton,
        children,
        disabled,
        endIconAdj,
        fontColor,
        label,
        startIcon,
        type,
        buttonStyles,
        ref,
        rest, // could be a problem
      ]
    )

    const ButtonWithTooltip = useMemo(
      () =>
        props.tooltip ? (
          <Tooltip
            arrow={true}
            placement={'top'}
            title={props.tooltip}
            disableInteractive={disableInteractiveTooltip}
          >
            <Box width="max-content">{Button}</Box>
          </Tooltip>
        ) : (
          Button
        ),
      [Button, props.tooltip, disableInteractiveTooltip]
    )
    return ButtonWithTooltip
  }
)
Button.displayName = 'Button'
