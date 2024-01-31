import React from "react";
import { CAutoComplete } from "./CAutoComplete";
import { CMultiSelect } from "./CMultiSelect";
import { CNumberField } from "./CNumberField";
import { CSelect } from "./CSelect";
import { CTextField } from "./CTextField";
import { MuiDatePicker } from "./DatePicker2";
import { TextArea } from "./TextArea";
import { CCheckbox } from "./CCheckbox";
// import { FileUploader } from './FileUploader'

export type GenericInputFieldType =
  | "text"
  | "number"
  | "int"
  | "date"
  | "select"
  | "autocomplete"
  | "multiselect"
  | "textarea"
  | "bool"
  | "file";

export type GenericInputFieldOption = {
  label: string;
  value: number | string | boolean;
};

export interface SimpleGenericInputFieldProps<T = GenericInputFieldType> {
  type: T;
  value?: T extends "text" | "textarea"
    ? string | null
    : T extends "number" | "int"
    ? number | "" | null
    : T extends "date"
    ? string | null
    : T extends "file"
    ? number | "" | null
    : null;
  label?: React.ReactNode;
  name: string;
  placeholder?: string;
  required?: any;
  maxLength?: number | string;
  sx?: any;
  onChange?: (newValue: any, e?: any) => void;
  disabled?: boolean;
  helperText?: string;
  disableHelperTextTheming?: boolean;
  hidden?: boolean;
  invisible?: boolean;
  error?: boolean;
  files?: T extends "file"
    ? { [key: string]: { file: File; filename: string }[] }
    : never;
  onFileChange?: (name: string, files: File[]) => void;
}

export interface GenericInputFieldProps<T = GenericInputFieldType>
  extends SimpleGenericInputFieldProps<T> {
  options?: GenericInputFieldOption[];
}

/**
 * Generic Input Field Component - provides a unified prop interface for different input types.
 * The type property {@link GenericInputFieldType} determines the rendered input type
 * Prefer using the GenericForm Component directly
 * @param props: {@link GenericInputFieldProps}
 * @returns JSX.Element | null
 * @todo implement Multiselect Component
 */
export const GenericInputField = (props: GenericInputFieldProps) => {
  const {
    value,
    label,
    name,
    placeholder,
    required,
    maxLength,
    type,
    sx,
    options,
    hidden,
    invisible,
    error,
    files,
    ...restIn
  } = props;
  const rest = { ...restIn, isDisabled: restIn?.disabled };

  return hidden ? null : type === "text" ? (
    <CTextField
      label={label}
      value={value}
      name={name}
      placeholder={placeholder}
      required={required}
      InputProps={{
        sx: { ...(sx ?? {}), visibility: !invisible ? "visible" : "hidden" },
      }}
      injectError={error}
      {...restIn}
    />
  ) : type === "number" ? (
    <CNumberField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      InputProps={{ sx }}
      injectError={error}
      {...restIn}
    />
  ) : type === "int" ? (
    <CNumberField
      label={label}
      value={value as any}
      name={name}
      placeholder={placeholder}
      required={required}
      InputProps={{ sx }}
      injectError={error}
      {...restIn}
    />
  ) : //
  // : type === 'file' ? (
  //   <FileUploader
  //     handleUpload={(file: any) => restIn?.onFileChange?.(name, file)}
  //     disableDelete={true}
  //     resetFile={() => {
  //       restIn?.onChange?.({ target: { value: 0, name: name } })
  //     }}
  //     files={(files?.[name] as any) ?? []}
  //     helperText="Upload file"
  //     inputId="file-id"
  //     label="Upload file Label"
  //     required={true}
  //     isLoading={false}
  //     accept="*"
  //     enableMultipleFiles={true}
  //     isError
  //     // handleReplaceFile={}
  //     {...restIn}
  //   />
  // )
  type === "bool" ? (
    <CCheckbox
      label={label}
      value={value as any}
      name={name}
      // placeholder={placeholder}
      required={required}
      // injectError={error}
      {...restIn}
    />
  ) : type === "date" ? (
    <MuiDatePicker
      label={label}
      value={value as any}
      name={name}
      // placeholder={placeholder}
      required={required}
      {...restIn}
    />
  ) : type === "textarea" ? (
    <TextArea
      label={label}
      value={value as string}
      name={name}
      placeholder={placeholder}
      required={required}
      {...restIn}
    />
  ) : type === "select" ? (
    <CSelect
      label={label}
      value={value}
      name={name}
      placeholder={placeholder}
      required={required}
      options={(options as any) ?? []}
      isError={error}
      {...rest}
    />
  ) : type === "autocomplete" ? (
    <CAutoComplete
      label={label}
      value={(value as any) ?? ""}
      name={name}
      placeholder={placeholder}
      required={required}
      options={(options as any) ?? []}
      isError={error}
      {...restIn}
    />
  ) : //  : type === 'multiselect' ? (
  //   <CMultiSelect label={label} value={value} name={name} placeholder={placeholder} required={required} />
  // )
  null;
};
