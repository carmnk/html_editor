import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Popover,
  PopoverProps,
  Stack,
  Typography,
} from '@mui/material'
import { CAutoComplete } from '../../../components/inputs/CAutoComplete'
import { useCallback, useState } from 'react'
import { Button } from '../../../components/buttons/Button/Button'
import { mdiPlusBox } from '@mdi/js'
import Icon from '@mdi/react'
import { baseComponents } from '../../editorComponents/baseComponents'
import { HTML_TAG_NAMES_STRUCTURED_OPTIONS } from '../../defs/HTMLTagNamesDict'
import { CCheckbox } from '../../../components/inputs/CCheckbox'
import { EditorControllerType } from '../../editorController/editorControllerTypes'
import { uniq } from 'lodash'

export type AddElementModalProps = {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  editorController: EditorControllerType
  currentElementId: string
}

export const groupByCategory = (item: any) => item.category

const anchorOrigin: PopoverProps['anchorOrigin'] = {
  vertical: 'bottom' as const,
  horizontal: 'right' as const,
}
const transformOrigin: PopoverProps['transformOrigin'] = {
  vertical: 'top' as const,
  horizontal: 'center' as const,
}

export const AddElementModal = (props: AddElementModalProps) => {
  const { open, anchorEl, onClose, editorController, currentElementId } = props
  const { editorState, actions } = editorController
  const { addHtmlChild, addComponentChild } = actions.htmlElement

  const [ui, setUi] = useState<{
    selectedHtmlType: string
    closeAfterAdd: boolean
  }>({
    selectedHtmlType: '',
    closeAfterAdd: true,
  })

  const handleToggleCloseAfterAdd = useCallback(() => {
    setUi((prev) => ({ ...prev, closeAfterAdd: !prev.closeAfterAdd }))
  }, [setUi])

  const handleChangeSelectedHtmlType = useCallback(
    (newValue: string) => {
      setUi((prev) => ({ ...prev, selectedHtmlType: newValue }))
    },
    [setUi]
  )

  const handleAddSpecificHtmlElement = useCallback(() => {
    if (!ui.selectedHtmlType) {
      alert("please specify a type")
      return
    }
    addHtmlChild(currentElementId, ui.selectedHtmlType)
    if (!ui.closeAfterAdd) return
    onClose()
  }, [
    addHtmlChild,
    onClose,
    ui?.selectedHtmlType,
    currentElementId,
    ui.closeAfterAdd,
  ])

  const handleAddDiv = useCallback(() => {
    addHtmlChild(currentElementId)
    if (!ui.closeAfterAdd) return
    onClose()
  }, [addHtmlChild, onClose, currentElementId, ui.closeAfterAdd])

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{ mt: 0.5 }}
      slotProps={{ paper: { sx: { border: '1px solid #333' } } }}
      elevation={8}
    >
      <Box p={2}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Insert element</Typography>
          </Box>
          <Box>
            <CCheckbox
              value={!ui.closeAfterAdd}
              label="add multiple elements"
              labelTypographyProps={{ variant: 'body2' }}
              tooltip="will not close the modal after adding an element"
              onChange={handleToggleCloseAfterAdd}
            />
          </Box>
        </Stack>
        <Stack direction="row" gap={4} pt={2}>
          <Box>
            <Typography>HTML Element</Typography>
            <Box pt={2}>
              <Button
                icon={mdiPlusBox}
                onClick={handleAddDiv}
              >{`Insert Div`}</Button>
              <br />
              <Typography>or choose custom</Typography>
              <Box>
                <CAutoComplete
                  value={ui?.selectedHtmlType}
                  options={HTML_TAG_NAMES_STRUCTURED_OPTIONS}
                  groupBy={groupByCategory}
                  onChange={handleChangeSelectedHtmlType}
                  sx={{ width: '180px' }}
                />
              </Box>
              <Button
                icon={mdiPlusBox}
                type="secondary"
                onClick={handleAddSpecificHtmlElement}
              >{`Insert Element`}</Button>
            </Box>
          </Box>
          <Box>
            <Typography>Component</Typography>
            <Stack direction="row" gap={1} pt={2}>
              {(uniq(baseComponents?.map((c) => c.category)) ?? [])
                ?.sort()
                .map((cat) => (
                  <Box key={cat}>
                    <Typography variant="body2">{cat}</Typography>
                    <List>
                      {baseComponents
                        .filter((c) => c.category === cat)
                        ?.map((comp, cIdx) => (
                          <ListItemButton
                            key={cIdx}
                            onClick={() => {
                              addComponentChild(
                                currentElementId,
                                comp.type as any
                              )
                              if (!ui.closeAfterAdd) return
                              onClose()
                            }}
                          >
                            <ListItemIcon>
                              <Icon path={comp.icon} size={1} />
                            </ListItemIcon>
                            {comp.type}
                          </ListItemButton>
                        ))}
                    </List>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Popover>
  )
}
