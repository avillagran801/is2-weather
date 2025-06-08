import { Box, Button } from "@mui/material";
import SearchTextfield from "./SearchTextfield";
import AddIcon from '@mui/icons-material/Add';

type SearchAndCreateBarProps = {
  searchTerm: string;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText: string;
  onButtonClick: () => void;  
}

export default function SearchAndCreateBar({ searchTerm, onSearchTermChange, buttonText, onButtonClick } : SearchAndCreateBarProps) {
  return(
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
    }}>
      <SearchTextfield
        value={searchTerm}
        onChange={onSearchTermChange}
      />
      <Button
        onClick={onButtonClick}
        sx={{
          backgroundColor: "#3a5a40",
          color: "white",
          paddingX: "1rem",
          display: {
            xs: "none",
            sm: "block"
          }
        }}
      >
        {buttonText}
      </Button>
      <Button
        onClick={onButtonClick}
        sx={{
          backgroundColor: "#3a5a40",
          color: "white",
          display: {
            xs: "block",
            sm: "none"
          }
        }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <AddIcon />
        </Box>
      </Button>
    </Box>
  );
}