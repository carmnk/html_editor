import { Stack, useTheme, Chip, Tooltip } from '@mui/material'
import { ClassRulesTab } from './ClassRulesTab'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { useCallback, useMemo } from 'react'

export type CssClassMenuProps = {
  editorController: EditorControllerType
}

const validateClassName = (className: string) =>
  /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(className) || className === ''

export const CssClassMenu = (props: CssClassMenuProps) => {
  const { editorController } = props
  const { editorState, actions } = editorController
  const { changeClassName } = actions.cssSelector

  const theme = useTheme()

  const selectorTyp =
    !editorState.ui.selected.cssSelector?.startsWith?.('.') &&
    !editorState.ui.selected.cssSelector?.startsWith?.('#')
      ? 'element'
      : editorState.ui.selected.cssSelector?.startsWith?.('.')
      ? 'class'
      : editorState.ui.selected.cssSelector?.startsWith?.('#')
      ? 'id'
      : null

  const selectedCssSelector = useMemo(() => {
    return editorState.cssSelectors.find(
      (sel) => sel._id === editorState.ui.selected.cssSelector
    )
  }, [editorState.cssSelectors, editorState.ui.selected.cssSelector])

  const handleChangeCssUserId = useCallback(
    (newUserId: string) => {
      const currentId = selectedCssSelector?._id
      if (!currentId) return
      changeClassName(newUserId, currentId)
    },
    [selectedCssSelector, changeClassName]
  )

  return (
    <>
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <ClickTextField
          validateInput={validateClassName}
          value={selectedCssSelector?._userId ?? 'MISSING'}
          onChange={handleChangeCssUserId}
          additionalLabelComponent={
            selectorTyp ? (
              <Tooltip
                title={
                  selectorTyp === 'element'
                    ? `rules are applied to all elements of given type e.g. ${editorState.ui.selected.cssSelector} selects all html ${editorState.ui.selected.cssSelector} elements`
                    : selectorTyp === 'class'
                    ? `rules are applied to all elements with given class e.g. ${
                        editorState.ui.selected.cssSelector
                      } selects all elements with class ${editorState.ui.selected.cssSelector?.replace(
                        '.',
                        ''
                      )}`
                    : selectorTyp === 'id'
                    ? `rules are applied to all elements with given id e.g. ${
                        editorState.ui.selected.cssSelector
                      } selects all elements with id ${editorState.ui.selected.cssSelector?.replace(
                        '#',
                        ''
                      )}`
                    : ''
                }
                placement="top"
                arrow
              >
                <Chip size="small" label={selectorTyp} />
              </Tooltip>
            ) : null
          }
        />
      </Stack>

      {/* <CTabs
        value={ui?.selectedTab}
        onChange={handleChangeTab}
        items={menuTabs}
      /> */}
      <ClassRulesTab editorController={editorController} />
    </>
  )
}
