import React from 'react'
import { Button, CButtonProps } from './Button/Button'
import { Divider, Stack, useTheme } from '@mui/material'
import { ButtonType } from './Button/Types'

export type ButtonGroupButtonProps = Pick<
  CButtonProps,
  'icon' | 'tooltip' | 'onClick'
> & {
  value: string
  selected: boolean
  disabled?: boolean
  iconButton?: boolean
  label?: string
}

const ButtonGroupButton = (props: ButtonGroupButtonProps) => {
  const { value, selected, icon, tooltip, onClick, disabled, iconButton, label } =
    props
  return (
    <Button
      type={selected ? ButtonType.primary : ButtonType.text}
      iconButton={iconButton ?? true}
      icon={icon}
      tooltip={tooltip}
      name={value}
      onClick={onClick}
      disabled={disabled}
      label={label}
    />
  )
}

export type ButtonGroupProps = {
  buttons: (Omit<ButtonGroupButtonProps, 'selected'> | null)[]
  items?: (Omit<ButtonGroupButtonProps, 'selected'> | null)[]
  iconButtons?: boolean
  value: string
  onChange: (value: string) => void
  isSelected?: (itemValue: string, groupValue: string) => boolean
  transformValue?: (newItemValue: string, currentGroupValue: string) => string
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  const {
    buttons,
    items,
    value,
    onChange,
    isSelected,
    transformValue,
    iconButtons,
  } = props
  const itemsAdj = items ?? buttons
  

  const handleChange = React.useCallback(
    (newValue: string) => {
      if (!onChange) return
      const newValueAdj = transformValue
        ? transformValue(newValue, value)
        : newValue
      onChange(newValueAdj)
    },
    [onChange, transformValue, value]
  )

  const theme = useTheme()
  return (
    <Stack
      direction="row"
      gap={0.25}
      border={'1px solid ' + theme.palette.divider}
      width="max-content"
    >
      {itemsAdj?.map?.((button, bIdx) => {
        return button ? (
          <ButtonGroupButton
            {...button}
            iconButton={iconButtons}
            key={bIdx}
            selected={
              isSelected?.(button.value, value) ?? button.value === value
            }
            onClick={() => handleChange(button.value)}
          />
        ) : (
          <Divider orientation="vertical" flexItem key={bIdx} />
        )
      }) ?? null}
    </Stack>
  )
}
