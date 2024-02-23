import {
  mdiClipboard,
  mdiTimeline,
  mdiCash,
  mdiCog,
  mdiInformation,
} from '@mdi/js'
import { Icon } from '@mdi/react'
import {
  TableViewProps,
  TableView,
  AdditionalActionType,
} from '../../views/00_Common/TableView'
import { useNavigate, useParams } from 'react-router-dom'
import { SubMenuActionType } from '../../entity_model/actionType'
import { useTableView } from '../../views/00_Common/useTableView'

export const MENU_ITEMS: { [key: number]: SubMenuActionType[] } = {
  1: [
    {
      label: 'Projekt',
      value: 'main',
      icon: <Icon path={mdiClipboard} size={1} />,
      category: 'MAIN',
    },
    {
      label: 'Tasks',
      value: 'tasks',
      icon: <Icon path={mdiTimeline} size={1} />,
      category: 'MAIN',
      view: (props: TableViewProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const tableViewProps = useTableView({
          selectedListId: 2,
          externalFilters: props?.externalFilters,
          additionalActions: [],
        })
        return (
          <TableView
            tableViewProps={tableViewProps}
            selectedListId={2}
            setSelectedListId={() => {}}
            externalFilters={props?.externalFilters}
            disableActionMenu={true}
          />
        )
      },
    },
    {
      label: 'Subscriptions',
      value: 'subscriptions',
      icon: <Icon path={mdiCash} size={1} />,
      category: 'MAIN',
      view: (props: TableViewProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const tableViewProps = useTableView({
          selectedListId: 3,
          externalFilters: props?.externalFilters,
          additionalActions: [],
        })
        return (
          <TableView
            tableViewProps={tableViewProps}
            selectedListId={3}
            setSelectedListId={() => {}}
            externalFilters={props?.externalFilters}
            disableActionMenu={true}
          />
        )
      },
    },

    {
      label: 'Settings',
      value: 'settings',
      icon: <Icon path={mdiCog} size={1} />,
      category: 'OTHER',
      view: (props: TableViewProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const tableViewProps = useTableView({
          selectedListId: 4,
          externalFilters: props?.externalFilters,
          additionalActions: [],
        })
        return (
          <TableView
            tableViewProps={tableViewProps}
            selectedListId={4}
            setSelectedListId={() => {}}
            externalFilters={props?.externalFilters}
            disableActionMenu={true}
          />
        )
      },
    },
  ],
}

export const ProjectTableView = (
  props: Pick<TableViewProps, 'externalFilters'>
) => {
  const { entityListId } = useParams<{ entityListId: string }>()
  const navigate = useNavigate()
  const additionalActions: AdditionalActionType[] = [
    {
      action: (item: any, idFieldName: string) => {
        navigate(`/bespp/${entityListId ?? 1}/${item[idFieldName]}`)
      },
      icon: mdiInformation,
      tooltip: 'Übersicht',
    },
  ]
  const tableViewProps = useTableView({
    selectedListId: 1,
    externalFilters: props?.externalFilters,
    additionalActions: additionalActions,
  })

  return (
    <TableView
      tableViewProps={tableViewProps}
      selectedListId={1}
      setSelectedListId={() => {}}
      externalFilters={props?.externalFilters}
      additionalActions={additionalActions}
    />
  )
}
