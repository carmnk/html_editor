import {
  AppBar,
  Badge,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/buttons/Button/Button.tsx'
import {
  mdiAccount,
  mdiAlphaC,
  mdiCloudArrowDown,
  mdiCloudArrowUp,
  mdiCursorPointer,
  mdiGestureTapButton,
  mdiHelp,
  mdiPackageDown,
  mdiPencil,
  mdiPlay,
  mdiPlayNetworkOutline,
  mdiThemeLightDark,
} from '@mdi/js'
import { LeftMenu } from './ui/LeftNavigationMenu/LeftMenu.tsx'
import { ElementType } from './editorController/editorState.ts'
import { renderHtmlElements } from './renderElements.tsx'
import { CBackdrop } from '../components/CBackdrop.tsx'
import { useEditorController } from './editorController/editorController.ts'
import { useServerController } from './apiController/apiController.ts'
import { importIconByName } from './defs/icons.ts'
import { DropdownMenu } from '../components/dropdown/DropdownMenu.tsx'
import { DropdownMenuItem } from '../components/dropdown/DropdownMenuItem.tsx'
import { UI_POINTER_MODE_OPTIONS } from './defs/uiPointerMode.ts'
import { CTabs } from '../components/navigation/CTabs.tsx'
import { get, uniq } from 'lodash'
import { UserMenu } from './UserMenu.tsx'
import CTextField from '../components/inputs/CTextField.tsx'
import { TextArea } from '../components/inputs/TextArea.tsx'
import { Flex } from '../components/basics/Flex.tsx'
import { API } from '../api/API.ts'
import { LoadProjectDialog } from './LoadProjectDialog.tsx'
import { ButtonType } from '../components/buttons/Button/Types.tsx'
import { baseComponents } from './editorComponents/baseComponents.ts'

// import { DndContext } from "@dnd-kit/core";

const getIconKeys = (elementType: ElementType['_type']) => {
  const baseComponent = baseComponents.find((com) => com.type === elementType)
  if (!baseComponent) return { directIconKeys: [], arrayOfObjectProperties: [] }
  const properties =
    ('schema' in baseComponent && baseComponent?.schema?.properties) || []
  const directIconKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'icon'
  )
  const directArrayKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'array'
  )
  const arrayOfObjectProperties = directArrayKeys.map((key) => {
    const arrayProperties = properties[key].items?.[0]?.properties
    const arrayPropertyKeys = Object.keys(arrayProperties)
    const iconPropertyKeys = arrayPropertyKeys.filter(
      (key) => arrayProperties[key].type === 'icon'
    )
    return {
      key,
      properties: arrayProperties,
      propertyKeys: iconPropertyKeys,
    }
  }) // eg. key=items -> properties

  const arrayOfObjectIconKeys = arrayOfObjectProperties
    .map((array) => array.propertyKeys)
    ?.flat()
  return { directIconKeys, arrayOfObjectProperties, arrayOfObjectIconKeys }
}

