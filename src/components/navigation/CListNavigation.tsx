import { mdiInformation } from '@mdi/js'
import Icon from '@mdi/react'
import {
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  alpha,
  useTheme,
} from '@mui/material'

import { ReactNode, useCallback, useMemo } from 'react'

export type CListNavigationProps = {
  value: string
  onChange: (value: string) => void
  items: {
    value: string
    label: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: ReactNode
  }[]
  dense?: boolean
  disablePadding?: boolean
  subheader?: ReactNode
}

export const CListNavigation = (props: CListNavigationProps) => {
  const { value, onChange, items, dense, disablePadding, subheader } = props

  const theme = useTheme()
  // const handleChangeItem = useCallback(
  //   (e: any, newValue: string) => {
  //     onChange(newValue);
  //   },
  //   [onChange]
  // );

  const activeBgColor = useMemo(() => {
    return {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    }
  }, [theme.palette])

  const subheaderComponent = useMemo(() => {
    return subheader ? <ListSubheader>{subheader}</ListSubheader> : undefined
  }, [subheader])

  return (
    <List
      dense={dense}
      disablePadding={disablePadding}
      subheader={subheaderComponent}
    >
      {items?.map((item, iIdx) => (
        <ListItem
          disablePadding
          sx={item?.value === value ? activeBgColor : undefined}
        >
          <ListItemButton
            onClick={() => {
              onChange(item.value)
            }}
          >
            {item?.icon && (
              <ListItemIcon>
                {<Icon path={item?.icon as any} size={1} />}
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
