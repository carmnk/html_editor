import { ReactNode } from "react";

export type UiModelItemValueType = {
  value: string | number | boolean;
};

export type UiModelItemLabelType = {
  value: ReactNode | string;
};

export type UiModelItem<
  ValueType extends UiModelItemValueType = UiModelItemValueType,
  LabelType extends UiModelItemLabelType = UiModelItemLabelType
> = {
  value: ValueType;
  label: LabelType;
  test: {
    regex: string;
    message: string;
    a: "a" | "b" | "c";
  };
};
