import { AppBar, Box, Stack, ThemeProvider, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/buttons/Button.tsx";
import {
  mdiAlphaC,
  mdiContentSave,
  mdiFileUpload,
  mdiPackageDown,
  mdiThemeLightDark,
} from "@mdi/js";
import { LeftMenu } from "./ui/LeftNavigationMenu/LeftMenu.tsx";
import { HtmlEditorElementType } from "./EditorState.tsx";
import { renderHtmlElements } from "./renderElements.tsx";
import { CBackdrop } from "../components/CBackdrop.tsx";
import { useEditorController } from "./editorController/editorController.tsx";
import { useServerController } from "./apiController.ts";
import { getFlatHtmlElements } from "./utils.ts";
import { importIconByName } from "./defs/icons.ts";
import { DropdownMenu } from "../components/dropdown/DropdownMenu.tsx";
import { DropdownMenuItem } from "../components/dropdown/DropdownMenuItem.tsx";
// import { DndContext } from "@dnd-kit/core";

export const HtmlEditor = () => {
  const theme = useTheme();
  const editorController = useEditorController();
  const { editorState, selectedPageHtmlElements, actions } = editorController;
  const { toggleEditorTheme } = actions.ui;
  const handleSelectHtmlElement = actions.ui.handleSelectHtmlElement;
  const { saveProject, handleLoadProject } = actions.project;
  const toggleThemeButtonRef = useRef<HTMLButtonElement>(null);

  const { handleRequestWebsiteZipBundle, data } =
    useServerController(editorState);
  const { loading } = data;

  const loadFileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectElement = useCallback(
    (element: HtmlEditorElementType, isHovering: boolean) => {
      if (!element?.id) return;
      handleSelectHtmlElement(element.id);
    },
    [handleSelectHtmlElement]
  );

  const handleRequestLoadFile = useCallback(() => {
    loadFileInputRef.current?.click();
  }, []);

  const waitInfo = useMemo(
    () => (
      <>
        Please wait
        <br />
        Your website bundle is created
      </>
    ),
    []
  );

  const [ui, setUi] = useState({ openThemeMenu: false });

  const [icons, setIcons] = useState<{ [key: string]: string }>({});

  const handleToggleOpenThemeMenu = useCallback(() => {
    setUi((current) => ({ ...current, openThemeMenu: !current.openThemeMenu }));
  }, []);

  useEffect(() => {
    const updateIcons = async () => {
      const flatElements = editorController.selectedPageHtmlElements
        ? getFlatHtmlElements(editorController.selectedPageHtmlElements)
        : [];
      const iconsNames = flatElements
        .map((el: any) => el?.props?.icon)
        .filter((el) => el && !Object.keys(icons).includes(el));
      if (!iconsNames.length) return;
      const iconsNew: any = {};
      for (const iconName of iconsNames) {
        if (!icons[iconName]) {
          iconsNew[iconName] = await importIconByName(iconName);
        }
      }
      setIcons((current) => ({ ...current, ...iconsNew }));
    };
    updateIcons();
  }, [editorController.selectedPageHtmlElements, icons]);

  // const handleToggleEditorTheme = useCallback(() => {
  //   toggleEditorTheme((current) => (current === "light" ? "dark" : "light"));
  // }, [toggleEditorTheme]);

  return (
    <Box
      position="fixed"
      height="100%"
      width="100%"
      top={0}
      left={0}
      bgcolor="background.paper"
    >
      <AppBar
        position="static"
        sx={{
          height: 42,
          border: "1px solid " + theme.palette.divider,
          width: "calc(100% - 0px)",
        }}
        elevation={0}
      >
        <Stack direction="row">
          {/* TOP LEFT CORNER */}
          <Box
            p={"7px"}
            pr="8px"
            borderRight={"1px solid " + theme.palette.divider}
          >
            <Button iconButton={true} icon={mdiAlphaC} disabled />
          </Box>

          {/* Rest of AppBar */}
          <Box
            p={"7px"}
            flexGrow={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              {/* <Button iconButton={true} icon={mdiHelp} type="text" disabled /> */}
            </Box>
            <Stack direction="row">
              <Button
                iconButton={true}
                icon={mdiThemeLightDark}
                type="text"
                onClick={handleToggleOpenThemeMenu}
                tooltip="Toggle Website Theme"
                ref={toggleThemeButtonRef}
              />
              <Button
                iconButton={true}
                icon={mdiPackageDown}
                type="text"
                onClick={handleRequestWebsiteZipBundle}
                tooltip="Download Website Bundle - Server is currently down"
                disabled={true} // loading
              />
              <Button
                iconButton={true}
                icon={mdiFileUpload}
                type="text"
                onClick={handleRequestLoadFile}
                tooltip="Load Project from File"
              />
              <Button
                iconButton={true}
                icon={mdiContentSave}
                type="text"
                onClick={saveProject}
                tooltip="Save Project to File"
              />
            </Stack>
          </Box>
        </Stack>
      </AppBar>

      <Box height="calc(100% - 42px)" position="relative">
        <LeftMenu editorController={editorController}>
          <ThemeProvider theme={editorState.theme}>
            <Box
              flexGrow={1}
              bgcolor={"background.paper"}
              color={"text.primary"}
              overflow={"auto"}
            >
              {renderHtmlElements(
                selectedPageHtmlElements,
                editorController,
                handleSelectElement,
                undefined,
                icons
              )}
            </Box>
          </ThemeProvider>
        </LeftMenu>
      </Box>
      <input
        type="file"
        id="load"
        style={{ visibility: "hidden", height: 0, position: "absolute" }}
        ref={loadFileInputRef}
        onChange={handleLoadProject}
      />
      <DropdownMenu
        anchorEl={toggleThemeButtonRef.current}
        open={ui?.openThemeMenu}
        onClose={handleToggleOpenThemeMenu}
      >
        {editorState?.themes?.map((theme, tIdx) => (
          <DropdownMenuItem
            key={theme.name ?? tIdx}
            id={theme.name ?? tIdx}
            label={theme.name}
            disabled={editorState?.theme?.name === theme.name}
            // icon={action.icon}
            onClick={(e: any) => {
              e.stopPropagation();
              toggleEditorTheme(theme.name);
              handleToggleOpenThemeMenu();
            }}
            // disabled={action.disabled}
          ></DropdownMenuItem>
        ))}
      </DropdownMenu>
      {loading && <CBackdrop open={true} label={waitInfo} />}
    </Box>
  );
};
