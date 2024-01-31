import { ChipProps } from "@mui/material";
import {
  GenericFormProps,
  StaticFieldType,
} from "../../components/forms/GenericForm";

type FormDataType = ChipProps;
type ParameterType = {
  initialFormData?: Partial<FormDataType>;
};

const booleanOptions = [
  { value: false, label: "false" },
  { value: true, label: "true" },
];

export const muiBaseColors = [
  "primary",
  "secondary",
  "error",
  "warning",
  "info",
  "success",
];
export const muiBaseColorsOptions = muiBaseColors.map((bt) => ({
  value: bt,
  label: bt,
}));

// const chipTypes = ["primary", "secondary", "text"];
// const buttonTypesOptions = buttonTypes.map((bt) => ({
//   value: bt,
//   label: bt,
// }));

const optionsDict = {
  variant: [
    { value: "filled", label: "filled" },
    { value: "outlined", label: "outlined" },
    // { value: "text", label: "text" },
  ],
  disabled: booleanOptions,
  clickable: booleanOptions,
  color: muiBaseColorsOptions,
  size: [
    { value: "small", label: "small" },
    { value: "medium", label: "medium" },
    // { value: "large", label: "large" },
  ],
};

type GenerateFieldProps = {
  type: string;
  name: string;
};
type GenerateOptionsDictType = {
  [key: string]: { value: any; label: string }[];
};

type GenerateFormPropsType = {
  optionsDict: GenerateOptionsDictType;
  initialFormData: { [key: string]: any };
  fields: GenerateFieldProps[];
};
const generateFormProps = (params: GenerateFormPropsType): GenericFormProps => {
  const { optionsDict, initialFormData, fields: fieldsIn } = params;
  const fields = fieldsIn.map((field) => {
    // const isOption = field?.name in options;
    const fieldProps = {
      ...field,
      label: field?.name,
    };
    return fieldProps;
  });
  const injections = {
    options: optionsDict,
    initialFormData: initialFormData,
  };
  const formProps = {
    injections,
    fields,
  };
  return formProps as any;
};

export const ChipComponentPropsFormFactory = () =>
  generateFormProps({
    optionsDict,
    initialFormData: {
      label: "test",
      size: "medium",
      variant: "filled",
      color: "primary",
      clickable: false,
      disabled: false,
    },
    fields: [
      {
        type: "text",
        name: "label",
      },
      {
        type: "select",
        name: "size",
      },
      {
        type: "select",
        name: "variant",
      },
      {
        type: "select",
        name: "color",
      },

      {
        type: "select",
        name: "clickable",
      },

      {
        type: "select",
        name: "disabled",
      },
    ],
  });
