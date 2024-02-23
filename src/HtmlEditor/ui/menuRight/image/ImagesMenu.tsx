import { Stack, Typography, useTheme, Box } from '@mui/material'
import { useMemo } from 'react'
import { ClickTextField } from '../../../../components/inputs/ClickTextField'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'

export type ImageMenuProps = {
  editorController: EditorControllerType
}

export const ImageMenu = (props: ImageMenuProps) => {
  const { editorController } = props
  const {
    editorState,
    getSelectedImage,
    actions: { assets },
  } = editorController
  const { changeImageFilename } = assets

  const selectedImage = useMemo(() => {
    return getSelectedImage?.()
  }, [getSelectedImage])

  const theme = useTheme()

  const imageSrc = useMemo(
    () =>
      selectedImage?.image
        ? URL.createObjectURL(selectedImage?.image as unknown as File)
        : '',
    [selectedImage]
  )

  return (
    <>
      <Stack gap={2} borderLeft={'1px solid ' + theme.palette.divider} p={1}>
        <ClickTextField
          value={selectedImage?.fileName ?? ''}
          onChange={changeImageFilename}
        />
        <Typography
          color="text.primary"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          variant="body2"
        >
          ID: {editorState?.ui.selected.image ?? 'MISSING'}
        </Typography>
      </Stack>
      {selectedImage?.image && (
        <Box border={'1px solid ' + theme.palette.divider} m={2}>
          <Box
            component="img"
            src={imageSrc}
            width={'100%'}
            maxWidth={220}
            height={'auto'}
          />
        </Box>
      )}

      {/* <CTabs
        value={ui?.selectedTab}
        onChange={handleChangeTab}
        items={menuTabs}
      /> */}
    </>
  )
}
