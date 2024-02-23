import { Box, Divider, Stack, Typography } from "@mui/material";
import {
  ClickTextField,
  ClickTextFieldProps,
} from "../../../components/inputs/ClickTextField";
import { HTML_TAG_NAMES_STRUCTURED_OPTIONS } from "../../defs/HTMLTagNamesDict";
import { groupByCategory } from "../LeftNavigationMenu/AddElementModal";

export type CommonDetailsHeaderProps = {
  idValue?: string;
  typeValue?: string;
  idPlaceholder?: string;
  typePlaceholder?: string;
  typeLabel?: string;
  typeDisabled?: boolean;
  handleChangeElementId: (newValue: string) => void;
  handleChangeElementType?: (newValue: string) => void;
  typeClickTextFieldProps?: ClickTextFieldProps;
  hideDivider?: boolean;
};

export const CommonDetailsHeader = (props: CommonDetailsHeaderProps) => {
  const {
    idValue,
    idPlaceholder,
    typeValue,
    typePlaceholder,
    typeLabel,
    typeDisabled,
    handleChangeElementId,
    handleChangeElementType,
    typeClickTextFieldProps,
    hideDivider,
  } = props;
  return (
    <Box>
      <ClickTextField
        value={idValue ?? ""}
        placeholder={idPlaceholder}
        onChange={handleChangeElementId}
      />
      <Stack direction="row" alignItems="center" gap={1} pb={2}>
        <Typography>{typeLabel}</Typography>
        <ClickTextField
          value={typeValue ?? ""}
          placeholder={typePlaceholder ?? "Set Type"}
          onChange={handleChangeElementType}
          variant="autocomplete"
          options={HTML_TAG_NAMES_STRUCTURED_OPTIONS}
          useChip={true}
          groupBy={groupByCategory}
          disabled={typeDisabled}
          {...typeClickTextFieldProps}
        />
      </Stack>
      {!hideDivider && <Divider />}
    </Box>
  );
};
