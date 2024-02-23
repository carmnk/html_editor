import { iconNames } from '../../../defs/icons'
import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const BottomNavPropsSchema: ExtendedObjectSchemaType = {
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
    showLabels: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
  },
}
