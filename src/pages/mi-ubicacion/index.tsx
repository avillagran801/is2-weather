import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const MiUbicacion: React.FC = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCoords(null);
    
    const query = `${city}, ${country}`;

    try {
      const res = await fetch(`/api/geocode/coordinates?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Algo salió mal');
      } else {
        setCoords(data);
      }
    } catch (err) {
      setError('Error de fetch');
    }
  };
  return (
    <>
      <Typography variant="h4" gutterBottom>
           Actualizar ubicación:
      </Typography>  
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="País" variant="outlined" onChange={(e) => {setCountry(e.target.value); console.log('Country changed to:', e.target.value);}} />
        <TextField id="outlined-basic" label="Ciudad" variant="outlined"  onChange={(e) => {setCity(e.target.value); console.log('City changed to:', e.target.value);}}/>
      </Box>
      <Typography variant="h4" gutterBottom>
            Ciudad Actual: {city}, {country}
      </Typography>  
      {coords && (
        <div style={{ marginTop: '1rem' }}>      
          <p>Latitud: {coords.lat}</p>
          <p>Longitud: {coords.lng}</p>
        </div>
      )}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </>
  );
};

export default MiUbicacion;
