import { InputAdornment, TextField } from "@mui/material";

type CustomTextfieldProps = {
  id: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  endAdornment?: string;
  placeholder?: string;
  number?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export default function CustomTextfield({ id, value, onChange, label, endAdornment, placeholder, number, required, disabled} : CustomTextfieldProps) {

  return(
    <TextField
      required={required? required : undefined}
      margin="dense"
      id={id}
      name={id}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      type={number? "number" : undefined}
      label={label}
      placeholder={placeholder? placeholder : undefined}
      disabled={disabled? disabled : undefined}
      slotProps={{
        input: {
          endAdornment: <InputAdornment position="end">{endAdornment? endAdornment : undefined}</InputAdornment>,
        },
        inputLabel: {
          shrink: true,
        },
      }}
    />
  )
}