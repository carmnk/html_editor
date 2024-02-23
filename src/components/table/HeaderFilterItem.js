import React from 'react'
import { useTheme } from '@mui/material'

export const HeaderFilterItem = (props) => {
  const { label, isActive, onClick, className, name } = props
  const theme = useTheme()
  return (
    <button
      style={isActive ? { color: theme.palette.primary.main } : {}}
      className={`${isActive && `active font-bold`} text-[14px] ` + (className || 'mr-6 ')}
      onClick={onClick}
      name={name}
    >
      {label}
    </button>
  )
}
