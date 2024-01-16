import { Box, Stack, Typography } from "@mui/material";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { mdiCodeBraces, mdiFileDocument, mdiPackage } from "@mdi/js";
import { EditorControllerType } from "../../editorController";
import { useEffect, useMemo } from "react";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";

export type CssTabProps = {
  editorController: EditorControllerType;
};

export const CssTab = (props: CssTabProps) => {
  const { editorController } = props;
  const { editorState, setEditorState, actions } = editorController;
  const { handleSelectCssClass } = actions.ui;
  const { handleDeleteCssSelector, handleAddCssSelector } = actions.cssSelector;

  const treeViewProps = useMemo(() => {
    const pagesTreeItems = Object.keys(editorState.cssWorkspaces).map(
      (wsKey) => {
        const ws = editorState.cssWorkspaces[wsKey];
        console.log("CSS ", wsKey);
        return {
          key: wsKey,
          nodeId: wsKey,
          labelText: wsKey,
          disableAddAction: false,
          disableDeleteAction: wsKey === "common",
          icon: mdiFileDocument,
          children: Object.keys(ws).map((ruleKey) => ({
            nodeId: ruleKey,
            labelText: "." + ruleKey,
            disableAddAction: true,
            disableDeleteAction: false,
            icon: mdiCodeBraces,
          })),
        };
      }
    );
    return {
      items: pagesTreeItems,
      expandedItems: ["common"],
      onAddChild: handleAddCssSelector,
      onDelete: handleDeleteCssSelector,
      onToggleExpand: (newValue: string) => {
        handleSelectCssClass(newValue);
      },
      maxWidth: 220,
    };
  }, [
    editorState.cssWorkspaces,
    handleAddCssSelector,
    handleDeleteCssSelector,
    handleSelectCssClass,
  ]);

  useEffect(() => {
    return () => {
      setEditorState((current) => ({
        ...current,
        selectedCssClass: null,
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
    </>
  );
};
