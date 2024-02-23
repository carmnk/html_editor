import { iconNames } from '../../../defs/icons'
import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const TabsPropsSchema: ExtendedObjectSchemaType = {
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
    disableIndicator: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    disableBorderBottom: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    indicatorColor: {
      type: PropertyType.String,
      required: false,
      enum: ['primary', 'secondary'],
      form: {
        defaultValue: 'primary',
      },
    },
    centered: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    // scrollButtons: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: ['auto', false, true] as any,
    // },
    // textColor: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: ['primary', 'secondary', 'inherit'],
    // },
    // variant: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: ['standard', 'scrollable', 'fullWidth'],
    // },
    // visibleScrollbar: {
    //   type: PropertyType.Boolean,
    //   required: false,
    // },
  },
}
