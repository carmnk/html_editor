import { mdiInformation } from "@mdi/js";
import Icon from "@mdi/react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { ReactNode, useCallback } from "react";

export type CBottomNavigationProps = {
  value: string;
  onChange: (value: string) => void;
  items: {
    value: string;
    label: ReactNode;
    tooltip?: string;
    disabled?: boolean;
  }[];
};

export const CBottomNavigation = (props: CBottomNavigationProps) => {
  const { value, onChange, items } = props;

  const handleChangeItem = useCallback(
    (e: any, newValue: string) => {
      onChange(newValue);
    },
    [onChange]
  );
  return (
    <BottomNavigation showLabels value={value} onChange={handleChangeItem}>
      {items?.map((item, iIdx) => {
        return (
          <BottomNavigationAction
            value={item.value}
            label={item.label}
            icon={<Icon path={mdiInformation} size={1} />}
          />
        );
      })}
    </BottomNavigation>
  );
};
