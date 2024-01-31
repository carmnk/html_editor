import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Popover,
  PopoverProps,
  Stack,
  Typography,
} from "@mui/material";
import { CAutoComplete } from "../../../components/inputs/CAutoComplete";
import { useCallback, useState } from "react";
import { Button } from "../../../components/buttons/Button";
import { mdiPlusBox } from "@mdi/js";
import Icon from "@mdi/react";
import { EditorControllerType } from "../../editorController/editorController";
import { baseComponents } from "../../defs/baseComponents";
import { HTML_TAG_NAMES_STRUCTURED_OPTIONS } from "../../defs/HTMLTagNamesDict";
import { CCheckbox } from "../../../components/inputs/CCheckbox";

export type AddElementModalProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  editorController: EditorControllerType;
  currentElementId: string;
};

const groupByCategory = (item: any) => item.category;

const anchorOrigin: PopoverProps["anchorOrigin"] = {
  vertical: "bottom" as const,
  horizontal: "right" as const,
};
const transformOrigin: PopoverProps["transformOrigin"] = {
  vertical: "top" as const,
  horizontal: "center" as const,
};

export const AddElementModal = (props: AddElementModalProps) => {
  const { open, anchorEl, onClose, editorController, currentElementId } = props;
  const { editorState, actions } = editorController;
  const { handleAddHtmlChild, handleAddComponentChild } = actions.htmlElement;

  const [ui, setUi] = useState<{
    selectedHtmlType: string;
    closeAfterAdd: boolean;
  }>({
    selectedHtmlType: "",
    closeAfterAdd: true,
  });

  const handleToggleCloseAfterAdd = useCallback(() => {
    setUi((prev) => ({ ...prev, closeAfterAdd: !prev.closeAfterAdd }));
  }, [setUi]);

  const handleChangeSelectedHtmlType = useCallback(
    (newValue: string) => {
      setUi((prev) => ({ ...prev, selectedHtmlType: newValue }));
    },
    [setUi]
  );

  const handleAddSpecificHtmlElement = useCallback(() => {
    handleAddHtmlChild(currentElementId, ui.selectedHtmlType);
    if (!ui.closeAfterAdd) return;
    onClose();
  }, [
    handleAddHtmlChild,
    onClose,
    ui?.selectedHtmlType,
    currentElementId,
    ui.closeAfterAdd,
  ]);

  const handleAddDiv = useCallback(() => {
    handleAddHtmlChild(currentElementId);
    if (!ui.closeAfterAdd) return;
    onClose();
  }, [handleAddHtmlChild, onClose, currentElementId, ui.closeAfterAdd]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{ mt: 0.5 }}
      slotProps={{ paper: { sx: { border: "1px solid #333" } } }}
      elevation={8}
    >
      <Box p={2}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Insert element</Typography>
          </Box>
          <Box>
            <CCheckbox
              value={!ui.closeAfterAdd}
              label="add multiple elements"
              labelTypographyProps={{ variant: "body2" }}
              tooltip="will not close the modal after adding an element"
              onChange={handleToggleCloseAfterAdd}
            />
          </Box>
        </Stack>
        <Stack direction="row" gap={4} pt={2}>
          <Box>
            <Typography>HTML Element</Typography>
            <Box pt={2}>
              <Button
                icon={mdiPlusBox}
                onClick={handleAddDiv}
              >{`Insert Div`}</Button>
              <br />
              <Typography>or choose custom</Typography>
              <Box>
                <CAutoComplete
                  value={ui?.selectedHtmlType}
                  options={HTML_TAG_NAMES_STRUCTURED_OPTIONS}
                  groupBy={groupByCategory}
                  onChange={handleChangeSelectedHtmlType}
                  sx={{ width: "180px" }}
                />
              </Box>
              <Button
                icon={mdiPlusBox}
                type="secondary"
                onClick={handleAddSpecificHtmlElement}
              >{`Insert Element`}</Button>
            </Box>
          </Box>
          <Box>
            <Typography>Component</Typography>
            <List>
              {baseComponents.map((comp) => (
                <ListItemButton
                  onClick={() => {
                    handleAddComponentChild(currentElementId, comp.type as any);
                    if (!ui.closeAfterAdd) return;
                    onClose();
                  }}
                >
                  <ListItemIcon>
                    <Icon path={comp.icon} size={1} />
                  </ListItemIcon>
                  {comp.type}
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Stack>
      </Box>
    </Popover>
  );
};
