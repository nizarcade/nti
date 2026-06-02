import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link as RouterLink } from "react-router-dom";

type Props = ButtonProps & {
  label?: string;
  to?: string;
};

export default function DonateButton({ label = "Donate", ...rest }: Props) {
  return (
    <Button
      component={RouterLink as React.ElementType}
      to="/donate"
      variant="contained"
      color="secondary"
      startIcon={<FavoriteBorderIcon />}
      {...rest}
    >
      {label}
    </Button>
  );
}
