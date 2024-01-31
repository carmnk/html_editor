import { GenericFormProps, StaticFieldType } from "./GenericForm";

export const getDynamicFields = (params: {
  fields: StaticFieldType[] | ((formData: any) => StaticFieldType[]);
  injections: GenericFormProps["injections"];
  formData: any;
  rootFormData: any;
}) => {
  const { fields: fieldsIn, injections, formData, rootFormData } = params;

  const fields =
    typeof fieldsIn === "function" ? fieldsIn?.(formData) : fieldsIn;
  const getInjectedValue = (param: ((value: any) => any) | any) =>
    (typeof param === "function" ? param?.(formData, rootFormData) : param) ??
    undefined;
  const dynamicFields = fields?.map((field) => {
    const injectDynamics = field?.name
      ? {
          disabled: getInjectedValue(injections?.disabled?.[field.name]),
          required: getInjectedValue(injections?.required?.[field.name]),
          options: getInjectedValue(injections?.options?.[field.name]),
          error: getInjectedValue(injections?.error?.[field.name]),
        }
      : {};
    return {
      ...field,
      ...injectDynamics,
    };
  });
  return dynamicFields;
};

export const getInitialFieldValues = (
  fieldsIn: StaticFieldType[]
): { [key: string]: any } => {
  return fieldsIn.reduce((acc, cur) => {
    if (!cur?.name) return acc;
    return {
      ...acc,
      [cur.name]: cur?.type === "array" ? [] : cur?.type === "object" ? {} : "",
    };
  }, {});
};
