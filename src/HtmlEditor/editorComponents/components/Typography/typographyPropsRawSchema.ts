import { iconNames } from '../../../defs/icons'
import { MuiSize } from '../../../defs/muiSizeDict'
import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'

export const muiTypographyColors = [
  'primary',
  'secondary',
  'error',
  'warning.main',
  'info.main',
  'success.main',
  'text.primary',
  'text.secondary',
  'text.disabled',
  'text.hint',
  'divider',
  'action.active',
  'inherit',
  // 'action.hover',
]

const typographyVariants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'subtitle1',
  'subtitle2',
  'caption',
  'button',
  'overline',
  'inherit',
]

const typographyAligns = ['inherit', 'left', 'center', 'right', 'justify']

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const typographyPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.String,
      form: {
        defaultValue: 'Test Typography',
      },
    },
    noWrap: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
    },
    align: {
      type: PropertyType.String,
      enum: typographyAligns,
      form: {
        defaultValue: 'inherit',
      },
    },
    variant: {
      type: PropertyType.String,
      enum: typographyVariants,
      form: {
        defaultValue: 'body1',
      },
    },
    color: {
      // form: {
      // },
      type: PropertyType.String,
      enum: muiTypographyColors,
      
      // load dynamically!
      // form: {
      //   defaultValue: 'inherit',
      // },
    },
  },
}
