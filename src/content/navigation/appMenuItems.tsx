import {
  mdiAccount,
  mdiClipboard,
  mdiFile,
  mdiFileTree,
  mdiTable,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import { AppMenuActionType } from '../../entity_model/actionType'

export const APP_MAINMENU_ITEMS: AppMenuActionType[] = [
  {
    label: 'Projekte',
    value: 'main',
    icon: <Icon path={mdiClipboard} size={1} />,
    category: 'MAIN',
    location: 'bespp/1',
  },
  {
    label: 'Kunden',
    value: 'clients',
    icon: <Icon path={mdiAccount} size={1} />,
    category: 'MAIN',
    location: 'table/6',
  },

  {
    label: 'Produkte (exp.)',
    value: 'products',
    icon: <Icon path={mdiFileTree} size={1} />,
    category: 'OTHER',
    location: 'test',
  },
  {
    label: 'Selectable Table (test)',
    value: 'selectable_table',
    icon: <Icon path={mdiTable} size={1} />,
    category: 'OTHER',
    location: 'test2',
  },
  {
    label: 'File (test)',
    value: 'file_test',
    icon: <Icon path={mdiFile} size={1} />,
    category: 'OTHER',
    location: 'test_file',
  },
  {
    label: 'External (exp)',
    value: 'external_test',
    icon: <Icon path={mdiFile} size={1} />,
    category: 'OTHER',
    location: 'test_external',
  },
]
