import { mdiFormatListNumbered } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ListNavPropsSchema } from './listNavPropsRawSchema'
import { CListNavigation } from '../../../../components/navigation/CListNavigation'

export const listNavEditorComponentDef = {
  type: 'ListNavigation' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
  },
  state: 'test',
  formGen: () => propertyFormFactory(ListNavPropsSchema),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiFormatListNumbered,
  category: 'navigation',
  component: CListNavigation,
  schema: ListNavPropsSchema,
}

// ButtonPropsSchema
