import { mdiFileDocument, mdiPlus } from "@mdi/js";
import { Stack, Box, Typography } from "@mui/material";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { EditorControllerType } from "../../editorController/editorController";
import { useCallback, useMemo } from "react";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";

export type ThemesTabProps = {
  editorController: EditorControllerType;
};

export const ThemesTab = (props: ThemesTabProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;

  const { handleSelectTheme } = actions.ui.navigationMenu;
  const { toggleEditorTheme } = actions.ui;

  const handleClickItem = useCallback(
    (themeName: string) => {
      handleSelectTheme(themeName);
      toggleEditorTheme(themeName);
    },
    [handleSelectTheme, toggleEditorTheme]
  );

  const themesTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = editorState.themes.map(
      (theme: any) => {
        return {
          key: theme.name,
          nodeId: theme.name,
          labelText: theme.name,
          disableAddAction: true,
          // disableDeleteAction: themeName === "index",
          icon: mdiFileDocument,
        };
      }
    );
    return treeItems;
  }, [editorState.themes]);

  return (
    <>
      <Stack gap={2} height="100%" pr={2} width={320}>
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
              [editorState.ui?.navigationMenu?.selectedTheme ?? ""] ?? []
            }
            disableItemsFocusable={true}
            // onDelete={removeHtmlPage}
          />
        </Box>
      </Stack>
    </>
  );
};
