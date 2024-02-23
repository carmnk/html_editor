import { Box, Stack, Typography } from '@mui/material'
import {
  CTreeView,
  CTreeViewProps,
} from '../../../components/treeview/CTreeView'
import { mdiDelete, mdiFolder, mdiImage, mdiPackage } from '@mdi/js'
import { useEffect, useMemo } from 'react'
import { FileUploader } from '../../../components/inputs/CFileUploader'
import { ButtonSmallIconButton } from '../ButtonSmallIconButton'
import { EditorControllerType } from '../../editorController/editorControllerTypes'

export type AssetsTabProps = {
  editorController: EditorControllerType
}

export const AssetsTab = (props: AssetsTabProps) => {
  const { editorController } = props
  const { editorState, setEditorState, actions } = editorController
  const { handleProvidedImageFile, deleteImageFile } = actions.assets
  const { selectImage } = actions.ui

  const treeViewProps: CTreeViewProps = useMemo(() => {
    const workspaceImageTreeItems = [
      {
        _parentId: null,
        key: 'common',
        nodeId: 'common',
        labelText: 'common',
        disableAddAction: true, // false!
        disableDeleteAction: true, // imageWs === 'common',
        icon: mdiFolder,
        children: editorState.assets.images.map((image) => {
          // const imageData =
          return {
            nodeId: image._id,
            labelText: image.fileName,
            disableAddAction: true,
            disableDeleteAction: false,
            icon: mdiImage,
            _parentId: 'common',
          }
        }),
      },
    ]
    return {
      items: workspaceImageTreeItems,
      expandedItems: ['common'],
      // maxWidth: 220,
      onToggleSelect: (newValue: string) => {
        selectImage(newValue)
      },
      actions: (item: any) =>
        item?._parentId && [
          {
            action: deleteImageFile as any,
            tooltip: 'Delete Image',
            icon: mdiDelete,
            label: 'Delete Image',
          },
        ],
      onDelete: deleteImageFile,
    }
  }, [editorState.assets.images, deleteImageFile, selectImage])

  // reset selected image when switching tabs // better only switch if tab content no longer exists
  useEffect(() => {
    return () => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          selected: {
            ...current.ui.selected,
            image: null,
          },
        },
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack gap={2} height="100%">
      <Box flexGrow={1} mt={0.5} ml={1}>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography>Images</Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              <ButtonSmallIconButton
                tooltip="Add Image Workspace"
                icon={mdiPackage}
                disabled={true}
                // onClick={() => {
                // }}
              />
            </Stack>
          </Stack>
        </Box>
        <Box ml={0.5} mt={2}>
          <CTreeView {...treeViewProps} />
        </Box>
      </Box>
      <Box maxWidth={220} position="relative">
        <Box width="90%">
          <FileUploader
            inputId="new_image"
            isLoading={false}
            label="Upload new Image"
            handleUpload={handleProvidedImageFile}
            accept="*"
            enableMultipleFiles={true}
          />
        </Box>
      </Box>
    </Stack>
  )
}
