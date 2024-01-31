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

const muiBaseColors = [
  "primary",
  "secondary",
  "error",
  "warning.main",
  "info.main",
  "success.main",
  "text.primary",
  "text.secondary",
  "text.disabled",
  "text.hint",
  "divider",
  "action.active",
  "inherit",
  // 'action.hover',
];
const muiBaseColorsOptions = muiBaseColors.map((bt) => ({
  value: bt,
  label: bt,
}));

const typographyVariants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body1",
  "body2",
  "subtitle1",
  "subtitle2",
  "caption",
  "button",
  "overline",
  "inherit",
];
const typographyVariantOptions = typographyVariants.map((bt) => ({
  value: bt,
  label: bt,
}));

const typographyAligns = ["inherit", "left", "center", "right", "justify"];
const typographyAlignOptions = typographyAligns.map((bt) => ({
  value: bt,
  label: bt,
}));

const optionsDict = {
  // variant: [
  //   { value: "filled", label: "filled" },
  //   { value: "outlined", label: "outlined" },
  //   // { value: "text", label: "text" },
  // ],
  // disabled: booleanOptions,
  noWrap: booleanOptions,
  color: muiBaseColorsOptions,
  variant: typographyVariantOptions,
  align: typographyAlignOptions,
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

export const TypographyComponentPropsFormFactory = () =>
  generateFormProps({
    optionsDict,
    initialFormData: {
      children: "test",
      noWrap: false,
      align: "inherit",
      variant: "body1",
    },
    fields: [
      {
        type: "text",
        name: "children",
      },
      {
        type: "select",
        name: "noWrap",
      },
      {
        type: "select",
        name: "align",
      },
      {
        type: "select",
        name: "variant",
      },
      {
        type: "select",
        name: "color",
      },
    ],
  });
