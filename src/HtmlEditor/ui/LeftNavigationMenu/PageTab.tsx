import { Box, Stack, Typography, useTheme } from "@mui/material";
import { CTreeView } from "../../../components/treeview/CTreeView";
import {
  isComponentType,
  mapHtmlElementsToTreeItems,
} from "../../renderElements";
import { EditorControllerType } from "../../editorController/editorController";
import { useCallback, useMemo, useState } from "react";
import { mdiDelete, mdiExpandAll, mdiSwapVertical } from "@mdi/js";
import { Button } from "../../../components/buttons/Button";
import { AddElementModal } from "./AddElementModal";

export type PageTabProps = {
  editorController: EditorControllerType;
};

const isChildOf = (parentNode: any, checkChildNodeId: string) => {
  const parentNodeId = parentNode.nodeId ?? parentNode?.props?.nodeId;
  if (parentNodeId === checkChildNodeId) {
    return true;
  }
  const children = parentNode.children ?? parentNode?.props?.children;
  if (children) {
    return children.some((child: any) => isChildOf(child, checkChildNodeId));
  }
  return false;
};

export const PageTab = (props: PageTabProps) => {
  const { editorController } = props;
  const { editorState, selectedPageHtmlElements, actions } = editorController;
  const {
    handleDeleteHtmlElement,
    handleAddHtmlChild,
    handleSwapHtmlElements,
    handleInsertElementIntoElement,
  } = actions.htmlElement;
  const { handleSelectHtmlElement } = actions.ui;
  const { toggleElementAddComponentMode, handleExpandHtmlElementTreeItem } =
    actions.ui.navigationMenu;

  const theme = useTheme();

  const [ui, setUi] = useState<{
    isDraggable: boolean;
    isDragging: boolean;
    draggingEvent: any;
    isCtrlPressed: boolean;
    addMenu: { anchorEl: HTMLElement; nodeId: string } | null;
  }>({
    isDraggable: false,
    isDragging: false,
    draggingEvent: null,
    isCtrlPressed: false,
    addMenu: null,
  });

  const handleSetIsDragging = useCallback(
    (isDragging: boolean, event: any) => {
      console.log("SET DRAGGING", isDragging, event);
      setUi((current) => ({
        ...current,
        isDragging,
        draggingEvent: event,
        isCtrlPressed: event.ctrlKey,
      }));
    },
    [setUi]
  );

  const handleToggleAddMenu = useCallback(
    (nodeId: string | number | null, e: any) => {
      if (!nodeId) return;
      const anchorEl = e?.currentTarget ?? e?.target;
      if (!nodeId || !anchorEl) return;
      console.log(e);

      setUi((current) => ({
        ...current,
        addMenu: current?.addMenu
          ? null
          : { nodeId: nodeId as string, anchorEl },
      }));
    },
    [setUi]
  );
  const handleCloseAddMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      addMenu: null,
    }));
  }, [setUi]);

  const treeViewProps = useMemo(() => {
    return {
      onDragDrop: (event: any, draggedItem: any, targetItem: any) => {
        const isCtrlPressed = ui?.isCtrlPressed;
        if (isChildOf(draggedItem, targetItem.nodeId)) return;

        if (!isCtrlPressed) {
          // insert as last child
          console.log("insert as last child");
          handleInsertElementIntoElement(draggedItem.nodeId, targetItem.nodeId);
        } else {
          console.log("replace targetItem");
          handleSwapHtmlElements(draggedItem.nodeId, targetItem.nodeId);
        }
        handleSelectHtmlElement(null as any);
      },
      items: mapHtmlElementsToTreeItems(
        selectedPageHtmlElements,
        ui?.isDraggable
      ),
      onDragging: (event: any, active: boolean, draggedItem: any) => {
        handleSetIsDragging(active, event);
      },
      expandedItems: editorState?.expandedTreeItems ?? [],
      onToggleExpand: handleExpandHtmlElementTreeItem,
      onToggleSelect: handleSelectHtmlElement,
      selectedItems: [editorState.selectedHtmlElementName ?? ""] ?? [],
      additionalActions: (item: any) => {
        const commonActions = [
          {
            label: "Delete Element",
            tooltip: "Delete Element and its children",
            icon: mdiDelete,
            action: handleDeleteHtmlElement,
          },
        ];
        return !isComponentType(item?.type ?? "html")
          ? [
              ...commonActions,
              // {
              //   label: "Add Component",
              //   tooltip: "Add Component as child of this element",
              //   icon: mdiReact,
              //   disabled: !!item?.content,
              //   action: (nodeId: string) => {
              //     actions?.ui?.navigationMenu?.toggleElementAddComponentMode?.(
              //       nodeId
              //     );
              //     if (!editorState?.expandedTreeItems?.includes(nodeId)) {
              //       handleExpandHtmlElementTreeItem(nodeId);
              //     }
              //   },
              // },
            ]
          : [...commonActions];
      },
      actions: (item: any) => {
        console.log("ITEM x", item?.element?.content, item);
        return (!isComponentType(item?.type ?? "html") &&
          !item?.element?.content) ||
          ["NavContainer"].includes(item?.type ?? "")
          ? [
              {
                label: "Insert Element here",
                tooltip: "Insert Element here",
                icon: mdiExpandAll,
                action: handleToggleAddMenu,
              },
            ]
          : [];
      },
    };
  }, [
    editorState,
    handleToggleAddMenu,
    handleDeleteHtmlElement,
    handleSelectHtmlElement,
    selectedPageHtmlElements,
    // actions?.ui?.navigationMenu,
    handleExpandHtmlElementTreeItem,
    ui?.isDraggable,
    ui?.isCtrlPressed,
    handleSwapHtmlElements,
    handleInsertElementIntoElement,
    handleSetIsDragging,
  ]);

  const handleToggleDraggable = useCallback(() => {
    setUi((current) => ({ ...current, isDraggable: !current.isDraggable }));
  }, []);

  return (
    <Stack gap={2} height="100%" pr={2} width={320}>
      <Box mt={0.5} ml={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography>{editorState.selectedPage}</Typography>
          </Box>

          <Button
            // type="secondary"
            color={ui?.isDraggable ? "secondary" : "inherit"}
            iconButton
            icon={mdiSwapVertical}
            tooltip="Move Elements via Drag and Drop"
            onClick={handleToggleDraggable}
          />
        </Stack>
      </Box>
      <Box flexGrow={1}>
        <CTreeView {...treeViewProps} />
      </Box>
      {/* {editorState?.ui?.navigationMenu?.elementAddComponentMode && (
        <Box
          borderTop={"1px solid " + theme.palette.divider}
          py={2}
          ml={1}
          mt={2}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography> Add Component </Typography>
            <Button
              variant="text"
              iconButton={true}
              icon={mdiClose}
              onClick={() =>
                toggleElementAddComponentMode(
                  editorState?.ui?.navigationMenu?.elementAddComponentMode
                )
              }
            />
          </Stack>

          <Typography
            color="text.primary"
            // variant="h6"
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            variant="body2"
            // {...typographyProps}
          >
            {editorState?.ui?.navigationMenu?.elementAddComponentMode ?? ""}
          </Typography>
          {baseComponents?.map((component) => {
            return (
              <Box key={component.type} mt={2}>
                <Button
                  type="text"
                  // color="text.primary"
                  onClick={() => {
                    editorState?.ui?.navigationMenu?.elementAddComponentMode &&
                      actions?.htmlElement?.handleAddComponentChild?.(
                        editorState?.ui?.navigationMenu
                          ?.elementAddComponentMode,
                        component.type as any
                      );
                  }}
                >
                  {component.type}
                </Button>
              </Box>
            );
          })}
        </Box>
      )} */}
      {ui?.isDraggable && (
        <Box>
          {ui.draggingEvent?.ctrlKey
            ? "Swap Mode (Drop CTRL for Insert Mode)"
            : "Insert Mode (Hold CTRL for Swap Mode)"}
        </Box>
      )}
      <AddElementModal
        open={!!ui?.addMenu}
        anchorEl={ui?.addMenu?.anchorEl ?? null}
        onClose={handleCloseAddMenu}
        currentElementId={ui?.addMenu?.nodeId ?? ""}
        editorController={editorController}
      />
    </Stack>
  );
};
