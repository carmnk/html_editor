import React, { useCallback, useMemo } from 'react'
import {
  mdiBrightness1,
  mdiBrightness5,
  mdiFileDocument,
  mdiPlus,
  mdiStarOutline,
} from '@mdi/js'
import { Stack, Box, Typography } from '@mui/material'
import { ButtonSmallIconButton } from '../ButtonSmallIconButton'
import { CTreeView } from '../../../components/treeview/CTreeView'
import { StyledTreeItemProps } from '../../../components/treeview/CTreeItem'
import { EditorControllerType } from '../../editorController/editorControllerTypes'
import { ExtendedTheme } from '../../../theme/muiTheme'

export type ThemesTabProps = {
  editorController: EditorControllerType
}

export const ThemesTab = (props: ThemesTabProps) => {
  const { editorController } = props
  const { editorState, actions } = editorController

  const { selectTheme } = actions.ui.navigationMenu
  const { toggleEditorTheme } = actions.ui
  const { handleChangeDefaultTheme } = actions.project

  const handleClickItem = useCallback(
    (themeName: string) => {
      selectTheme(themeName)
      toggleEditorTheme(themeName)
    },
    [selectTheme, toggleEditorTheme]
  )

  const themesTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = editorState.themes.map(
      (theme: ExtendedTheme) => {
        return {
          key: theme.name,
          nodeId: theme.name,
          labelText: theme.name,
          disableAddAction: true,
          // disableDeleteAction: themeName === "index",
          icon: theme.palette.mode === 'dark' ? mdiBrightness1 : mdiBrightness5,
          _parentId: null,
        }
      }
    )
    return treeItems
  }, [editorState.themes])

  return (
    <>
      <Stack gap={2} height="100%">
        <Box mt={0.5} ml={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography>Themes</Typography>
            </Box>

            <ButtonSmallIconButton
              tooltip="Add new Theme"
              icon={mdiPlus}
              //   onClick={addHtmlPage}
              disabled
            />
          </Stack>
        </Box>
        <Box ml={0.5}>
          <CTreeView
            items={themesTreeItems}
            onToggleExpand={() => null}
            // maxWidth={220}
            onToggleSelect={handleClickItem}
            selectedItems={
              [editorState.ui?.navigationMenu?.selectedTheme ?? 'light'] ?? []
            }
            disableItemsFocusable={true}
            actions={(item) => {
              const disabled = item.nodeId === editorState.defaultTheme
              const label = disabled
                ? 'Is Default Theme'
                : 'Select as Default Theme'
              return [
                {
                  icon: mdiStarOutline,
                  label,
                  tooltip: label,
                  action: () => {
                    handleChangeDefaultTheme(item.nodeId)
                  },
                  disabled,
                },
              ]
            }}
          />
        </Box>
      </Stack>
    </>
  )
}
