import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const MiUbicacion: React.FC = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [rememberChoice, setRemeberChoice] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
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
      }
    } catch {
      setError('Error de red al enviar la ubicación');
    }
  };

  const handleAutoUpdate = async () => {
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
          setCoords({lat: data.latitude, lng: data.longitude})
        } 
      } catch (error) {
        console.log(error);
        setError('Error de red al actualizar ubicación automáticamente');
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
    <>
      <Typography variant="h4" gutterBottom>
           Actualizar ubicación:
      </Typography>  
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="País" variant="outlined" onChange={(e) => {setCountry(e.target.value); console.log('Country changed to:', e.target.value);}} />
        <TextField id="outlined-basic" label="Ciudad" variant="outlined"  onChange={(e) => {setCity(e.target.value); console.log('City changed to:', e.target.value);}}/>
        <button type = "submit">Actualizar Ciudad</button>
      </Box>

      <Button onClick={handleAutoUpdate} variant="outlined" sx={{ mt: 2 }}>
        Usar GPS para actualizar
      </Button>

      <label>
        <input type = "checkbox" checked={rememberChoice} onChange={handleCheckboxChange}/>
        Recordar mi elección
      </label>

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
