import { Box, Stack, Typography } from "@mui/material";
import {
  CTreeView,
  CTreeViewProps,
} from "../../../components/treeview/CTreeView";
import { mdiFolder, mdiImage, mdiPackage } from "@mdi/js";
import { EditorControllerType } from "../../editorController/editorController";
import { useEffect, useMemo } from "react";
import { FileUploader } from "../../../components/inputs/CFileUploader";
import { ButtonSmallIconButton } from "../../../components/buttons/ButtonSmallIconButton";

export type AssetsTabProps = {
  editorController: EditorControllerType;
};

export const AssetsTab = (props: AssetsTabProps) => {
  const { editorController } = props;
  const { editorState, setEditorState, actions } = editorController;
  const { handleProvidedImageFile, handleDeleteImageFile } = actions.assets;
  const { handleSelectImage } = actions.ui;

  const treeViewProps: CTreeViewProps = useMemo(() => {
    const workspaceImageTreeItems = Object.keys(
      editorState.imageWorkspaces
    ).map((imageWs) => {
      const imageData = editorState.imageWorkspaces[imageWs];
      return {
        key: imageWs,
        nodeId: imageWs,
        labelText: imageWs,
        disableAddAction: true, // false!
        disableDeleteAction: imageWs === "common",
        icon: mdiFolder,
        children: Object.keys(imageData).map((imageId) => ({
          nodeId: imageId,
          labelText: imageData[imageId].fileName,
          disableAddAction: true,
          disableDeleteAction: false,
          icon: mdiImage,
        })),
      };
    });
    return {
      items: workspaceImageTreeItems,
      expandedItems: ["common"],
      // maxWidth: 220,
      onToggleSelect: (newValue: string) => {
        handleSelectImage(newValue);
      },
      onDelete: handleDeleteImageFile,
    };
  }, [editorState.imageWorkspaces, handleDeleteImageFile, handleSelectImage]);

  // reset selected image when switching tabs // better only switch if tab content no longer exists
  useEffect(() => {
    return () => {
      setEditorState((current) => ({
        ...current,
        selectedImage: null,
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      gap={2}
      // borderLeft={"1px solid " + theme.palette.divider}
      height="100%"
      pr={2}
      width={320}
    >
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
  );
};
