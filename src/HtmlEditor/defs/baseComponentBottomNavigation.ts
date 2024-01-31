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

const optionsDict = {
  // disabled: booleanOptions,
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
  subforms?: { [key: string]: GenericFormProps };
};
const generateFormProps = (params: GenerateFormPropsType): GenericFormProps => {
  const {
    optionsDict,
    initialFormData,
    fields: fieldsIn,
    subforms,
    injections: injectionsIn,
  } = params as any;
  const fields = fieldsIn.map((field: any) => {
    // const isOption = field?.name in options;
    const fieldProps = {
      ...field,
      label: field?.name,
    };
    return fieldProps;
  });
  const injections = {
    ...(injectionsIn ?? {}),
    options: optionsDict,
    initialFormData: initialFormData,
  };
  const formProps = {
    injections,
    fields,
    subforms,
  };
  return formProps as any;
};

export const BottomNavigationComponentPropsFormFactory = () =>
  generateFormProps({
    optionsDict,
    initialFormData: {
      // children: "test",
    },
    fields: [
      {
        type: "text",
        name: "defaultValue",
      },
      {
        type: "array",
        name: "items",
      },
    ],
    injections: {
      disabled: {
        defaultValue: true,
      },
    },
    subforms: {
      items: ItemComponentPropsFormFactory() as any,
    },
  } as any);

export const ItemComponentPropsFormFactory = () => ({
  fields: [
    {
      type: "text",
      name: "value",
    },
    {
      type: "text",
      name: "label",
    },
  ],
});
