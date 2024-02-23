import { mdiDockTop } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { appBarPropsSchema } from './appBarPropsRawSchema'
import { AppBar } from '@mui/material'

export const appBarDef = {
//   ...paperDef,
  type: 'AppBar' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",,

    children: [],
  },

  formGen: () => propertyFormFactory(appBarPropsSchema),
  icon: mdiDockTop,
  category: 'surface',
  schema: appBarPropsSchema,
  component: AppBar,
}
