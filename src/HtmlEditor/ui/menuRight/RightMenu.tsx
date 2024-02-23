import { Drawer } from '@mui/material'
import { useMemo } from 'react'
import { HtmlElementMenu } from './htmlElement/HtmlElementMenu'
import { CssClassMenu } from './cssClass/CssClassMenu'
import { ImageMenu } from './image/ImagesMenu'
import { FallbackTab } from './FallbackTab'
import { isStringLowerCase } from '../../renderElements'
import { ComponentMenu } from './component/ComponentMenu'
import { ThemeMenu } from './theme/themeMenu'
import { PageMenu } from './page/PageMenu'
import { EditorControllerType } from '../../editorController/editorControllerTypes'
import { FontMenu } from './font/FontMenu'
import { StateMenu } from './state/StateMenu'

export type RightMenuProps = {
  editorController: EditorControllerType
}

export const RightMenu = (props: RightMenuProps) => {
  const { editorController } = props
  const { editorState, selectedHtmlElement2 } = editorController

  const selectedValidClass = useMemo(() => {
    return (
      editorState.ui.selected.cssSelector &&
      editorState.cssSelectors.find(
        (sel) => sel._id === editorState.ui.selected.cssSelector
      )
    )
  }, [editorState.ui.selected.cssSelector, editorState?.cssSelectors])

  const selectedValidImage = useMemo(() => {
    return (
      editorState.ui.selected.image &&
      editorState.assets.images.find(
        (image) => image._id === editorState.ui.selected.image
      )
    )
  }, [editorState.ui.selected.image, editorState.assets.images])

  const activeNavigationTab = editorState.ui.navigationMenu.activeTab

  const paperProps = useMemo(() => {
    return {
      sx: {
        position: 'static',
        pr: 2,
        width: editorState.ui.detailsMenu.width,
      },
    }
  }, [editorState.ui.detailsMenu.width])

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      disablePortal={true}
      open={true}
      PaperProps={paperProps}
    >
      {['page'].includes(activeNavigationTab) ? (
        !selectedHtmlElement2 ? (
          <FallbackTab />
        ) : selectedHtmlElement2?._type &&
          isStringLowerCase(selectedHtmlElement2._type?.slice(0, 1)) ? (
          <HtmlElementMenu editorController={editorController} />
        ) : (
          <ComponentMenu editorController={editorController} />
        )
      ) : ['project'].includes(activeNavigationTab) ? (
        !editorState.ui.selected.page ? (
          <FallbackTab />
        ) : (
          <PageMenu editorController={editorController} />
        )
      ) : ['css'].includes(activeNavigationTab) ? (
        !editorState.ui.selected.cssSelector || !selectedValidClass ? (
          <FallbackTab />
        ) : (
          <CssClassMenu editorController={editorController} />
        )
      ) : ['assets'].includes(activeNavigationTab) ? (
        !editorState.ui.selected.image || !selectedValidImage ? (
          <FallbackTab />
        ) : (
          <ImageMenu editorController={editorController} />
        )
      ) : ['theme'].includes(activeNavigationTab) ? (
        !editorState?.ui?.navigationMenu?.selectedTheme ? (
          <FallbackTab />
        ) : (
          <ThemeMenu editorController={editorController} />
        )
      ) : ['font'].includes(activeNavigationTab) ? (
        !editorState.ui.selected.font ? (
          <FallbackTab />
        ) : (
          <FontMenu editorController={editorController} />
        )
      ) : ['state'].includes(activeNavigationTab) ? (
        !editorState.ui.selected.state ? (
          <FallbackTab />
        ) : (
          <StateMenu editorController={editorController} />
        )
      ) : null}
    </Drawer>
  )
}
