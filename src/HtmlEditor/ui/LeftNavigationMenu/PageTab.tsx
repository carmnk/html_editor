import { Box, Stack, Typography, useTheme } from '@mui/material'
import { CTreeView } from '../../../components/treeview/CTreeView'
import {
  isComponentType,
  mapHtmlElementsToTreeItems,
} from '../../renderElements'
import { useCallback, useMemo, useState } from 'react'
import { mdiDelete, mdiExpandAll, mdiSwapVertical } from '@mdi/js'
import { Button } from '../../../components/buttons/Button/Button'
import { AddElementModal } from './AddElementModal'
import { EditorControllerType } from '../../editorController/editorControllerTypes'
import { baseComponents } from '../../editorComponents/baseComponents'
import { PropertyType } from '../../editorComponents/rawSchema'

export type PageTabProps = {
  editorController: EditorControllerType
}

const isChildOf = (parentNode: any, checkChildNodeId: string) => {
  const parentNodeId = parentNode.nodeId ?? parentNode?.props?.nodeId
  if (parentNodeId === checkChildNodeId) {
    return true
  }
  const children = parentNode.children ?? parentNode?.props?.children
  if (children) {
    return children.some((child: any) => isChildOf(child, checkChildNodeId))
  }
  return false
}

export const PageTab = (props: PageTabProps) => {
  const { editorController } = props
  const {
    editorState,
    selectedPageHtmlElements2: selectedPageHtmlElements,
    selectedHtmlElement2,
    actions,
  } = editorController
  const {
    deleteElement,
    addHtmlChild,
    swapHtmlElements,
    insertElementIntoElement,
  } = actions.htmlElement
  const { selectElement } = actions.ui
  const { toggleElementAddComponentMode, expandHtmlElementTreeItem } =
    actions.ui.navigationMenu

  const selectedBaseComponent = useMemo(() => {
    return baseComponents?.find(
      (com) => com.type === selectedHtmlElement2?._type
    )
  }, [selectedHtmlElement2?._type])

  const theme = useTheme()

  const [ui, setUi] = useState<{
    isDraggable: boolean
    isDragging: boolean
    draggingEvent: any
    isCtrlPressed: boolean
    addMenu: { anchorEl: HTMLElement; nodeId: string } | null
  }>({
    isDraggable: false,
    isDragging: false,
    draggingEvent: null,
    isCtrlPressed: false,
    addMenu: null,
  })

  const handleSetIsDragging = useCallback(
    (isDragging: boolean, event: any) => {
      setUi((current) => ({
        ...current,
        isDragging,
        draggingEvent: event,
        isCtrlPressed: event.ctrlKey,
      }))
    },
    [setUi]
  )

  const handleToggleAddMenu = useCallback(
    (nodeId: string | number | null, e: any) => {
      if (!nodeId) return
      const anchorEl = e?.currentTarget ?? e?.target
      if (!nodeId || !anchorEl) return
      setUi((current) => ({
        ...current,
        addMenu: current?.addMenu
          ? null
          : { nodeId: nodeId as string, anchorEl },
      }))
    },
    [setUi]
  )
  const handleCloseAddMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      addMenu: null,
    }))
  }, [setUi])

  const treeViewProps = useMemo(() => {
    return {
      onDragDrop: (event: any, draggedItem: any, targetItem: any) => {
        const isCtrlPressed = ui?.isCtrlPressed
        if (isChildOf(draggedItem, targetItem.nodeId)) return

        if (!isCtrlPressed) {
          // insert as last child
          insertElementIntoElement(draggedItem.nodeId, targetItem.nodeId)
        } else {
          swapHtmlElements(draggedItem.nodeId, targetItem.nodeId)
        }
        selectElement(null as any)
      },
      items: mapHtmlElementsToTreeItems(
        selectedPageHtmlElements,
        selectedPageHtmlElements,
        ui?.isDraggable
      ),
      onDragging: (event: any, active: boolean, draggedItem: any) => {
        handleSetIsDragging(active, event)
      },
      expandedItems: editorState.ui.navigationMenu.expandedTreeItems ?? [],
      onToggleExpand: expandHtmlElementTreeItem,
      onToggleSelect: selectElement,
      selectedItems: [editorState.ui.selected.element ?? ''] ?? [],
      additionalActions: (item: any) => {
        const commonActions = [
          {
            label: 'Delete Element',
            tooltip: 'Delete Element and its children',
            icon: mdiDelete,
            action: deleteElement,
          },
        ]
        return !isComponentType(item?.type ?? 'html')
          ? [...commonActions]
          : [...commonActions]
      },
      actions: (item: any) => {
        const baseComponent = baseComponents?.find(
          (bc) => bc.type === item?.element?._type
        )

        return (!isComponentType(item?.type ?? 'html') &&
          !item?.element?._content) ||
          ['NavContainer'].includes(item?.type ?? '') ||
          (baseComponent &&
            'schema' in baseComponent &&
            (baseComponent?.schema as any)?.properties?.children?.type ===
              PropertyType.children)
          ? [
              {
                label: 'Insert Element here',
                tooltip: 'Insert Element here',
                icon: mdiExpandAll,
                action: handleToggleAddMenu,
              },
            ]
          : []
      },
    }
  }, [
    editorState,
    handleToggleAddMenu,
    deleteElement,
    selectElement,
    selectedPageHtmlElements,
    // actions?.ui?.navigationMenu,
    expandHtmlElementTreeItem,
    ui?.isDraggable,
    ui?.isCtrlPressed,
    swapHtmlElements,
    insertElementIntoElement,
    handleSetIsDragging,
  ])

  const handleToggleDraggable = useCallback(() => {
    setUi((current) => ({ ...current, isDraggable: !current.isDraggable }))
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
            <Typography>{editorState.ui.selected.page}</Typography>
          </Box>

          <Button
            // type="secondary"
            color={ui?.isDraggable ? 'secondary' : 'inherit'}
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
                      actions?.htmlElement?.addComponentChild?.(
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
            ? 'Swap Mode (Drop CTRL for Insert Mode)'
            : 'Insert Mode (Hold CTRL for Swap Mode)'}
        </Box>
      )}
      <AddElementModal
        open={!!ui?.addMenu}
        anchorEl={ui?.addMenu?.anchorEl ?? null}
        onClose={handleCloseAddMenu}
        currentElementId={ui?.addMenu?.nodeId ?? ''}
        editorController={editorController}
      />
    </Stack>
  )
}
