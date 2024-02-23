import { mdiPlus, mdiReact } from "@mdi/js";
import { Stack, Box, Typography } from "@mui/material";
import { ButtonSmallIconButton } from "../ButtonSmallIconButton";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { useCallback, useMemo } from "react";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";
import { EditorControllerType } from "../../editorController/editorControllerTypes";
import { isComponentType } from "../../renderElements";
import { baseComponents } from "../../editorComponents/baseComponents";
// import { findElementById } from "../../renderElements";

export type StateTabProps = {
  editorController: EditorControllerType;
};

export const StateTab = (props: StateTabProps) => {
  const { editorController } = props;
  const { editorState, actions, appState } = editorController;

  const { selectStateComponent } = actions.ui;

  const handleClickItem = useCallback(
    (newValue: string) => {
      selectStateComponent(newValue);
    },
    [selectStateComponent]
  );

  const stateTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = Object.keys(appState?.state)?.map(
      (stateKey: any) => {
        // const [baseElement] =
        //   findElementById(stateKey, selectedPageHtmlElements) ?? [];
        const baseElement = editorState?.elements?.find(
          (el) => el._id === stateKey
        );

        return {
          key: stateKey,
          nodeId: stateKey,
          labelText:
            baseElement?._type +
              ((baseElement as any)?.attributes?.id ?? baseElement?._userID
                ? `#${
                    (baseElement as any)?.attributes?.id ?? baseElement?._userID
                  }`
                : "") || stateKey,
          disableAddAction: true,
          // disableDeleteAction: themeName === "index",
          icon: isComponentType(baseElement?._type ?? "div")
            ? baseComponents?.find((com) => com.type === baseElement?._type)
                ?.icon ?? mdiReact
            : mdiReact,
          _parentId: null,
        };
      }
    );
    return treeItems;
  }, [appState, editorState?.elements]);

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
            selectedItems={[editorState.ui.selected.state ?? ""] ?? []}
            disableItemsFocusable={true}
            // onDelete={removeHtmlPage}
          />
        </Box>
      </Stack>
    </>
  );
};
