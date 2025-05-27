import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

type CustomRadioButtonProps = {
  id: string;
  value: boolean | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}

export default function CustomRadioButton({ id, value, onChange, label, required } : CustomRadioButtonProps) {
  return(
    <FormControl component="fieldset">
      <FormLabel component="legend" required={required? required : undefined}>
        {label}
      </FormLabel>
      <RadioGroup
        row
        aria-label="precipitation-preference"
        name={id}
        value={value}
        onChange={onChange}
      >
        <FormControlLabel value={true} control={<Radio />} label="Sí" />
        <FormControlLabel value={false} control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  );
}