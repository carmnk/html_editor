import { Box } from '@mui/material'
import React from 'react'
import { EllipsisTextWithTooltip } from '../EllipsisTooltip'
import { ColorIndicator } from './ColorIndicator'
import { booleanOptions } from '../../content/options/boolean'

const BinaryTableCellStyles = (isTrue: boolean) => {
  return isTrue
    ? {
        color: '#5FC086',
        background: '#5FC08633',
        borderRadius: '5px',
        height: 30,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
      }
    : {
        color: '#C00021',
        background: '#FFEBEA',
        borderRadius: '5px',
        height: 30,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
      }
}

export type BinaryColorIndicatorProps = {
  isActive: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export const BinaryColorIndicator = (props: BinaryColorIndicatorProps) => {
  const { isActive, activeLabel = 'Ja', inactiveLabel = 'Nein' } = props
  return (
    <ColorIndicator
      label={isActive ? activeLabel : inactiveLabel}
      menuItems={booleanOptions as any}
      color={isActive ? 'green' : 'red'}
    />
    // <Box sx={BinaryTableCellStyles(isActive)}>
    //   <EllipsisTextWithTooltip label={isActive ? activeLabel : inactiveLabel} />
    // </Box>
  )
}
