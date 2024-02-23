import { mdiTab } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { TabsPropsSchema } from './tabsPropsRawSchema'
import { CTabs } from '../../../../components/navigation/CTabs'

export const TabsComponentDef = {
  type: 'Tabs' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
  },
  state: 'test',
  formGen: () => propertyFormFactory(TabsPropsSchema),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiTab,
  category: 'navigation',
  component: CTabs,
  schema: TabsPropsSchema,
}
