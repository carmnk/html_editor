import { mdiFileDocument, mdiPlus } from "@mdi/js";
import { Stack, Box, Typography } from "@mui/material";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { EditorControllerType } from "../../editorController/editorController";
import { useCallback, useMemo } from "react";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";
import { findElementById } from "../../renderElements";

export type StateTabProps = {
  editorController: EditorControllerType;
};

export const StateTab = (props: StateTabProps) => {
  const { editorController } = props;
  const { editorState, actions, appState, selectedPageHtmlElements } =
    editorController;

  const { handleSelectTheme } = actions.ui.navigationMenu;
  const { toggleEditorTheme } = actions.ui;

  const handleClickItem = useCallback(
    (themeName: string) => {
      handleSelectTheme(themeName);
      toggleEditorTheme(themeName);
    },
    [handleSelectTheme, toggleEditorTheme]
  );

  const stateTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = Object.keys(appState?.state)?.map(
      (stateKey: any) => {
        const [baseElement] =
          findElementById(stateKey, selectedPageHtmlElements) ?? [];
        return {
          key: stateKey,
          nodeId: stateKey,
          labelText: (baseElement as any)?.userID || stateKey,
          disableAddAction: true,
          // disableDeleteAction: themeName === "index",
          icon: mdiFileDocument,
        };
      }
    );
    return treeItems;
  }, [appState, selectedPageHtmlElements]);

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
              <Typography>State</Typography>
            </Box>

            <ButtonSmallIconButton
              tooltip="Add new **"
              icon={mdiPlus}
              //   onClick={addHtmlPage}
              disabled
            />
          </Stack>
        </Box>
        <Box ml={0.5}>
          <CTreeView
            items={stateTreeItems}
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
