import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const paperPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.children,
      // required: true,
    },
    square: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
      // required: true,
    },
    elevation: {
      type: PropertyType.Number,
      minimum: 0,
      maximum: 24,
      // required: true,
      form: {
        defaultValue: 1,
      },
    },
    variant: {
      type: PropertyType.String,
      enum: ['elevation', 'outlined'],
      // required: true,
      form: {
        defaultValue: 'elevation',
      },
    },
  },
}
