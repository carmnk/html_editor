import { Box, Stack, Typography } from '@mui/material'
import { CTreeView } from '../../../components/treeview/CTreeView'
import {
  mdiCodeBraces,
  mdiFileDocument,
  mdiFolder,
  mdiPackage,
  mdiPlus,
} from '@mdi/js'
import { useEffect, useMemo } from 'react'
import { ButtonSmallIconButton } from '../ButtonSmallIconButton'
import { EditorControllerType } from '../../editorController/editorControllerTypes'

export type CssTabProps = {
  editorController: EditorControllerType
}

export const CssTab = (props: CssTabProps) => {
  const { editorController } = props
  const { editorState, setEditorState, actions } = editorController
  const { selectCssClass } = actions.ui
  const { deleteCssSelector, addCssSelector } = actions.cssSelector

  const treeViewProps = useMemo(() => {
    const workspaces = [{ value: 'common', label: 'Common' }]
    const pagesTreeItems = workspaces.map((workspace) => {
      const cssSelectorsInWorkspace = editorState.cssSelectors // only 1 workspace currently!
      return {
        _parentId: null,
        key: workspace.value,
        nodeId: workspace.value,
        labelText: workspace.label,
        disableAddAction: false,
        disableDeleteAction: workspace.value === 'common',
        icon: mdiFolder,

        children: cssSelectorsInWorkspace.map((ruleKey) => ({
          nodeId: ruleKey?._id,
          labelText: '.' + ruleKey._userId,
          icon: mdiCodeBraces,
          _parentId: workspace.value,
        })),
      }
    })
    return {
      items: pagesTreeItems,
      expandedItems: ['common'],
      // onAddChild: addCssSelector,
      onDelete: deleteCssSelector,
      onToggleSelect: (newValue: string) => {
        selectCssClass(newValue)
      },
      actions: (item: any) =>
        item?._parentId
          ? []
          : [
              {
                action: addCssSelector as any,
                tooltip: 'Add Css Selector',
                icon: mdiPlus,
                label: 'Add Css Selector',
              },
            ],
    }
  }, [
    editorState.cssSelectors,
    addCssSelector,
    deleteCssSelector,
    selectCssClass,
  ])

  useEffect(() => {
    return () => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: {
            ...current.ui.selected,
            cssSelector: null,
          },
        },
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack gap={2} height="100%">
      <Box mt={0.5} ml={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography>Css</Typography>
          </Box>

          <Stack direction="row" spacing={0.5}>
            <ButtonSmallIconButton
              tooltip="Add Css Workspace"
              icon={mdiPackage}
              disabled={true}
            />
          </Stack>
        </Stack>
      </Box>
      <Box ml={0.5}>
        <CTreeView {...treeViewProps} />
      </Box>
    </Stack>
  )
}
