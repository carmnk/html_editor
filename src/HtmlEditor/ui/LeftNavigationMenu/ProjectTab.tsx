import { Box, Stack, Typography } from "@mui/material";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { mdiFileDocument } from "@mdi/js";
import { useMemo } from "react";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";
import { EditorControllerType } from "../../editorController";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";

export type ProjectTabProps = {
  editorController: EditorControllerType;
};

export const ProjectTab = (props: ProjectTabProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;
  const { handleSelectHtmlPage } = actions.ui;
  const { addHtmlPage, removeHtmlPage } = actions.project;

  const pagesTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = Object.keys(
      editorState.htmlPages
    ).map((pageName) => {
      return {
        key: pageName,
        nodeId: pageName,
        labelText: pageName,
        disableAddAction: true,
        disableDeleteAction: pageName === "index",
        icon: mdiFileDocument,
      };
    });
    return treeItems;
  }, [editorState.htmlPages]);

  return (
    <>
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
            tooltip="Add HTML Page"
            icon={mdiFileDocument}
            onClick={addHtmlPage}
          />
        </Stack>
      </Box>
      <Box ml={0.5}>
        <CTreeView
          items={pagesTreeItems}
          onToggleExpand={handleSelectHtmlPage}
          maxWidth={220}
          onDelete={removeHtmlPage}
        />
      </Box>
    </>
  );
};
