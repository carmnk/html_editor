import { Stack, Typography, Box, useTheme } from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import { TextArea } from "../../../../components/inputs/TextArea";
import { EditorControllerType } from "../../../editorController/editorController";

export type RightMenuContentTabProps = {
  editorController: EditorControllerType;
};

export const RightMenuContentTab = (props: RightMenuContentTabProps) => {
  const { editorController } = props;
  const { actions, selectedHtmlElement } = editorController;
  const { content } = (selectedHtmlElement as any) ?? {};
  const { changeCurrentHtmlElementProp } = actions.htmlElement;

  const theme = useTheme();

  const handleChangeContent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newContent = e?.target?.value;
      const propName = "content";
      changeCurrentHtmlElementProp(propName, newContent);
    },
    [changeCurrentHtmlElementProp]
  );

  return (
    <>
      <Stack gap={2} borderLeft={"1px solid " + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Text-Content
        </Typography>
        <Box>
          <TextArea
            name="content"
            value={content ?? ""}
            onChange={handleChangeContent}
          />
        </Box>
      </Stack>
    </>
  );
};
