import { Tab, Tabs, Tooltip, Typography, useTheme } from "@mui/material";
import { ReactNode, useMemo } from "react";

export type CTabsProps = {
  value: string;
  onChange: (value: string) => void;
  items: {
    value: string;
    label: ReactNode;
    tooltip?: string;
    disabled?: boolean;
  }[];
};

export const CTabs = (props: CTabsProps) => {
  const { value, onChange, items } = props;
  const theme = useTheme();

  const activeTabStyles = useMemo(
    () => ({
      borderTop: "1px solid " + theme.palette.divider,
      borderLeft: "1px solid " + theme.palette.divider,
      borderRight: "1px solid " + theme.palette.divider,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      background: theme.palette.primary.main,
    }),
    [theme]
  );

  const handleChangeTab = useMemo(() => {
    return items.map((item) => () => {
      onChange(item.value);
    });
  }, [items, onChange]);

  return (
    <Tabs
      sx={{
        pl: 1,
        borderBottom: "1px solid " + theme.palette.divider,
        minHeight: 32,
        my: 1,
      }}
      value={value}
    >
      {items?.map?.((item, iIdx) => (
        <Tooltip key={iIdx} title={item.tooltip} placement="top" arrow>
          <div>
            <Tab
              sx={{
                p: 0,
                minWidth: 40,
                minHeight: 32,
                transition: "background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                opacity: 1,
                ...(item.value === value ? activeTabStyles : {}),
              }}
              disabled={item?.disabled}
              value={item.value}
              label={
                <Typography
                  component="span"
                  textTransform="none"
                  minWidth={40}
                  fontWeight={800}
                  // color="text.primary"
                  lineHeight={"1em"}
                  p={0.5}
                  color={item?.disabled ? "text.disabled" : "text.primary"}
                >
                  {item.label}
                </Typography>
              }
              // sx={{
              //   textTransform: "none",
              //   p: 1,
              //   minWidth: 40,
              //   fontWeight: 800,
              //   color: "text.primary",
              // }}
              onClick={handleChangeTab?.[iIdx]}
            />
          </div>
        </Tooltip>
      )) ?? null}
    </Tabs>
  );
};

// borderTop: "1px solid " + theme.palette.divider,
// borderLeft: "1px solid " + theme.palette.divider,
// borderRight: "1px solid " + theme.palette.divider,
// borderTopLeftRadius: 4,
// borderTopRightRadius: 4,
// background: theme.palette.primary.main,
