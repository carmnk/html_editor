import { Stack, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { GenericForm } from '../../../../components/forms/GenericForm'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'

export type HtmlElementMenuProps = {
  editorController: EditorControllerType
}

export const PageMenu = (props: HtmlElementMenuProps) => {
  const { editorController } = props
  const { editorState, actions } = editorController
  const { page: selectedPage } = editorState.ui.selected
  const {
    changeCurrentElementProp,
    changeSelectedComponentProp,
    changeCurrentHtmlElementAttribute,
  } = actions.htmlElement

  const theme = useTheme()

  // HANDLERS

  const handleChangeElementId = useCallback(
    (value: string) => {
      const propName = '_userID'
      changeCurrentElementProp(propName as any, value)
    },
    [changeCurrentElementProp]
  )

  // const handleChangeProp = useCallback(
  //   (
  //     newFormData: any,
  //     key: string,
  //     value: any,
  //     prevFormData: any,
  //     subformName?: string
  //   ) => {
  //     if (subformName) {
  //       changeSelectedComponentProp(subformName, newFormData?.[subformName]);
  //       return;
  //     }
  //     changeSelectedComponentProp(key, value);
  //   },
  //   [changeSelectedComponentProp]
  // );

  const handleRenamePage = useCallback(
    (pageName: string) => {
      if (!selectedPage) return
      actions.project.renameHtmlPage(selectedPage, pageName)
    },
    [selectedPage, actions.project]
  )

  return (
    <>
      <Stack
        gap={2}
        borderLeft={'1px solid ' + theme.palette.divider}
        // height="100%"
        p={1}
      >
        <ClickTextField
          value={selectedPage ?? ''}
          onChange={handleRenamePage}
          disabled={selectedPage === 'index'}
        />
      </Stack>
    </>
  )
}
