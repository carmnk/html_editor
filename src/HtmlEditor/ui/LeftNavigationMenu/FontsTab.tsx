import { mdiFileDocument, mdiPlus } from "@mdi/js";
import { Stack, Box, Typography } from "@mui/material";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { EditorControllerType } from "../../editorController/editorController";
import { useCallback, useMemo } from "react";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";

export type FontsTabProps = {
  editorController: EditorControllerType;
};

export const FontsTab = (props: FontsTabProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;

  const { handleSelectTheme } = actions.ui.navigationMenu;
  const { toggleEditorTheme } = actions.ui;

  const handleClickItem = useCallback(
    (themeName: string) => {
      alert("NOT YET IMPLEMENTED");
      // handleSelectTheme(themeName);
      // toggleEditorTheme(themeName);
    },
    [handleSelectTheme, toggleEditorTheme]
  );

  const fontsTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = editorState.fonts.map(
      (fontName: any) => {
        return {
          key: fontName,
          nodeId: fontName,
          labelText: fontName,
          disableAddAction: true,
          // disableDeleteAction: themeName === "index",
          icon: mdiFileDocument,
        };
      }
    );
    return treeItems;
  }, [editorState.fonts]);

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
              <Typography>Fonts</Typography>
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
            items={fontsTreeItems}
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
