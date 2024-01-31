import { Box, Stack, Typography } from "@mui/material";
import {
  AdditionalActionType,
  CTreeView,
  CTreeViewProps,
} from "../../../components/treeview/CTreeView";
import { mdiContentDuplicate, mdiDelete, mdiFile } from "@mdi/js";
import { useMemo } from "react";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";
import { EditorControllerType } from "../../editorController/editorController";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";

export type ProjectTabProps = {
  editorController: EditorControllerType;
};

export const ProjectTab = (props: ProjectTabProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;
  const { handleSelectHtmlPage } = actions.ui;
  const { addHtmlPage, removeHtmlPage } = actions.project;

  const pagesTreeViewProps: CTreeViewProps = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = Object.keys(
      editorState.htmlPages
    ).map((pageName) => {
      return {
        key: pageName,
        nodeId: pageName,
        labelText: pageName,
        disableAddAction: true,
        disableDeleteAction: pageName === "index",
        icon: mdiFile,
      };
    });
    return {
      items: treeItems,
      onToggleSelect: handleSelectHtmlPage,
      onDelete: removeHtmlPage,
      // actions: [{i}],
      additionalActions: (item: any) => {
        const nodeId = item.nodeId;
        const baseActions: AdditionalActionType[] = [
          {
            icon: mdiContentDuplicate,
            label: "Duplicate Page",
            tooltip: "Duplicate Page",
            action: () => {
              alert("NOT YET IMPLEMENTED");
            },
          },
        ];
        return item.nodeId === "index"
          ? [...baseActions]
          : [
              ...baseActions,
              {
                icon: mdiDelete,
                tooltip: "Delete Page",
                label: "Delete Page",
                action: () => removeHtmlPage(nodeId),
              },
            ];
      },
    };
  }, [editorState.htmlPages, handleSelectHtmlPage, removeHtmlPage]);

  return (
    <Stack gap={2} height="100%" pr={2} width={320}>
      <Box mt={0.5} ml={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography>Project</Typography>
          </Box>

          <ButtonSmallIconButton
            tooltip="Add new Page"
            icon={mdiFile}
            onClick={addHtmlPage}
          />
        </Stack>
      </Box>
      <Box ml={0.5}>
        <CTreeView {...pagesTreeViewProps} />
      </Box>
    </Stack>
  );
};
