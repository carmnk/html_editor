import { mdiCheck, mdiDelete, mdiPencil } from "@mdi/js";
import {
  Stack,
  Typography,
  Box,
  ClickAwayListener,
  TypographyProps,
  TextField,
  TextFieldProps,
  Chip,
} from "@mui/material";
import { ChangeEvent, memo, useCallback, useState } from "react";
import { Button } from "../buttons/Button/Button";
import { CAutoComplete, CAutoCompleteProps } from "./CAutoComplete";

const inputStyles = { sx: { p: 0.5, px: 1 } };

type CommonClickTextFieldProps = {
  value: string;
  //   label: string;
  typographyProps?: TypographyProps;
  additionalLabelComponent?: React.ReactNode;
  onChange?: (newValue: string) => void;
  validateInput?: (newValue: string) => boolean;
  onClickAway?: () => void;
  handleRemoveItem?: () => void;
  onToggle?: (isEdit: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  groupBy?: (option: any) => string;
  useChip?: boolean;
};

type TextClickTextFieldProps = {
  variant?: "text";
  textFieldProps?: TextFieldProps;
};

type AutoCompleteClickTextFieldProps = {
  variant?: "autocomplete";
  options: { value: string; label: string }[];
  autoCompleteProps?: CAutoCompleteProps;
};

export type ClickTextFieldProps = CommonClickTextFieldProps &
  (TextClickTextFieldProps | AutoCompleteClickTextFieldProps);

export const ClickTextFieldComponent = (props: ClickTextFieldProps) => {
  const {
    variant,
    value,
    typographyProps,
    additionalLabelComponent,
    textFieldProps,
    options,
    onChange,
    validateInput,
    onClickAway,
    handleRemoveItem,
    onToggle,
    disabled,
    placeholder,
    useChip,
    groupBy,
  } = props as TextClickTextFieldProps &
    AutoCompleteClickTextFieldProps &
    CommonClickTextFieldProps;
  const [ui, setUi] = useState({ isEdit: false, tempValue: "" });

  const handleTakeover = useCallback(() => {
    setUi((current) => ({ ...current, isEdit: false, tempValue: "" }));
    onChange?.(ui?.tempValue);
  }, [ui?.tempValue, onChange]);

  const handleToggleIsEdit = useCallback(() => {
    onToggle?.(!ui?.isEdit);
    setUi((current) => ({
      ...current,
      isEdit: !current.isEdit,
      tempValue: current.isEdit ? "" : value,
    }));
    if (ui?.isEdit) {
      onClickAway?.();
    }
  }, [ui?.isEdit, onClickAway, value, onToggle]);

  const handleChangeTempValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e?.target?.value;
      if (validateInput && !validateInput(newValue)) return;
      setUi((current) => ({ ...current, tempValue: newValue }));
    },
    [validateInput]
  );

  const handleChangeTempSelectValue = useCallback(
    (newValue: string) => {
      //   const newValue = e?.target?.value;
      if (validateInput && !validateInput(newValue)) return;
      setUi((current) => ({ ...current, tempValue: newValue }));
    },
    [validateInput]
  );

  const handleOnKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleTakeover();
      }
    },
    [handleTakeover]
  );

  return !ui?.isEdit || disabled ? (
    <Stack direction="row" alignItems="center" gap={1}>
      {useChip ? (
        <Chip label={(value || placeholder) ?? ""} size="small" />
      ) : (
        <Typography
          color="text.primary"
          // variant="h6"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          variant="h5"
          fontStyle={!value && placeholder ? "italic" : "normal"}
          fontWeight={!value && placeholder ? 400 : 700}
          {...typographyProps}
        >
          {(value || placeholder) ?? ""}
        </Typography>
      )}
      {additionalLabelComponent}
      {!disabled && (
        <>
          <Box minWidth={24} minHeight={24}>
            <Button
              icon={mdiPencil}
              iconButton={true}
              type="text"
              onClick={handleToggleIsEdit}
            />
          </Box>
          {handleRemoveItem && (
            <Box minWidth={24} minHeight={24}>
              <Button
                icon={mdiDelete}
                iconButton={true}
                type="text"
                onClick={handleRemoveItem}
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  ) : (
    <ClickAwayListener onClickAway={handleToggleIsEdit}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Box flexGrow={1}>
          {variant === "autocomplete" ? (
            <CAutoComplete
              value={(ui?.tempValue as any) ?? ""}
              placeholder={placeholder}
              name="editRuleValue"
              options={options}
              // value={ui.ruleValue}
              onChange={handleChangeTempSelectValue as any}
              size="small"
              sx={{ width: "140px" }}
              disableLabel={true}
              disableHelperText={true}
              onKeyUp={handleOnKeyUp}
              groupBy={groupBy}
              {...(textFieldProps as any)}
            />
          ) : (
            <TextField
              placeholder={placeholder}
              size="small"
              inputProps={inputStyles}
              onChange={handleChangeTempValue}
              value={ui?.tempValue ?? ""}
              onKeyUp={handleOnKeyUp as any}
              {...textFieldProps}
            />
          )}
        </Box>
        <Box minWidth={24} minHeight={24}>
          <Button
            icon={mdiCheck}
            iconButton={true}
            type="text"
            onClick={handleTakeover}
          />
        </Box>
      </Stack>
    </ClickAwayListener>
  );
};

export const ClickTextField = memo(ClickTextFieldComponent);
