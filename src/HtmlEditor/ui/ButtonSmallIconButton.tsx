import { mdiPackage } from "@mdi/js";
import { Button, CButtonProps } from "../../components/buttons/Button/Button";

const styles = {
  width: 24,
  height: 24,
};

export const ButtonSmallIconButton = (props: CButtonProps) => (
  <Button
    iconButton={true}
    icon={mdiPackage}
    sx={{ ...styles, ...(props?.sx ?? {}) }}
    {...props}
  />
);
