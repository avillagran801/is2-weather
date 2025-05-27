import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button, 
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper,
  Snackbar,
} from "@mui/material";

const MiUbicacion: React.FC = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rememberChoice, setRemeberChoice] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // CHANGE USER_ID LATER
  useEffect(() => {
    const savedPreference = localStorage.getItem("rememberLocationUpdate");
    setRemeberChoice(savedPreference === "true");

    const fetchUserLocation = async () => {
      try {
        const res = await fetch('/api/location/read?user_id=2'); // <--- CHANGE THIS
        const data = await res.json();

        if(!res.ok){
          setError(data.error || 'No se pudo obtener la ubicación del usuario');          
        }

        setCity(data.city);
        setCountry(data.country);
        setCoords({ lat: data.lat, lng: data.lng });
      }
      catch {
        setError('Error de red al obtener ubicación'); // ¿Realmente es un error de red?
      }
    };

    fetchUserLocation();
  }, []);

  // CHANGE USER_ID LATER
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/location/update', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 2, // <--- CHANGE THIS
          city,
          country
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || 'Algo salió mal');
      } else {
        setCoords({ lat: data.latitude, lng: data.longitude });
        setSuccess("Ubicación actualizada correctamente");
      }
    } catch {
      setError('Error de red al enviar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if(!navigator.geolocation) {
      alert('Geolocalización no es soportada por este navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch('api/location/autoupdate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ user_id: 2, latitude, longitude}),
        });

        const data = await res.json();

        if(!res.ok) {
          setError(data.error || 'Error al actualizar ubicación automáticamente');
        } else {
          const [cityName, countryName] = data.city.split(',').map((s: string) => s.trim());
          setCity(cityName);
          setCountry(countryName);
          setCoords({lat: data.latitude, lng: data.longitude});
          setSuccess("Ubicación actualizada correctamente");
        } 
      } catch (error) {
        console.log(error);
        setError('Error de red al actualizar ubicación automáticamente');
      } finally {
        setLoading(false);
      }

    }, () => {
      alert('No se pudo obtener la información del dispositivo.');
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRemeberChoice(isChecked);
    localStorage.setItem("rememberLocationUpdate", String(isChecked));
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Mi Ubicación
      </Typography>

      <TextField
        fullWidth
        label="Ciudad"
        variant="outlined"
        margin="normal"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <TextField
        fullWidth
        label="País"
        variant="outlined"
        margin="normal"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberChoice}
            onChange={handleCheckboxChange}
          />
        }
        label="Recordar mi elección"
      />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Guardar ubicación"}
        </Button>

        <Button onClick={handleAutoUpdate} variant="contained" sx={{ mt: 2 }} fullWidth>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Usar GPS para actualizar"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default MiUbicacion;
