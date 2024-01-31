import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { TimePicker } from '@mui/x-date-pickers/TimePicker'
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";
import Icon from "@mdi/react";
import { mdiCalendar } from "@mdi/js";

export type MuiDatePickerProps = Omit<
  DatePickerProps<string, Date>,
  "renderInput" | "name" | "onChange" | "value"
> & {
  ContainerProps?: BoxProps;
  required?: boolean;
  isError?: boolean;
  labelSx?: TypographyProps;
  IconComponent?: React.ReactNode;
  name?: string;
  onChange?: DatePickerProps<string, Date>["onChange"];
  value?: string | null;
};

export const MuiDatePicker = (props: MuiDatePickerProps) => {
  const {
    label,
    required,
    isError,
    labelSx,
    value,
    onChange,
    disabled,
    IconComponent,
    name,
  } = props;
  const [validDate, setValidDate] = React.useState(true);
  const theme = useTheme();

  const themeErrorText = React.useMemo(
    () => ({
      color: theme.palette.error.main,
      fontWeight: 700,
    }),
    [theme]
  );

  const handleChange = (newValue: Date | null) => {
    if (moment(newValue).isValid()) {
      setValidDate(true);
      onChange?.(newValue, name);
    } else {
      setValidDate(false);
      onChange?.(newValue, name);
    }
  };
  return (
    <Box position="relative">
      {label && (
        <Typography
          variant="caption"
          style={isError ? { color: theme.palette.error.main } : {}}
          sx={{ ...labelSx, marginBottom: "8px", marginLeft: "2px" }}
          component="div"
        >
          {label} {required && <strong style={themeErrorText}>*</strong>}
        </Typography>
      )}
      <div>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            inputFormat="DD.MM.YYYY"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            renderInput={(params: any) => (
              <TextField
                {...params}
                name={name}
                sx={{ ...(params?.sx || {}), background: "#fff" }}
                error={isError || !validDate}
                helperText={
                  (!validDate && value !== "") ||
                  ["Invalid date"].includes(value ?? "") ||
                  (value === "" && isError)
                    ? "Format nicht erkannt"
                    : " "
                }
                FormHelperTextProps={{
                  style: {
                    color: isError
                      ? theme.palette.error.main
                      : "rgba(0, 0, 0, 0.6)",
                    marginLeft: 2,
                  },
                }}
                disabled={disabled}
              />
            )}
            className="font-base h-[45px]"
            InputProps={{
              sx: { "& > input": { p: "12px", pl: 2, pr: 2, fontSize: 14 } },
              disabled,
            }}
            // componentsProps={{ icon : { fill: 'blue' } }}
            components={{
              OpenPickerIcon: IconComponent
                ? () => null
                : () => <Icon path={mdiCalendar} size={1} />,
            }}
            InputAdornmentProps={{ sx: { pr: 1 }, onBlur: () => {} }}
            OpenPickerButtonProps={{
              name: name ? name + "_picker" : undefined,
            }}

            // shouldDisableDate={(date) => {
            //   return false
            // }}
          />
        </LocalizationProvider>
      </div>
      <Stack
        direction="row"
        alignItems="center"
        position="absolute"
        height="calc(100% - 24px)"
        top={24}
        right={16}
      >
        {IconComponent}
      </Stack>
    </Box>
  );
};
