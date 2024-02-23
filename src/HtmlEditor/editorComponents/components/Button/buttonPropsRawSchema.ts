import { ButtonType } from '../../../../components/buttons/Button/Types'
import { iconNames } from '../../../defs/icons'
import { MuiSize } from '../../../defs/muiSizeDict'
import { PropertyType, ExtendedObjectSchemaType } from '../../rawSchema'
import { muiBaseColors, muiBaseColorsOptions } from '../Chip/chipPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ButtonPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    // children: {
    //   type: PropertyType.String,
    //   required: true,
    // },
    onClick: {
      type: PropertyType.Function,
      required: false,
      parameters: {
        event: [{ type: PropertyType.Object, required: true, properties: {} }],
      },
      //   returnType: { type: PropertyType.Void },
    },
    color: {
      // form: {

      // },
      type: PropertyType.String,
      required: false,
      enum: muiBaseColors,
      form: {
        defaultValue: muiBaseColorsOptions[0],
      },
    },
    disabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    disableHover: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    disableTabStop: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    icon: {
      type: PropertyType.icon,
      required: false,
      enum: iconNames,
    },
    endIcon: {
      type: PropertyType.icon,
      required: false,
      enum: iconNames,
    },
    fontColor: {
      type: PropertyType.String,
      required: false,
    },
    label: {
      type: PropertyType.String,
      required: false,
      form: {
        defaultValue: 'TestButton',
      },
    },
    loading: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
    },
    name: { type: PropertyType.String, required: false },
    onKeyDown: {
      type: PropertyType.Function,
      required: false,
      parameters: {
        event: [{ type: PropertyType.Object, required: true, properties: {} }],
      },
      //   returnType: { type: PropertyType.Void },
    },
    onPointerDown: {
      type: PropertyType.Function,
      required: false,
      parameters: {
        event: [{ type: PropertyType.Object, required: true, properties: {} }],
      },

      //   returnType: { type: PropertyType.Void },
    },
    size: {
      type: PropertyType.String,
      enum: Object.values(MuiSize),
      required: false,
      form: {
        defaultValue: MuiSize.medium,
      },
    },
    sx: {
      type: PropertyType.Object,
      required: false,
      properties: {},
    },
    title: {
      type: PropertyType.String,
      required: false,
    },
    tooltip: {
      type: PropertyType.String,
      required: false,
    },
    type: {
      type: PropertyType.String,
      enum: Object.values(ButtonType),
      required: false,
      form: {
        defaultValue: ButtonType.primary,
      },
    },
  },
}
