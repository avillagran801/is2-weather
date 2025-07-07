import { Box, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
};

export default function StarRating({ value, onChange, readOnly = false }: Props) {
  return (
    <Box>
      {[1,2,3,4,5].map((star) => (
        <IconButton
          key={star}
          onClick={readOnly || !onChange ? undefined : () => onChange(star)}
          color={star <= value ? "warning" : "default"}
          size="small"
          disabled={readOnly}
          sx={{ cursor: readOnly ? "default" : "pointer" }}
        >
          {star <= value ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      ))}
    </Box>
  );
}