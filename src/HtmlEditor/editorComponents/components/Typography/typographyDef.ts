import { mdiFormatText } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { typographyPropsSchema } from './typographyPropsRawSchema'
import { Typography } from '@mui/material'

export const typographyEditorComponentDef = {
  type: 'Typography' as const,
  props: {
    children: 'test',
    noWrap: false,
    align: 'inherit',
    variant: 'body1',
  },
  formGen: () => propertyFormFactory(typographyPropsSchema),
  icon: mdiFormatText,
  category: 'basic',
  component: Typography,
  schema: typographyPropsSchema,
}
//
