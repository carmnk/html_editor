import { Box, Divider, Stack, useTheme } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { Button } from "../../../components/buttons/Button.tsx";
import {
  mdiFile,
  mdiFolderOutline,
  mdiFormatText,
  mdiImage,
  mdiReact,
  mdiSpeedometer,
  mdiThemeLightDark,
  mdiTranslate,
} from "@mdi/js";
import { RightMenu } from "../menuRight/RightMenu.tsx";
import { EditorStateLeftMenuTabs } from "../../EditorState.tsx";
import { PageTab } from "./PageTab.tsx";
import { ProjectTab } from "./ProjectTab.tsx";
import { CssTab } from "./CssTab.tsx";
import { AssetsTab } from "./AssetsTab.tsx";
import { CssFileIcon } from "../../../components/icons/CssFileIcon.tsx";
import { EditorControllerType } from "../../editorController/editorController.tsx";
import { ThemesTab } from "./ThemesTab.tsx";
import { FontsTab } from "./FontsTab.tsx";
import { StateTab } from "./StateTab.tsx";

export type LeftMainMenuProps = PropsWithChildren<{
  editorController: EditorControllerType;
}>;

export const LeftMenu = (props: LeftMainMenuProps) => {
  const { children, editorController } = props;
  const { editorState, actions } = editorController;
  const { handleSwitchNavigationTab } = actions.ui.navigationMenu;
  const theme = useTheme();

  const handleSwitchTab = React.useMemo(() => {
    return Object.keys(EditorStateLeftMenuTabs).reduce(
      (acc: { [key: string]: () => void }, key: string) => {
        acc[key] = () => {
          handleSwitchNavigationTab(
            EditorStateLeftMenuTabs[key as keyof typeof EditorStateLeftMenuTabs]
          );
        };
        return acc;
      },
      {}
    ) as { [key in keyof typeof EditorStateLeftMenuTabs]: () => void };
  }, [handleSwitchNavigationTab]);
  handleSwitchTab;

  const activeNavigationTab = editorState.ui.navigationMenu.activeTab;

  return (
    <Stack direction="row" height="100%" width="100%">
      <Stack
        direction="row"
        height="100%"
        borderRight={"1px solid " + theme.palette.divider}
      >
        {/* MainMenu (icons) */}
        <Stack gap={1} p={1}>
          <Button
            tooltip="Project"
            iconButton={true}
            icon={mdiFolderOutline}
            type={activeNavigationTab === "project" ? undefined : "text"}
            onClick={handleSwitchTab.PROJECT}
          />
          <Button
            tooltip="Page"
            iconButton={true}
            icon={mdiFile}
            type={activeNavigationTab === "page" ? undefined : "text"}
            onClick={handleSwitchTab.PAGE}
          />
          <Button
            tooltip="Components"
            disabled={true}
            iconButton={true}
            icon={mdiReact}
            type={activeNavigationTab === "image" ? undefined : "text"}
            // onClick={handleSwitchTab.CSS}
          />
          <Divider />
          <Button
            tooltip="Themes"
            iconButton={true}
            icon={mdiThemeLightDark}
            type={activeNavigationTab === "theme" ? undefined : "text"}
            onClick={handleSwitchTab.Theme}
          />
          <Divider />
          <Button
            tooltip="CSS"
            iconButton={true}
            icon={<CssFileIcon />}
            type={activeNavigationTab === "css" ? undefined : "text"}
            onClick={handleSwitchTab.CSS}
          />
          <Button
            tooltip="Images"
            iconButton={true}
            icon={mdiImage}
            type={activeNavigationTab === "assets" ? undefined : "text"}
            onClick={handleSwitchTab.ASSETS}
          />
          <Button
            tooltip="Localization"
            disabled={true}
            iconButton={true}
            icon={mdiTranslate}
            type={activeNavigationTab === "localization" ? undefined : "text"}
            // onClick={handleSwitchTab.CSS}
          />
          <Button
            tooltip="Fonts"
            // disabled={true}
            iconButton={true}
            icon={mdiFormatText}
            type={activeNavigationTab === "font" ? undefined : "text"}
            onClick={handleSwitchTab.Font}
          />
          <Button
            tooltip="State"
            // disabled={true}
            iconButton={true}
            icon={mdiSpeedometer}
            type={activeNavigationTab === "state" ? undefined : "text"}
            onClick={handleSwitchTab.State}
          />{" "}
        </Stack>
        <Box borderLeft={"1px solid " + theme.palette.divider} width={320}>
          {/* SubMenu */}
          {/* <Stack
          gap={2}
          // borderLeft={"1px solid " + theme.palette.divider}
          height="100%"
          pr={2}
          minWidth={220}
        > */}
          {activeNavigationTab === "page" ? (
            <PageTab editorController={editorController} />
          ) : activeNavigationTab === "project" ? (
            <ProjectTab editorController={editorController} />
          ) : activeNavigationTab === "css" ? (
            <CssTab editorController={editorController} />
          ) : activeNavigationTab === "assets" ? (
            <AssetsTab editorController={editorController} />
          ) : activeNavigationTab === "theme" ? (
            <ThemesTab editorController={editorController} />
          ) : activeNavigationTab === "font" ? (
            <FontsTab editorController={editorController} />
          ) : activeNavigationTab === "state" ? (
            <StateTab editorController={editorController} />
          ) : null}
        </Box>
      </Stack>

      {/* </Stack> */}

      {/* Content (edited site) */}
      {children}
      <RightMenu editorController={editorController} />
    </Stack>
  );
};
