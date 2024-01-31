import React from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  Tooltip,
} from "@mui/material";

export type CCheckboxProps = CheckboxProps & {
  label: React.ReactNode;
  formControlLabelProps?: any;
  labelTypographyProps?: any;
  tooltip?: string;
};

const styles = {
  fontSize: "14px",
};

export const CCheckbox = (props: CCheckboxProps) => {
  const {
    value,
    onChange,
    name,
    label,
    formControlLabelProps,
    labelTypographyProps,
    tooltip,
    ...restCheckBoxProps
  } = props;

  const slotProps: any = {};
  if (labelTypographyProps) {
    slotProps.typography = labelTypographyProps;
  }

  return (
    <Tooltip
      disableFocusListener={!tooltip}
      disableHoverListener={!tooltip}
      disableTouchListener={!tooltip}
      disableInteractive={!tooltip}
      title={tooltip}
      placement="top"
      arrow
    >
      <FormControlLabel
        slotProps={slotProps}
        control={
          <Checkbox
            name={name}
            value={value}
            checked={!!value}
            onChange={onChange}
            {...restCheckBoxProps}
          />
        }
        label={label}
        {...formControlLabelProps}
      />
    </Tooltip>
  );
};
