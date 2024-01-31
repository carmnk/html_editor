import { Stack, useTheme } from "@mui/material";
import { useCallback } from "react";
import { EditorControllerType } from "../../../editorController/editorController";
import { ClickTextField } from "../../../../components/inputs/ClickTextField";
import { GenericForm } from "../../../../components/forms/GenericForm";

export type HtmlElementMenuProps = {
  editorController: EditorControllerType;
};

export const PageMenu = (props: HtmlElementMenuProps) => {
  const { editorController } = props;
  const { editorState, actions } = editorController;
  const { selectedPage } = editorState;
  const {
    changeCurrentHtmlElementProp,
    handleChangeComponentProp,
    changeCurrentHtmlElementAttribute,
  } = actions.htmlElement;

  const theme = useTheme();

  // HANDLERS

  const handleChangeElementId = useCallback(
    (value: string) => {
      const propName = "userID";
      changeCurrentHtmlElementProp(propName as any, value);
    },
    [changeCurrentHtmlElementProp]
  );

  // const handleChangeProp = useCallback(
  //   (
  //     newFormData: any,
  //     key: string,
  //     value: any,
  //     prevFormData: any,
  //     subformName?: string
  //   ) => {
  //     if (subformName) {
  //       handleChangeComponentProp(subformName, newFormData?.[subformName]);
  //       return;
  //     }
  //     handleChangeComponentProp(key, value);
  //   },
  //   [handleChangeComponentProp]
  // );

  return (
    <>
      <Stack
        gap={2}
        borderLeft={"1px solid " + theme.palette.divider}
        // height="100%"
        p={1}
        maxWidth={320}
      >
        <ClickTextField
          value={selectedPage}
          onChange={handleChangeElementId}
          disabled={true}
        />

        {/* <GenericForm
          {...selectedComponent?.formGen?.(editorController, selectedComponent)}
          formData={selectedComponent?.props}
          onChangeFormData={handleChangeProp}
        /> */}
        {/* {Object.entries(selectedComponent?.props ?? {}).map(([key, value]) => (
          <Box>
            {key} - {value}
          </Box>
        ))} */}
      </Stack>
    </>
  );
};