export const HtmlEditor = () => {
  const theme = useTheme()
  const editorController = useEditorController()
  const {
    editorState,
    setEditorState,
    selectedPageHtmlElements2: selectedPageHtmlElements,
    actions,
    appState,
  } = editorController
  const {
    toggleEditorTheme,
    changePointerMode,
    selectHtmlPage,
    selectElement,
    togglePreviewMode,
  } = actions.ui
  const { saveProject, loadProject } = actions.project
  const toggleThemeButtonRef = useRef<HTMLButtonElement>(null)
  const togglePointerModeButtonRef = useRef<HTMLButtonElement>(null)
  const userDropdownButton = useRef<HTMLButtonElement>(null)
  const togglePageTabButtonRef = useRef<HTMLElement>(null)

  const serverController = useServerController(
    editorState,
    setEditorState,
    appState
  )
  const { actions: serverActions, data } = serverController
  const {
    handleRequestWebsiteZipBundle,
    saveProjectToCloud,
    loadProjectFromCload,
    changeLogInStatus,
    deleteProjectFromCloud,
  } = serverActions
  const { loading } = data.bundleData

  const loadFileInputRef = useRef<HTMLInputElement>(null)

  const handleChangeProjectName = useCallback(
    (newValue, e: any) => {
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, project_name: newValue },
      }))
    },
    [setEditorState]
  )
  const handleChangeProjectDescription = useCallback(
    (e: any) => {
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, project_description: e.target.value },
      }))
    },
    [setEditorState]
  )

  const handleSelectElement = useCallback(
    (element: ElementType, isHovering: boolean) => {
      if (!element?._id) return
      selectElement(element._id)
    },
    [selectElement]
  )

  const handleRequestLoadFile = useCallback(() => {
    loadFileInputRef.current?.click()
  }, [])

  const waitInfo = useMemo(
    () => (
      <>
        Please wait
        <br />
        Your website bundle is created
      </>
    ),
    []
  )

  const [ui, setUi] = useState({
    openThemeMenu: false,
    openPointerModeMenu: false,
    openPageTabMenu: false,
    openUserMenu: false,
    loadMenu: {
      open: false,
      data: null as any,
    },
    saveMenuOpen: false,
  })

  const handleToggleSaveMenu = useCallback(() => {
    setUi((current) => ({ ...current, saveMenuOpen: !current.saveMenuOpen }))
  }, [])

  const updateProjects = useCallback(async () => {
    try {
      const res = await API.getProjects.query()
      setUi((current) => ({
        ...current,
        loadMenu: { open: true, data: res?.data?.data },
      }))
    } catch (e) {
      changeLogInStatus(false)
    }
  }, [changeLogInStatus])

  const handleToggleLoadMenu = useCallback(async () => {
    if (!ui?.loadMenu?.open) {
      await updateProjects()
    } else {
      setUi((current) => ({
        ...current,
        loadMenu: { open: !current.loadMenu.open, data: null },
      }))
    }
  }, [ui?.loadMenu?.open, updateProjects])

  const [icons, setIcons] = useState<{ [key: string]: string }>({})

  const handleToggleOpenThemeMenu = useCallback(() => {
    setUi((current) => ({ ...current, openThemeMenu: !current.openThemeMenu }))
  }, [])
  const handleTogglePointerModeMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      openPointerModeMenu: !current.openPointerModeMenu,
    }))
  }, [])
  const handleTogglePageTabMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      openPageTabMenu: !current.openPageTabMenu,
    }))
  }, [])

  const handleToggleUserMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      openUserMenu: !current.openUserMenu,
    }))
  }, [])

  useEffect(() => {
    const updateIcons = async () => {
      const flatElements = editorController.selectedPageHtmlElements2
      const iconsNames = flatElements
        .map((el: any) => {
          const {
            directIconKeys,
            arrayOfObjectProperties,
            arrayOfObjectIconKeys,
          } = getIconKeys(el.type)

          const directIconNames = directIconKeys.map(
            (iconKey) => el?.props?.[iconKey]
          )
          const arrayItemIconNames = arrayOfObjectProperties
            ?.map((props) => {
              return el?.props?.[props.key]?.map((it: any) => {
                return props.propertyKeys.map((key) => it?.[key])
              })
            })
            .flat()
          const allIconNames = [...directIconNames, ...arrayItemIconNames]
          // return directIconNames
          return [...directIconNames, ...arrayItemIconNames]
        })
        .flat()
        .filter((el) => el && !Object.keys(icons).includes(el))
      if (!iconsNames.length) return
      const iconsNew: any = {}
      for (const iconName of iconsNames) {
        if (!icons[iconName]) {
          iconsNew[iconName] = await importIconByName(iconName)
        }
      }
      setIcons((current) => ({ ...current, ...iconsNew }))
    }
    updateIcons()
  }, [editorController.selectedPageHtmlElements2])

  const pageOptions = useMemo(() => {
    return (
      uniq(editorState.elements.map((el) => el._page))?.map((pageName) => ({
        value: pageName,
        label: pageName,
      })) ?? []
    )
  }, [editorState.elements])
  const currentPageOption = pageOptions.filter(
    (page) => page.value === editorState.ui.selected.page
  )

  const loggedInStatus = useCallback(() => {
    const expires = localStorage.getItem('expires')
    const email = localStorage.getItem('email')
    return { expires, email }
  }, [])

  const handleSaveProjectToCloud = useCallback(() => {
    saveProjectToCloud(editorState)
  }, [saveProjectToCloud, editorState])

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
          border: '1px solid ' + theme.palette.divider,
          width: 'calc(100% - 0px)',
        }}
        elevation={0}
      >
        <Stack direction="row" height="100%">
          {/* TOP LEFT SMALL CORNER */}
          <Box
            p={'7px'}
            pr="8px"
            borderRight={'1px solid ' + theme.palette.divider}
          >
            <Button iconButton={true} icon={mdiAlphaC} disabled />
          </Box>

          {/* AppBar above leftmenu+content */}
          <Box
            // p={"7px"}
            flexGrow={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pl={2}
          >
            <Box>
              <Button
                iconButton={true}
                icon={mdiHelp}
                type={ButtonType.text}
                disabled
              />
            </Box>
            <Box>
              <Stack
                direction="row"
                height="100%"
                alignItems="center"
                width="100%"
                justifyContent="flex-end"
              >
                <Button
                  iconButton={true}
                  icon={editorState?.ui?.previewMode ? mdiPencil : mdiPlay}
                  type={
                    editorState?.ui?.previewMode
                      ? ButtonType.primary
                      : ButtonType.text
                  }
                  color={editorState?.ui?.previewMode ? 'secondary' : 'primary'}
                  onClick={togglePreviewMode}
                  tooltip="Toggle Preview Mode"
                />
                <Button
                  iconButton={true}
                  icon={mdiThemeLightDark}
                  type={ButtonType.text}
                  onClick={handleToggleOpenThemeMenu}
                  tooltip="Toggle Website Theme"
                  ref={toggleThemeButtonRef}
                />
                <Button
                  iconButton={true}
                  icon={
                    editorState.ui.pointerMode === 'production'
                      ? mdiGestureTapButton
                      : mdiCursorPointer
                  }
                  type={ButtonType.text}
                  onClick={handleTogglePointerModeMenu}
                  tooltip={`Pointer Mode - ${editorState.ui.pointerMode}`}
                  ref={togglePointerModeButtonRef}
                />
                <Box mt="10px">
                  <CTabs
                    ref={togglePageTabButtonRef as any}
                    items={currentPageOption}
                    value={currentPageOption?.[0]?.value ?? ''}
                    onChange={handleTogglePageTabMenu}
                  />
                </Box>
              </Stack>
            </Box>
          </Box>
          {/*  Top Right corner of Appbar (above RightMenu) */}
          <Box width={editorState.ui.detailsMenu.width} height="100%">
            <Stack
              direction="row"
              height="100%"
              alignItems="center"
              width="100%"
              justifyContent="flex-end"
              px={2}
            >
              {/* <Button
                iconButton={true}
                icon={mdiFileUpload}
                type="text"
                onClick={handleRequestLoadFile}
                tooltip="Load Project from File"
              /> */}
              {/* <Button
                iconButton={true}
                icon={mdiContentSave}
                type="text"
                onClick={saveProject}
                tooltip="Save Project to File"
              /> */}
              {loggedInStatus().email && (
                <>
                  <Button
                    iconButton={true}
                    icon={mdiPlayNetworkOutline}
                    type={ButtonType.text}
                    onClick={() => {
                      window.open(`/testapp/`, '_blank', 'noopener,noreferrer')
                    }}
                    tooltip="Open hosted Test App"
                    // disabled={true} // loading
                  />
                  <Button
                    iconButton={true}
                    icon={mdiPackageDown}
                    type={ButtonType.text}
                    onClick={handleRequestWebsiteZipBundle}
                    tooltip="Deploy to hosted Test App"
                    // disabled={true} // loading
                  />
                  <Button
                    iconButton={true}
                    icon={mdiCloudArrowDown}
                    type={ButtonType.text}
                    onClick={handleToggleLoadMenu}
                    tooltip="Load Project from Cloud"
                  />

                  <Button
                    iconButton={true}
                    icon={mdiCloudArrowUp}
                    type={ButtonType.text}
                    onClick={handleToggleSaveMenu}
                    tooltip="Save Project to Cloud"
                  />
                </>
              )}
              <Badge
                badgeContent={loggedInStatus()?.email ? '✔' : undefined}
                // sx={{ transform: 'translate(0px, 4px)' }}
                slotProps={{
                  badge: { sx: { transform: 'translate(5px, -4px)' } } as any,
                }}
              >
                <Button
                  type={ButtonType.primary}
                  iconButton={true}
                  icon={mdiAccount}
                  onClick={handleToggleUserMenu}
                  tooltip="Login"
                  ref={userDropdownButton}
                />
              </Badge>
            </Stack>
          </Box>
        </Stack>
      </AppBar>

      <Box height="calc(100% - 42px)" position="relative">
        <LeftMenu editorController={editorController}>
          <ThemeProvider theme={editorState.theme}>
            <Box
              flexGrow={1}
              bgcolor={'background.paper'}
              color={'text.primary'}
              overflow={'auto'}
              position={editorState.ui.previewMode ? 'absolute' : undefined}
              width={editorState.ui.previewMode ? '100%' : undefined}
              height={editorState.ui.previewMode ? '100%' : undefined}
            >
              {renderHtmlElements(
                selectedPageHtmlElements,
                editorController,
                handleSelectElement,
                false,
                icons,
                undefined,
                editorState.ui.pointerMode === 'production'
              )}
            </Box>
          </ThemeProvider>
        </LeftMenu>
      </Box>
      <input
        type="file"
        id="load"
        style={{ visibility: 'hidden', height: 0, position: 'absolute' }}
        ref={loadFileInputRef}
        onChange={loadProject}
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
              e.stopPropagation()
              toggleEditorTheme(theme.name)
              handleToggleOpenThemeMenu()
            }}
            // disabled={action.disabled}
          ></DropdownMenuItem>
        ))}
      </DropdownMenu>
      <DropdownMenu
        anchorEl={togglePointerModeButtonRef.current}
        open={ui?.openPointerModeMenu}
        onClose={handleTogglePointerModeMenu}
      >
        {UI_POINTER_MODE_OPTIONS?.map((mode, mIdx) => (
          <DropdownMenuItem
            key={mode.value}
            id={mode.value}
            label={mode.label}
            disabled={editorState.ui.pointerMode === mode.value}
            tooltip={mode.tooltip}
            // icon={action.icon}
            onClick={(e: any) => {
              e.stopPropagation()
              changePointerMode(mode.value as any)
              // toggleEditorTheme(theme.name);
              handleTogglePointerModeMenu()
            }}
            // disabled={action.disabled}
          ></DropdownMenuItem>
        ))}
      </DropdownMenu>
      <DropdownMenu
        anchorEl={togglePageTabButtonRef.current}
        open={ui?.openPageTabMenu}
        onClose={handleTogglePageTabMenu}
      >
        {pageOptions?.map((page, mIdx) => (
          <DropdownMenuItem
            key={page.value}
            id={page.value}
            label={page.label}
            disabled={editorState.ui.pointerMode === page.value}
            // icon={action.icon}
            onClick={(e: any) => {
              e.stopPropagation()
              selectHtmlPage(page.value)
              handleTogglePageTabMenu()
            }}
            // disabled={action.disabled}
          ></DropdownMenuItem>
        ))}
      </DropdownMenu>

      <UserMenu
        anchorEl={userDropdownButton.current}
        open={!!ui?.openUserMenu}
        onClose={handleToggleUserMenu}
        serverController={serverController}
      />

      {/* Save Project */}
      <Dialog
        open={ui?.saveMenuOpen}
        fullWidth={true}
        maxWidth="sm"
        onClose={handleToggleSaveMenu}
      >
        <DialogTitle>
          <Flex alignItems="center" justifyContent="space-between">
            <Box>Save Project</Box>
            <Box>
              <Typography variant="body2">
                last saved: {editorState.project.edited_datetime}
              </Typography>
            </Box>
          </Flex>
        </DialogTitle>
        <DialogContent>
          <CTextField
            label="Project Name"
            placeholder="Enter project name"
            value={editorState.project.project_name}
            onChange={handleChangeProjectName}
          />
          <TextArea
            label="Description"
            placeholder="Enter project description"
            value={editorState.project.project_description ?? ''}
            onChange={handleChangeProjectDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button type={ButtonType.primary} onClick={handleSaveProjectToCloud}>
            Save Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Project */}
      <LoadProjectDialog
        open={ui?.loadMenu?.open}
        onClose={handleToggleLoadMenu}
        projects={ui?.loadMenu?.data}
        loadProject={loadProjectFromCload}
        deleteProject={deleteProjectFromCloud}
        updateProjects={updateProjects}
      />

      {loading && <CBackdrop open={true} label={waitInfo} />}
    </Box>
  )
}
