import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { renderHtmlElements } from './renderElements.tsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import { uniq } from 'lodash'
import { EditorControllerType } from './editorController/editorControllerTypes.ts'
import { e } from 'vite-node/index-WT31LSgS.js'

// -> must be generated dynamically!
// import siteProps from '../site_props.json'

export type HtmlRendererProps = {
  editorController: EditorControllerType
}

export const HtmlRenderer = (props: HtmlRendererProps) => {
  const { editorController } = props
  const { editorState, setEditorState } = editorController
  const handleSelectElement = React.useCallback(() => {}, [])
  const location = useLocation()

  console.log("ELEMENTS", editorState.elements)

  const renderPage = React.useCallback(
    (page: string) => {
      const pageElements = editorState.elements.filter(
        (el) => el._page === page
      )
      const pageElementsAdj = pageElements.map((el) => {
        if (el._parentId) return el
        return el
        return {
          ...el,
          attributes: {
            ...((el as any)?.props ?? {}),
            // style: {
            //   ...((el as any)?.props.style ?? {}),
            //   bgcolor: 'background.paper',
            // },
          },
        }
      })
      console.log('renderPage', page, pageElements, pageElementsAdj, editorController)
      // console.log('Should render PAGE, ', page, pageElements, pageElementsAdj)

      return renderHtmlElements(
        pageElementsAdj,
        editorController,
        handleSelectElement,
        true
      )
    },
    [editorState, editorController, handleSelectElement]
  )

  // change the route, renderer uses editorState.ui.selected.page to render the page
  useEffect(() => {
    console.log('location changed', location.pathname)
    const pageName = location.pathname.slice(1) || 'index'
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selected: { ...current.ui.selected, page: pageName },
      },
    }))
  }, [location.pathname])

  const remainingPages = React.useMemo(() => {
    const pages = uniq(editorState?.elements?.map((el) => el._page) ?? [])
    const pagesExIndex = pages.filter((page) => page !== 'index')
    return pagesExIndex
  }, [editorState])

  console.log(
    'remainingPages',
    remainingPages,
    editorState.elements.filter((el) => el._page === 'page2')
  )
  console.log('LOCO', location.pathname)

  return (
    <Box height="100%" bgcolor="background.default">
      <Routes>
        <Route path="/" element={<Box>{renderPage('index')}</Box>} />
        {remainingPages?.map((pageName) => (
          <Route
            key={pageName}
            path={`/${pageName}`}
            element={<Box>{renderPage(pageName)}</Box>}
          />
        ))}
      </Routes>
    </Box>
  )
}
