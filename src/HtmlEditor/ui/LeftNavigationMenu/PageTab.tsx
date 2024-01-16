import { Box, Stack, Typography } from "@mui/material";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { mapHtmlElementsToTreeItems } from "../../renderElements";
import { EditorControllerType } from "../../editorController";
import { useMemo } from "react";

export type PageTabProps = {
  editorController: EditorControllerType;
};

export const PageTab = (props: PageTabProps) => {
  const { editorController } = props;
  const { editorState, selectedPageHtmlElements, actions } = editorController;
  const { handleDeleteHtmlElement, handleAddHtmlChild } = actions.htmlElement;
  const { handleSelectHtmlElement } = actions.ui;

  const treeViewProps = useMemo(() => {
    return {
      items: mapHtmlElementsToTreeItems(selectedPageHtmlElements),
      onAddChild: handleAddHtmlChild,
      onDelete: handleDeleteHtmlElement,
      expandedItems: editorState?.expandedTreeItems ?? [],
      onToggleExpand: handleSelectHtmlElement,
      selectedItems: [editorState.selectedHtmlElementName ?? ""] ?? [],
      maxWidth: 220,
    };
  }, [
    editorState,
    handleAddHtmlChild,
    handleDeleteHtmlElement,
    handleSelectHtmlElement,
    selectedPageHtmlElements,
  ]);

  return (
    <>
      <Box mt={0.5} ml={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography>{editorState.selectedPage}</Typography>
          </Box>

          {/* <Button
              tooltip="Add HTML Page"
              sx={{ width: 24, height: 24 }}
              iconButton={true}
              icon={mdiFileDocument}
              onClick={() => {
              }}
            /> */}
        </Stack>
      </Box>
      <CTreeView {...treeViewProps} />
    </>
  );
};
