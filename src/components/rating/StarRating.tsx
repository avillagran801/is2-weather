import { Box, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function StarRating({ value, onChange }: Props) {
  return (
    <Box>
      {[1,2,3,4,5].map((star) => (
        <IconButton
          key={star}
          onClick={() => onChange(star)}
          color={star <= value ? "warning" : "default"}
          size="small"
        >
          {star <= value ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      ))}
    </Box>
  );
}