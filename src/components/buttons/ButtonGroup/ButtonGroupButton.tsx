import React from 'react'
import { Button, CButtonProps } from '../Button/Button'
import { ButtonType } from '../Button/Types'

export type ButtonGroupButtonProps = CButtonProps & {
  selected: boolean
}

export const ButtonGroupButton = (props: ButtonGroupButtonProps) => {
  const { selected, ...buttonProps } = props
  return (
    <Button
      type={selected ? ButtonType.primary : ButtonType.text}
      {...buttonProps}
    />
  )
}
