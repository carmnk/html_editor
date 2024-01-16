import { Box, Typography } from "@mui/material";

export const FallbackTab = () => {
  return (
    <Box mt={2} textAlign="center">
      <Typography
        fontWeight={700}
        color="text.primary"
        variant="h6"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        No element selected
      </Typography>
    </Box>
  );
};
