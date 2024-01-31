import { Stack, Typography, Box, useTheme } from "@mui/material";
import { CGrid } from "../../../../components/basics/CGrid";
import { ColorPicker } from "../../../../components/color/ColorPicker";
import { CSelect } from "../../../../components/inputs/CSelect";
import { useCallback, useMemo } from "react";
import { HTML_FONT_STYLES_OPTIONS } from "../../../defs/CssFontStyleDict";
import { CssSizeSelector } from "./CssSizeSelector";
import { EditorControllerType } from "../../../editorController/editorController";

export type RightMenuTypographyTabProps = {
  editorController: EditorControllerType;
};

export const RightMenuTypographyTab = (props: RightMenuTypographyTabProps) => {
  const { editorController } = props;
  const {
    selectedHtmlElementStyleAttributes: elementStyles,
    actions,
    editorState,
  } = editorController;
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement;
  const theme = useTheme();

  const handleChangeFontColor = useCallback(
    (newValue: string) => {
      changeCurrentHtmlElementStyleAttribute(newValue, "color");
    },
    [changeCurrentHtmlElementStyleAttribute]
  );

  const handleChangeFontStyle = useCallback(
    (newValue: string) =>
      changeCurrentHtmlElementStyleAttribute(newValue, "fontStyle"),
    [changeCurrentHtmlElementStyleAttribute]
  );

  const handleChangeFontFamily = useCallback(
    (newValue: string) =>
      changeCurrentHtmlElementStyleAttribute(newValue, "fontFamily"),
    [changeCurrentHtmlElementStyleAttribute]
  );

  const fontOptions = useMemo(() => {
    return editorState.fonts.map((font) => ({
      label: font,
      value: font,
    }));
  }, [editorState.fonts]);

  return (
    <>
      <Stack gap={2} borderLeft={"1px solid " + theme.palette.divider} p={1}>
        <Typography fontWeight={700} color="text.primary">
          Font
        </Typography>
        <Box>
          <CGrid gridTemplateColumns="auto auto" gap={1}>
            <Box>Size</Box>
            <CssSizeSelector
              attributeName="fontSize"
              editorController={editorController}
            />

            {/* Color */}
            <Box>Color</Box>
            <Box display="flex" justifyContent="flex-end">
              <ColorPicker
                value={elementStyles.color}
                onChange={handleChangeFontColor}
              />
            </Box>

            <Box>Style</Box>
            <Box display="flex" justifyContent="flex-end">
              <CSelect
                disableLabel={true}
                value={elementStyles?.fontStyle}
                onChange={handleChangeFontStyle}
                options={HTML_FONT_STYLES_OPTIONS}
              />
            </Box>

            <Box>Font Family</Box>
            <Box display="flex" justifyContent="flex-end">
              <CSelect
                disableLabel={true}
                value={elementStyles?.fontFamily}
                onChange={handleChangeFontFamily}
                options={fontOptions}
              />
            </Box>
          </CGrid>
        </Box>
      </Stack>
    </>
  );
};
