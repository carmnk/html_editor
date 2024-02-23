import { iconNames } from '../../../defs/icons'
import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ListNavPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    // children: {
    //   type: PropertyType.children,
    // },
    items: {
      type: PropertyType.Array,
      items: [
        {
          type: PropertyType.Object,
          properties: {
            label: { type: PropertyType.String },
            value: { type: PropertyType.String },
            icon: { type: PropertyType.icon, enum: iconNames },
          },
        },
      ],
      form: {
        defaultValue: [{ value: 'test', label: 'test' }],
      },
    },
    dense: {
      type: PropertyType.Boolean,
      required: false,
    },
    disablePadding: {
      type: PropertyType.Boolean,
      required: false,
    },
    subheader: {
      type: PropertyType.String,
      required: false,
    },
  },
}
