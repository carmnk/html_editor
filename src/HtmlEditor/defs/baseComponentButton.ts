import { Button, CButtonProps } from "../../components/buttons/Button";
import {
  GenericFormProps,
  StaticFieldType,
} from "../../components/forms/GenericForm";
import { muiBaseColorsOptions } from "./baseComponentChip";
import { iconOptions } from "./icons";

type FormDataType = CButtonProps;
type ParameterType = {
  initialFormData?: Partial<FormDataType>;
};

const booleanOptions = [
  { value: false, label: "false" },
  { value: true, label: "true" },
];

const buttonTypes = ["primary", "secondary", "text"];
const buttonTypesOptions = buttonTypes.map((bt) => ({
  value: bt,
  label: bt,
}));

const optionsDict = {
  icon: iconOptions,
  type: buttonTypesOptions,
  variant: [
    { value: "contained", label: "contained" },
    { value: "outlined", label: "outlined" },
    { value: "text", label: "text" },
  ],
  disabled: booleanOptions,
  disableHover: booleanOptions,
  iconButton: booleanOptions,
  loading: booleanOptions,
  size: [
    { value: "small", label: "small" },
    { value: "medium", label: "medium" },
    { value: "large", label: "large" },
  ],
  color: muiBaseColorsOptions,
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

export const ButtonComponentPropsFormFactory = () =>
  generateFormProps({
    optionsDict,
    initialFormData: {
      type: "primary",
      label: "test2",
      disabled: false,
      loading: false,
      iconButton: false,
      size: "medium",
      // tooltip: "test",
    },
    fields: [
      {
        type: "text",
        name: "label",
      },
      {
        type: "select",
        name: "type",
      },
      {
        type: "select",
        name: "disabled",
      },
      {
        type: "select",
        name: "loading",
      },
      {
        type: "select",
        name: "iconButton",
      },
      {
        type: "select",
        name: "size",
      },
      {
        type: "select",
        name: "color",
      },
      {
        type: "select",
        name: "icon",
      },
      {
        type: "text",
        name: "tooltip",
      },
    ],
  });
