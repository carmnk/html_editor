import { _CSS_DISPLAY_UI_VALUES, CSS_DISPLAY } from "../../defs/CssDisplayDict";
import {
  _CSS_DIRECTION_UI_VALUES,
  CSS_FLEX_DIRECTION,
} from "../../defs/CssFlexDirectionDict";

const transformChangingDisplayValue = (
  newDisplayValueIn: string,
  currentDisplayValueIn: string
) => {
  const newDisplayValue = newDisplayValueIn as _CSS_DISPLAY_UI_VALUES;
  const currentDisplayValue = currentDisplayValueIn as CSS_DISPLAY;
  if (newDisplayValue === "inline-") {
    if (["inline", "none"].includes(currentDisplayValue))
      return currentDisplayValueIn;
    else if (!currentDisplayValue.includes("inline-"))
      return "inline-" + currentDisplayValue;
    else if (currentDisplayValue.includes("inline-"))
      return currentDisplayValue.replace("inline-", "");
  }
  return newDisplayValue;
};

const transformChangingDirectionValue = (
  newDisplayValueIn: string,
  currentDisplayValueIn: string
) => {
  const newDisplayValue = newDisplayValueIn as _CSS_DIRECTION_UI_VALUES;
  const currentDisplayValue = currentDisplayValueIn as CSS_FLEX_DIRECTION;
  if (newDisplayValue === "-reverse") {
    if (!currentDisplayValue.includes("-reverse"))
      return currentDisplayValue + "-reverse";
    else if (currentDisplayValue.includes("-reverse"))
      return currentDisplayValue.replace("-reverse", "");
  }
  return newDisplayValue;
};

const isDisplayItemSelected = (itemValue: string, groupValue: string) => {
  return (
    itemValue === groupValue ||
    (groupValue?.includes?.(itemValue) && itemValue !== "inline")
  );
};

const isFlexDirectionItemSelected = (itemValue: string, groupValue: string) => {
  return groupValue?.includes?.(itemValue);
};

const transformers = {
  display: transformChangingDisplayValue,
  flexDirection: transformChangingDirectionValue,
};

export const CUSTOM_CSS_PROPERTY_BUTTON_GROUP_DEFS = {
  transformers,
  isSelectedFns: {
    display: isDisplayItemSelected,
    flexDirection: isFlexDirectionItemSelected,
  },
};
