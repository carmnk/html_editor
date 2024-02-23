import { mdiDockBottom } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { BottomNavPropsSchema } from './bottomNavPropsRawSchema'
import { CBottomNavigation } from '../../../../components/navigation/CBottomNavigation'

export const BottomNavComponentDef = {
  type: 'BottomNavigation' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
  },
  state: 'test',
  formGen: () => propertyFormFactory(BottomNavPropsSchema),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiDockBottom,
  category: 'navigation',
  component: CBottomNavigation,
  schema: BottomNavPropsSchema,
}
