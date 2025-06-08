import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

type SearchTextfieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchTextfield({ value, onChange } : SearchTextfieldProps) {
  return(
    <TextField
      id="search"
      label="Búsqueda"
      type="search"
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={{
        flex: "1",
        maxWidth: "35rem"
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}