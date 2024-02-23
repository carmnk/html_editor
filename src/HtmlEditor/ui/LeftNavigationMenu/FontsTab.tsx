import {
  mdiDevices,
  mdiFileDocument,
  mdiFormatText,
  mdiPlus,
  mdiWebCheck,
} from "@mdi/js";
import { Stack, Box, Typography } from "@mui/material";
import { ButtonSmallIconButton } from "../ButtonSmallIconButton";
import { CTreeView } from "../../../components/treeview/CTreeView";
import { useCallback, useMemo } from "react";
import { StyledTreeItemProps } from "../../../components/treeview/CTreeItem";
import { EditorControllerType } from "../../editorController/editorControllerTypes";
import { SYSTEM_FONTS_NAMES } from "../../defs/CssFontFamilies";

export type FontsTabProps = {
  editorController: EditorControllerType;
};

export const FontsTab = (props: FontsTabProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;

  const { selectFont } = actions.ui;

  const handleClickItem = useCallback(
    (newValue: string) => {
      selectFont(newValue);
    },
    [selectFont]
  );

  const fontsTreeItems = useMemo(() => {
    const treeItems: StyledTreeItemProps[] = editorState.fonts.map(
      (fontName: any) => {
        const adjFontName = fontName
          ?.split(",")?.[0]
          ?.replaceAll("'", "")
          ?.replaceAll('"', "");
        return {
          key: fontName,
          nodeId: fontName,
          labelText: adjFontName,
          disableAddAction: true,
          // disableDeleteAction: themeName === "index",
          icon: SYSTEM_FONTS_NAMES?.includes(adjFontName)
            ? mdiWebCheck
            : mdiFormatText,
          _parentId: null,
        };
      }
    );
    return treeItems;
  }, [editorState.fonts]);

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
              <Typography>Fonts</Typography>
            </Box>

            <ButtonSmallIconButton
              tooltip="Add new Font"
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
            selectedItems={[editorState.ui.selected.font ?? ""] ?? []}
            disableItemsFocusable={true}
            // onDelete={removeHtmlPage}
          />
        </Box>
      </Stack>
    </>
  );
};
