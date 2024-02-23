import { Box, Divider, Stack, useTheme } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { Button } from '../../../components/buttons/Button/Button.tsx'
import {
  mdiFile,
  mdiFolderOutline,
  mdiFormatText,
  mdiImage,
  mdiReact,
  mdiSpeedometer,
  mdiThemeLightDark,
  mdiTranslate,
} from '@mdi/js'
import { RightMenu } from '../menuRight/RightMenu.tsx'
import { EditorStateLeftMenuTabs } from '../../editorController/editorState.ts'
import { PageTab } from './PageTab.tsx'
import { ProjectTab } from './ProjectTab.tsx'
import { CssTab } from './CssTab.tsx'
import { AssetsTab } from './AssetsTab.tsx'
import { CssFileIcon } from '../../../components/icons/CssFileIcon.tsx'
import { ThemesTab } from './ThemesTab.tsx'
import { FontsTab } from './FontsTab.tsx'
import { StateTab } from './StateTab.tsx'
import { EditorControllerType } from '../../editorController/editorControllerTypes.ts'
import { ButtonType } from '../../../components/buttons/Button/Types.tsx'

export type LeftMainMenuProps = PropsWithChildren<{
  editorController: EditorControllerType
}>

export const LeftMenu = (props: LeftMainMenuProps) => {
  const { children, editorController } = props
  const { editorState, actions } = editorController
  const { switchNavigationTab } = actions.ui.navigationMenu
  const theme = useTheme()

  const handleSwitchTab = React.useMemo(() => {
    return Object.keys(EditorStateLeftMenuTabs).reduce(
      (acc: { [key: string]: () => void }, key: string) => {
        acc[key] = () => {
          switchNavigationTab(
            EditorStateLeftMenuTabs[key as keyof typeof EditorStateLeftMenuTabs]
          )
        }
        return acc
      },
      {}
    ) as { [key in keyof typeof EditorStateLeftMenuTabs]: () => void }
  }, [switchNavigationTab])
  handleSwitchTab

  const activeNavigationTab = editorState.ui.navigationMenu.activeTab

  return (
    <Stack direction="row" height="100%" width="100%">
      <Stack
        direction="row"
        height="100%"
        borderRight={'1px solid ' + theme.palette.divider}
      >
        {/* MainMenu (icons) */}
        <Stack gap={1} p={1}>
          <Button
            tooltip="Project"
            iconButton={true}
            icon={mdiFolderOutline}
            type={
              activeNavigationTab === 'project' ? undefined : ButtonType.text
            }
            onClick={handleSwitchTab.PROJECT}
            disableInteractiveTooltip={true}
          />
          <Button
            tooltip="Page"
            iconButton={true}
            icon={mdiFile}
            type={activeNavigationTab === 'page' ? undefined : ButtonType.text}
            onClick={handleSwitchTab.PAGE}
            disableInteractiveTooltip={true}
          />
          <Button
            tooltip="CSS"
            iconButton={true}
            icon={<CssFileIcon />}
            type={activeNavigationTab === 'css' ? undefined : ButtonType.text}
            onClick={handleSwitchTab.CSS}
            disableInteractiveTooltip={true}
          />
          <Divider />
          <Button
            tooltip="Themes"
            iconButton={true}
            icon={mdiThemeLightDark}
            type={activeNavigationTab === 'theme' ? undefined : ButtonType.text}
            onClick={handleSwitchTab.Theme}
            disableInteractiveTooltip={true}
          />
          <Divider />
          <Button
            tooltip="Images"
            iconButton={true}
            icon={mdiImage}
            type={
              activeNavigationTab === 'assets' ? undefined : ButtonType.text
            }
            onClick={handleSwitchTab.ASSETS}
            disableInteractiveTooltip={true}
          />
          <Button
            tooltip="Localization"
            disabled={true}
            iconButton={true}
            icon={mdiTranslate}
            type={
              activeNavigationTab === 'localization'
                ? undefined
                : ButtonType.text
            }
            disableInteractiveTooltip={true}
            // onClick={handleSwitchTab.CSS}
          />
          <Button
            tooltip="Fonts"
            // disabled={true}
            iconButton={true}
            icon={mdiFormatText}
            type={activeNavigationTab === 'font' ? undefined : ButtonType.text}
            onClick={handleSwitchTab.Font}
            disableInteractiveTooltip={true}
          />
          <Divider />
          <Button
            tooltip="State"
            // disabled={true}
            iconButton={true}
            icon={mdiSpeedometer}
            type={activeNavigationTab === 'state' ? undefined : ButtonType.text}
            onClick={handleSwitchTab.State}
            disableInteractiveTooltip={true}
          />{' '}
        </Stack>
        <Box
          borderLeft={'1px solid ' + theme.palette.divider}
          width={320}
          p={1}
        >
          {/* SubMenu */}
          {/* <Stack
          gap={2}
          // borderLeft={"1px solid " + theme.palette.divider}
          height="100%"
          pr={2}
          minWidth={220}
        > */}
          {activeNavigationTab === 'page' ? (
            <PageTab editorController={editorController} />
          ) : activeNavigationTab === 'project' ? (
            <ProjectTab editorController={editorController} />
          ) : activeNavigationTab === 'css' ? (
            <CssTab editorController={editorController} />
          ) : activeNavigationTab === 'assets' ? (
            <AssetsTab editorController={editorController} />
          ) : activeNavigationTab === 'theme' ? (
            <ThemesTab editorController={editorController} />
          ) : activeNavigationTab === 'font' ? (
            <FontsTab editorController={editorController} />
          ) : activeNavigationTab === 'state' ? (
            <StateTab editorController={editorController} />
          ) : null}
        </Box>
      </Stack>

      {/* </Stack> */}

      {/* Content (edited site) */}
      {children}
      <RightMenu editorController={editorController} />
    </Stack>
  )
}
