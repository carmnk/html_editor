import { mdiButtonCursor } from '@mdi/js'
import { Button } from '../../../../components/buttons/Button/Button'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonPropsSchema } from './buttonPropsRawSchema'
import { ComponentDefType } from '../../componentDefType'

export const buttonEditorComponentDef = {
  type: 'Button' as const,

  component: Button,
  formGen: () => propertyFormFactory(ButtonPropsSchema),
  props: {
    type: 'primary',
    label: 'test2324____r',
    disabled: false,
    loading: false,
    iconButton: false,
    size: 'medium',
  },

  icon: mdiButtonCursor,
  category: 'basic',
  schema: ButtonPropsSchema,
}

export const newButtonEditorComponentDef: ComponentDefType = {
  type: 'Button' as const,

  component: Button,
  propSchema: ButtonPropsSchema,
  dynamicInjections: () => ({ dynamicOptionsDict: {} }),

  icon: mdiButtonCursor,
  category: 'basic',
}
