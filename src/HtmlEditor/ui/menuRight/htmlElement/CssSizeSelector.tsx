import { Box, Stack, TextField } from '@mui/material'
import { sizePreSelectButtons } from '../../defs/_defCssPropertyButtonGroups'
import { ButtonGroup } from '../../../../components/buttons/ButtonGroupButton'
import { CSSProperties, useCallback, useState } from 'react'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { Flex } from '../../../../components/basics/Flex'

export type CssSizeSelectorProps = {
  // editorController: EditorControllerType
  // attributeName: string
  defaultSizeMode?: string

  sizeValue: string
  changeSizeValue: (newValue: string) => void
}

export const CssSizeSelector = (props: CssSizeSelectorProps) => {
  const {
    // editorController,
    // attributeName,
    defaultSizeMode,
    sizeValue,
    changeSizeValue,
  } = props
  // const { selectedHtmlElementStyleAttributes2: elementStyles, actions } =
  //   editorController

  // const { changeCurrentHtmlElementStyleAttribute } = actions.htmlElement

  const [ui, setUi] = useState({ sizeMode: defaultSizeMode ?? 'px' })

  const handleChangeSize = useCallback(
    (e: any) => {
      const newValue = e?.target?.value?.replace(/\D/g, '')
      changeSizeValue?.(newValue + ui?.sizeMode)
    },
    [changeSizeValue, ui?.sizeMode]
  )

  const handleChangeSizeMode = useCallback(
    (newValue: string) => {
      setUi((current) => ({
        ...current,
        sizeMode: newValue,
      }))
      const size = sizeValue?.toString?.()?.replace?.(/\D/g, '')
      if (!size) return
      const val = size + newValue
      changeSizeValue?.(val)
      // changeCurrentHtmlElementStyleAttribute(val, attributeName)
    },
    [changeSizeValue, setUi, sizeValue]
  )

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end">
        <ButtonGroup
          value={ui?.sizeMode}
          buttons={sizePreSelectButtons}
          onChange={handleChangeSizeMode}
        />
      </Box>
      {ui?.sizeMode !== 'auto' && (
        <Flex
          mt={0.5}
          width={'100%'}
          alignItems="center"
          justifyContent="flex-end"
          gap={0.5}
        >
          <Box width={120}>
            <TextField
              size="small"
              inputProps={{ sx: { p: 0.5, px: 1 } }}
              onChange={handleChangeSize}
              value={sizeValue?.toString?.()?.replace(/\D/g, '') ?? ''}
              // placeholder="0"
            />
          </Box>
          {ui?.sizeMode.toString()}
        </Flex>
      )}
    </Box>
  )
}
