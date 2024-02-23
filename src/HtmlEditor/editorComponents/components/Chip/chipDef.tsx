import React from 'react'
import { mdiInformation } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { chipPropsSchema } from './chipPropsRawSchema'
import { Box, Chip } from '@mui/material'
import Icon from '@mdi/react'

export const chipEditorComponentDef = {
  type: 'Chip' as const,
  props: {
    label: 'test',
    size: 'medium',
    variant: 'filled',
    color: 'primary',
    clickable: false,
    disabled: false,
  },
  formGen: () => propertyFormFactory(chipPropsSchema),
  icon: mdiInformation,
  category: 'basic',
  component: (props: any) => (
    <Chip
      {...props}
      icon={
        props?.icon ? <Icon path={props.icon} size={'16px'} style={{marginLeft: "8px"}}></Icon> : undefined
      }
    />
  ),
  schema: chipPropsSchema,
}
//
