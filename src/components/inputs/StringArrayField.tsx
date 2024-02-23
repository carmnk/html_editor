import { mdiDeleteOutline } from "@mdi/js";
import { Box, Stack } from "@mui/material";
import React from "react";
import { Button } from "../buttons/Button/Button";
import { CTextField } from "./CTextField";
import { ButtonType } from "../buttons/Button/Types";

export type StringArrayFieldProps = {
  value?: string[] | null;
  label?: React.ReactNode;
  name?: string;
  // placeholder?: string
  // mainClass?: any
  required?: any;
  // icon?: any
  // inputStyle?: any
  // helperText?: string
  // startIcon?: any
  // disableHelperText?: boolean
  // disableLabel?: boolean
  // disableAcceptZeroValue?: boolean
  error?: boolean;
  // ContainerProps?: BoxProps
  // labelSx?: TypographyProps['sx']
  // injectComponent?: React.ReactNode
  // onChangeCompleted?: (newValue: string | number) => void
  // maxLength?: number | string // ??
  // onDeleteItem
  showError?: boolean;
  onChangeArray: (newValue: string, name: string, arrayIdx: number) => void;
  onRemoveItem: (name: string, arrayIndex: number) => void;
  enableDeleteFirst?: boolean;
  disableHelperText?: boolean;
};

export const StringArrayField = (props: StringArrayFieldProps) => {
  const {
    value,
    label,
    error,
    required,
    name,
    onChangeArray,
    onRemoveItem,
    enableDeleteFirst,
    showError,
    disableHelperText,
  } = props;
  const valueAdjusted = value?.length || enableDeleteFirst ? value : [""];
  return (
    <>
      {valueAdjusted?.map((item, index) => (
        <Stack
          direction="row"
          mb={1}
          gap={1}
          alignItems="center"
          key={index}
          sx={{ overFlowX: "visible" }}
        >
          <CTextField
            type="text"
            value={item}
            label={label}
            name={name}
            required={required && !index}
            onChange={(newValue, e) => {
              const { name, value } = e?.target ?? {};
              onChangeArray(value, name, index);
              // updateEmail(e, index, 'issue_price_contact_emails')
            }}
            mainClass="w-full"
            // ContainerProps={{ sx: { width: 320 } }}
            injectError={error ?? (showError && required && !value && !index)}
            disableHelperText={disableHelperText}
          />
          {(enableDeleteFirst || index > 0) && (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                height: "100%",
                paddingTop: disableHelperText ? "24px" : 0,
              }}
            >
              <Button
                type={ButtonType.text}
                iconButton={true}
                icon={mdiDeleteOutline}
                title={"delete_" + index}
                tooltip="Eintrag löschen"
                // IconButtonSx={{
                //   position: 'relative',
                //   alignSelf: 'end',
                //   padding: '8px',
                //   marginBottom: '32px',
                // }}
                onClick={() => name && onRemoveItem(name, index)}
              />
            </Box>
          )}
        </Stack>
      )) ?? null}
    </>
  );
};
