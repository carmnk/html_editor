import { Stack, useTheme } from "@mui/material";
import React, { useCallback } from "react";
import { EditorControllerType } from "../../../editorController/editorController";
import { ClickTextField } from "../../../../components/inputs/ClickTextField";
import {
  HtmlEditorComponentElementTypes,
  HtmlEditorElementType,
} from "../../../EditorState";
import { GenericForm } from "../../../../components/forms/GenericForm";

export type HtmlElementMenuProps = {
  editorController: EditorControllerType;
};

export const ComponentMenu = (props: HtmlElementMenuProps) => {
  const { editorController } = props;
  const { editorState, actions, selectedHtmlElement } = editorController;
  const {
    changeCurrentHtmlElementProp,
    handleChangeComponentProp,
    changeCurrentHtmlElementAttribute,
  } = actions.htmlElement;
  const selectedComponent =
    selectedHtmlElement as unknown as HtmlEditorElementType<HtmlEditorComponentElementTypes.button>;

  // const [formData, setFormData] = React.useState<any>({});

  const theme = useTheme();

  // HANDLERS

  const handleChangeElementId = React.useCallback(
    (value: string) => {
      const propName = "userID";
      changeCurrentHtmlElementProp(propName, value);
    },
    [changeCurrentHtmlElementProp]
  );

  const handleChangeProp = useCallback(
    (
      newFormData: any,
      key: string,
      value: any,
      prevFormData: any,
      subformName?: string
    ) => {
      if (subformName) {
        handleChangeComponentProp(subformName, newFormData?.[subformName]);
        return;
      }
      handleChangeComponentProp(key, value);
    },
    [handleChangeComponentProp]
  );

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
          value={(selectedComponent as any)?.userID ?? "Set ID"}
          onChange={handleChangeElementId}
        />

        <GenericForm
          {...selectedComponent?.formGen?.(editorController, selectedComponent)}
          formData={selectedComponent?.props}
          onChangeFormData={handleChangeProp}
        />
        {/* {Object.entries(selectedComponent?.props ?? {}).map(([key, value]) => (
          <Box>
            {key} - {value}
          </Box>
        ))} */}
      </Stack>
    </>
  );
};
