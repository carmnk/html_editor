import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'
import { paperPropsSchema } from '../Paper/paperPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const appBarPropsSchema: ExtendedObjectSchemaType = {
  ...paperPropsSchema,
  properties: {
    ...paperPropsSchema.properties,
    position: {
      type: PropertyType.String,
      enum: ['fixed', 'absolute', 'sticky', 'static', 'relative'],
      required: false,
      form: {
        defaultValue: 'fixed',
      },
    },
    enableColorOnDark: {
      type: PropertyType.Boolean,
      required: false,
    },
    color: {
      type: PropertyType.String,
      required: false,
      enum: [
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
        'error',
        'info',
        'success',
        'warning',
      ],
      form: {
        defaultValue: 'primary',
      },
    },
  },
}
