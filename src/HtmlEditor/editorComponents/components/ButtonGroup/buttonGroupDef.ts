import { mdiCheckboxMultipleBlank } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonGroupPropsSchema } from './buttonGroupPropsRawSchema'
import { ButtonGroup } from '../../../../components/buttons/ButtonGroup/ButtonGroup'

export const buttonGroupEditorComponentDef = {
  type: 'ButtonGroup' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
  },
  state: 'test',
  formGen: () => propertyFormFactory(ButtonGroupPropsSchema),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiCheckboxMultipleBlank,
  category: 'navigation',
  component: ButtonGroup,
  schema: ButtonGroupPropsSchema,
}

// ButtonPropsSchema
