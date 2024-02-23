import React, { Box, Stack, Typography } from '@mui/material'
import {
  AdditionalActionType,
  CTreeView,
  CTreeViewProps,
} from '../../../components/treeview/CTreeView'
import { mdiContentDuplicate, mdiDelete, mdiFile, mdiOpenInApp } from '@mdi/js'
import { useMemo } from 'react'
import { ButtonSmallIconButton } from '../ButtonSmallIconButton'
import { StyledTreeItemProps } from '../../../components/treeview/CTreeItem'
import { uniq } from 'lodash'
import { EditorControllerType } from '../../editorController/editorControllerTypes'
import { Flex } from '../../../components/basics/Flex'

export type ProjectTabProps = {
  editorController: EditorControllerType
}

export const ProjectTab = (props: ProjectTabProps) => {
  const { editorController } = props
  const { editorState, actions } = editorController
  const { selectHtmlPage } = actions.ui
  const { switchNavigationTab } = actions.ui.navigationMenu
  const { addHtmlPage, removeHtmlPage, duplicateHtmlPage } = actions.project

  const pagesTreeViewProps: CTreeViewProps = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = uniq<string>(
      editorState.elements.map((el: any) => el._page)
    ).map((pageName) => {
      return {
        key: pageName,
        nodeId: pageName,
        labelText: pageName,
        disableAddAction: true,
        disableDeleteAction: pageName === 'index',
        icon: mdiFile,
        _parentId: null,
      }
    })
    return {
      items: treeItems,
      onToggleSelect: selectHtmlPage,
      onDelete: removeHtmlPage,
      selectedItems: editorState.ui.selected.page
        ? [editorState.ui.selected.page]
        : [],
      // actions: (item: any) => [
      //   {
      //     icon: mdiContentDuplicate,
      //     label: "Rename Page",
      //     tooltip: "Rename Page",
      //     action: () => {
      //       // duplicateHtmlPage(nodeId);
      //     },
      //   },
      // ],
      actions: (item: any) => {
        const nodeId = item.nodeId
        return [
          {
            icon: mdiOpenInApp,
            label: 'Open Page',
            tooltip: 'Open Page',
            action: () => {
              selectHtmlPage(nodeId)
              switchNavigationTab('page')
            },
          },
        ]
      },
      additionalActions: (item: any) => {
        const nodeId = item.nodeId
        const baseActions: AdditionalActionType[] = [
          {
            icon: mdiContentDuplicate,
            label: 'Duplicate Page',
            tooltip: 'Duplicate Page',
            action: () => {
              duplicateHtmlPage(nodeId)
            },
          },
        ]
        return item.nodeId === 'index'
          ? [...baseActions]
          : [
              ...baseActions,
              {
                icon: mdiDelete,
                tooltip: 'Delete Page',
                label: 'Delete Page',
                action: () => removeHtmlPage(nodeId),
              },
            ]
      },
    }
  }, [
    editorState.elements,
    selectHtmlPage,
    removeHtmlPage,
    editorState.ui.selected.page,
    duplicateHtmlPage,
  ])

  return (
    <Stack gap={2} height="100%">
      <Box mt={0.5} ml={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Typography>Project</Typography>
          </Box>

          <ButtonSmallIconButton
            tooltip="Add new Page"
            icon={mdiFile}
            onClick={addHtmlPage}
          />
        </Flex>
      </Box>
      <Box ml={0.5}>
        <CTreeView {...pagesTreeViewProps} />
      </Box>
    </Stack>
  )
}
