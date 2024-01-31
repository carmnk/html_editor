import { Stack, Typography, useTheme, Theme, Palette } from "@mui/material";
import { useCallback, useMemo } from "react";
import { EditorControllerType } from "../../../editorController/editorController";
import { ThemeColorSelector } from "./themeColorSelector";
import { ThemeOtherColorSelector } from "./themeOtherColorSelector";

export type ThemeMenuProps = {
  editorController: EditorControllerType;
};

const muiPaletteColors = [
  "primary",
  "secondary",
  "error",
  "warning",
  "info",
  "success",
  "text",
];

export const ThemeMenu = (props: ThemeMenuProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;
  // const { handleSelectTheme } = actions.ui.navigationMenu;
  const { handleChangeThemePaletteColor } = actions.ui;
  // const theme = useTheme();

  const changeColor = useCallback(
    (
      colorKey: keyof Palette,
      newValue: string,
      variant: "light" | "main" | "dark"
    ) => {
      const themeName = editorState?.ui?.navigationMenu?.selectedTheme ?? "";

      if (!themeName) return;
      handleChangeThemePaletteColor({
        themeName,
        colorKey,
        subKey: variant,
        newValue: newValue,
      });
    },
    [
      editorState?.ui?.navigationMenu?.selectedTheme,
      handleChangeThemePaletteColor,
    ]
  );

  const handleChangeColor: {
    [key in keyof Theme["palette"]]: (
      newValue: string,
      variant: "light" | "main" | "dark"
    ) => void;
  } = useMemo(
    () =>
      muiPaletteColors.reduce((acc, col) => {
        return {
          ...acc,
          [col]: (newValue: string, variant: "light" | "main" | "dark") => {
            changeColor(col as keyof Palette, newValue, variant);
          },
        };
      }, {}) as any,

    [changeColor]
  );

  const websiteTheme = editorState?.theme;
  return (
    <>
      <Stack
        gap={2}
        borderLeft={"1px solid " + websiteTheme.palette.divider}
        p={1}
      >
        {/* <ClickTextField
          value={editorState?.ui?.navigationMenu?.selectedTheme ?? ""}
          onChange={() => {}}
        /> */}
        <Typography
          color="text.primary"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          variant="h5"
        >
          {editorState?.ui?.navigationMenu?.selectedTheme ?? ""}
        </Typography>
        <Typography fontWeight={700} color="text.primary">
          Palette
        </Typography>
        <ThemeColorSelector
          colorName="primary"
          {...websiteTheme.palette.primary}
          onChange={handleChangeColor.primary}
        />
        <ThemeColorSelector
          colorName="secondary"
          {...websiteTheme.palette.secondary}
          onChange={handleChangeColor.secondary}
        />
        <ThemeColorSelector
          colorName="success"
          {...websiteTheme.palette.success}
          onChange={handleChangeColor.success}
        />
        <ThemeColorSelector
          colorName="warning"
          {...websiteTheme.palette.warning}
          onChange={handleChangeColor.warning}
        />
        <ThemeColorSelector
          colorName="error"
          {...websiteTheme.palette.error}
          onChange={handleChangeColor.error}
        />
        <ThemeColorSelector
          colorName="info"
          {...websiteTheme.palette.info}
          onChange={handleChangeColor.info}
        />
        <ThemeOtherColorSelector
          colorName="text"
          color={websiteTheme.palette.text as any}
          // {...websiteTheme.palette.text}
          onChange={handleChangeColor.text as any}
        />
      </Stack>

      {/* <CTabs
        value={ui?.selectedTab}
        onChange={handleChangeTab}
        items={menuTabs}
      /> */}
    </>
  );
};
