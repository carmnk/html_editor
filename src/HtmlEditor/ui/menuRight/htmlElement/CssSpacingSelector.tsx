import { Box, TextField, useTheme } from "@mui/material";
import { CSSProperties, ChangeEvent, useMemo } from "react";
import { EditorControllerType } from "../../../editorController";

export type StyleSpacingSelectorProps = {
  elementStyles: CSSProperties;
  editorController: EditorControllerType;
};

export const StyleSpacingSelector = (props: StyleSpacingSelectorProps) => {
  const { elementStyles, editorController } = props;
  const { actions } = editorController;
  const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement;
  const theme = useTheme();

  const handleChangeSpacingProp = useMemo(() => {
    return {
      marginTop: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("marginTop", newValue + "px");
      },
      marginLeft: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("marginLeft", newValue + "px");
      },
      marginRight: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("marginRight", newValue + "px");
      },
      marginBottom: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("marginBottom", newValue + "px");
      },
      paddingTop: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("paddingTop", newValue + "px");
      },
      paddingLeft: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("paddingLeft", newValue + "px");
      },
      paddingRight: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute("paddingRight", newValue + "px");
      },
      paddingBottom: (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.target?.value?.replace(/\D/g, "");
        changeCurrentHtmlElementStyleAttribute(
          "paddingBottom",
          newValue + "px"
        );
      },
    };
  }, [changeCurrentHtmlElementStyleAttribute]);

  const squareSize = 32;

  return (
    <Box display="flex" justifyContent="flex-end">
      <Box border={"1px solid " + theme.palette.text.primary}>
        <Box display="flex">
          <Box width={2 * squareSize} />
          <Box width={squareSize} textAlign="center">
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.marginTop}
              value={
                elementStyles?.marginTop?.toString?.()?.replace(/\D/g, "") ?? ""
              }
              placeholder="0"
            />
          </Box>
          <Box width={2 * squareSize} />
        </Box>
        <Box display="flex">
          <Box width={squareSize} />
          <Box
            width={squareSize}
            borderTop={"1px solid " + theme.palette.text.primary}
            borderLeft={"1px solid " + theme.palette.text.primary}
          />
          <Box
            width={squareSize}
            textAlign="center"
            borderTop={"1px solid " + theme.palette.text.primary}
          >
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.paddingTop}
              value={
                elementStyles?.paddingTop?.toString?.()?.replace(/\D/g, "") ??
                ""
              }
              placeholder="0"
            />
          </Box>
          <Box
            width={squareSize}
            borderRight={"1px solid " + theme.palette.text.primary}
            borderTop={"1px solid " + theme.palette.text.primary}
          />
          <Box width={squareSize} />
        </Box>
        <Box display="flex">
          <Box width={squareSize} textAlign="center">
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.marginLeft}
              value={
                elementStyles?.marginLeft?.toString?.()?.replace(/\D/g, "") ??
                ""
              }
              placeholder="0"
            />
          </Box>
          <Box
            width={squareSize}
            textAlign="center"
            borderLeft={"1px solid " + theme.palette.text.primary}
          >
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.paddingLeft}
              value={
                elementStyles?.paddingLeft?.toString?.()?.replace(/\D/g, "") ??
                ""
              }
              placeholder="0"
            />
          </Box>
          <Box
            width={squareSize}
            textAlign="center"
            border={"1px solid " + theme.palette.text.primary}
          ></Box>
          <Box
            width={squareSize - 2} // -2 to account for border?
            textAlign="center"
            borderRight={"1px solid " + theme.palette.text.primary}
          >
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.paddingRight}
              value={
                elementStyles?.paddingRight?.toString?.()?.replace(/\D/g, "") ??
                ""
              }
              placeholder="0"
            />
          </Box>
          <Box width={squareSize} textAlign="center">
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.marginRight}
              value={
                elementStyles?.marginRight?.toString?.()?.replace(/\D/g, "") ??
                ""
              }
              placeholder="0"
            />
          </Box>
        </Box>
        <Box display="flex">
          <Box width={squareSize} />
          <Box
            width={squareSize}
            borderLeft={"1px solid " + theme.palette.text.primary}
            borderBottom={"1px solid " + theme.palette.text.primary}
          />
          <Box
            width={squareSize}
            textAlign="center"
            borderBottom={"1px solid " + theme.palette.text.primary}
          >
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.paddingBottom}
              value={
                elementStyles?.paddingBottom
                  ?.toString?.()
                  ?.replace(/\D/g, "") ?? ""
              }
              placeholder="0"
            />
          </Box>
          <Box
            width={squareSize}
            borderBottom={"1px solid " + theme.palette.text.primary}
            borderRight={"1px solid " + theme.palette.text.primary}
          />
          <Box width={squareSize} />
        </Box>
        <Box display="flex">
          <Box width={squareSize} />
          <Box width={squareSize} />
          <Box width={squareSize} textAlign="center">
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1, textAlign: "center" } }}
              onChange={handleChangeSpacingProp.marginBottom}
              value={
                elementStyles?.marginBottom?.toString?.()?.replace(/\D/g, "") ??
                ""
              }
              placeholder="0"
            />
          </Box>
          <Box width={2 * squareSize} />
        </Box>
      </Box>
    </Box>
  );
};
