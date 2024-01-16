import { AppBar, Box, Stack, ThemeProvider, useTheme } from "@mui/material";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "../components/buttons/Button.tsx";
import {
  mdiAlphaC,
  mdiContentSave,
  mdiFileUpload,
  mdiHelp,
  mdiPackageDown,
  mdiThemeLightDark,
} from "@mdi/js";
import { LeftMenu } from "./ui/LeftNavigationMenu/LeftMenu.tsx";
import { HtmlEditorElementType } from "./EditorState.tsx";
import { renderHtmlElements } from "./renderElements.tsx";
import { CBackdrop } from "../components/CBackdrop.tsx";
import { useEditorController } from "./editorController.tsx";
import { useServerController } from "./apiController.ts";

export const HtmlEditor = () => {
  const theme = useTheme();
  const editorController = useEditorController();
  const { editorState, selectedPageHtmlElements, actions } = editorController;
  const { toggleEditorTheme } = actions.ui;
  const { saveProject, handleLoadProject } = actions.project;

  const { handleRequestWebsiteZipBundle, data } =
    useServerController(editorState);
  const { loading } = data;

  const loadFileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectElement = useCallback(
    (element: HtmlEditorElementType, isHovering: boolean) => {
      console.log("handleSelectElement", element, isHovering);
    },
    []
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
  return (
    <Box
      position="fixed"
      height="100%"
      width="100%"
      top={0}
      left={0}
      zIndex={100000}
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
                onClick={toggleEditorTheme}
                tooltip="Toggle Website Theme"
              />
              <Button
                iconButton={true}
                icon={mdiPackageDown}
                type="text"
                onClick={handleRequestWebsiteZipBundle}
                tooltip="Download Website Bundle"
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
                editorState,
                handleSelectElement
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
      {loading && <CBackdrop open={true} label={waitInfo} />}
    </Box>
  );
};
