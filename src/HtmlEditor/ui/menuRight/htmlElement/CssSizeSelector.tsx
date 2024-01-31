import { Box, Stack, TextField } from "@mui/material";
import { sizePreSelectButtons } from "../../defs/_defCssPropertyButtonGroups";
import { ButtonGroup } from "../../../../components/buttons/ButtonGroupButton";
import { CSSProperties, useCallback, useState } from "react";
import { EditorControllerType } from "../../../editorController/editorController";

export type CssSizeSelectorProps = {
  editorController: EditorControllerType;
  attributeName: string;
  defaultSizeMode?: string;
};

export const CssSizeSelector = (props: CssSizeSelectorProps) => {
  const { editorController, attributeName, defaultSizeMode } = props;
  const { selectedHtmlElementStyleAttributes: elementStyles, actions } =
    editorController;
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement;

  const [ui, setUi] = useState({ sizeMode: defaultSizeMode ?? "px" });

  const handleChangeSize = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const newValue = e?.target?.value?.replace(/\D/g, "");
      changeCurrentHtmlElementStyleAttribute(
        newValue + ui?.sizeMode,
        attributeName
      );
    },
    [changeCurrentHtmlElementStyleAttribute, ui?.sizeMode, attributeName]
  );

  const handleChangeSizeMode = useCallback(
    (newValue: string) => {
      setUi((current) => ({
        ...current,
        sizeMode: newValue,
      }));
      const size = elementStyles?.[attributeName as keyof CSSProperties]
        ?.toString?.()
        ?.replace?.(/\D/g, "");
      if (!size) return;
      const val = size + newValue;
      changeCurrentHtmlElementStyleAttribute(val, attributeName);
    },
    [
      elementStyles,
      attributeName,
      changeCurrentHtmlElementStyleAttribute,
      setUi,
    ]
  );

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end">
        <ButtonGroup
          value={ui?.sizeMode}
          buttons={sizePreSelectButtons}
          onChange={handleChangeSizeMode}
        />
      </Box>
      {ui?.sizeMode !== "auto" && (
        <Stack
          direction="row"
          mt={0.5}
          width={"100%"}
          alignItems="center"
          justifyContent="flex-end"
          gap={0.5}
        >
          <Box width={120}>
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1 } }}
              onChange={handleChangeSize}
              value={
                elementStyles?.[attributeName as keyof CSSProperties]
                  ?.toString?.()
                  ?.replace(/\D/g, "") ?? ""
              }
              // placeholder="0"
            />
          </Box>
          {ui?.sizeMode.toString()}
        </Stack>
      )}
    </Box>
  );
};
