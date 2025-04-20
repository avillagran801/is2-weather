import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <CircularProgress size="3rem" />
      Cargando...
    </Box>
  );
}