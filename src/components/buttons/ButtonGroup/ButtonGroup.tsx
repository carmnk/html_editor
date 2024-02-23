import React from 'react'
import { Divider, Stack } from '@mui/material'
import { ButtonGroupButton } from './ButtonGroupButton'
import { CButtonProps } from '../Button/Button'

export type ButtonGroupProps = {
  isSelected?: (itemValue: string, groupValue: string) => boolean
  transformValue?: (newItemValue: string, currentGroupValue: string) => string

  items?: ({
    value: string
    icon: string
    tooltip?: string
    label?: string
  } | null)[]

  buttonProps?: Omit<CButtonProps, 'icon' | 'tooltip' | 'label'>
  selectedButtonProps?: CButtonProps
  // iconButtons?: boolean // -> in CButtonProps

  value: string
  onChange: (value: string) => void
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  const {
    items,
    value,
    onChange,
    isSelected,
    transformValue,
    selectedButtonProps,
    buttonProps,
  } = props

  const itemsAdj = items ?? []

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

  return (
    <Stack direction="row" gap={0.25} width="max-content">
      {itemsAdj?.map?.((item, bIdx) => {
        const isItemSelected =
          (item && isSelected?.(item.value, value)) ?? item?.value === value
        return item ? (
          <ButtonGroupButton
            {...(item ?? {})}
            {...((isItemSelected ? selectedButtonProps : buttonProps) ?? {})}
            key={bIdx}
            selected={isItemSelected}
            onClick={() => handleChange(item.value)}
          />
        ) : (
          <Divider orientation="vertical" flexItem key={bIdx} />
        )
      }) ?? null}
    </Stack>
  )
}
