// pages/recommendations.js 
import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material'; // Importa List, ListItem, ListItemText

interface Activity {
  id: number;
  name: string;
  minTemp: number | null;
  maxTemp: number | null;
  rain: boolean;
  category_id: number;
}

export default function RecommendationsPage() {
  const [recommendedActivities, setRecommendedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendedActivities([]); 
    setFetchAttempted(true); 

    try {
      
      const response = await fetch('/api/recommendations/filter');

      if (!response.ok) {
        let errorMsg = `Error ${response.status}: ${response.statusText}`;
        try {
          
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
          // Si el cuerpo del error no es JSON, usa el mensaje HTTP
        }
        throw new Error(errorMsg);
      }

      // array de actividades
      const data: Activity[] = await response.json();

      
      setRecommendedActivities(data);

    } catch (err) {
      console.error("Error al generar recomendaciones:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
      setRecommendedActivities([]); // Asegura que esté vacío en caso de error
    } finally {
      setLoading(false); // Terminar carga
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '2rem',
      gap: '1.5rem'
    }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Recomendaciones de Actividades
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateRecommendations}
        disabled={loading}
        sx={{ minWidth: '200px' }}
      >
        {loading ? 'Generando...' : 'Generar Recomendaciones'}
      </Button>

      {/* Área para mostrar resultados */}
      <Box sx={{ marginTop: '2rem', width: '80%', maxWidth: '600px', minHeight: '100px' }}>
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
               <CircularProgress />
            </Box>
        )}

        {error && !loading && (
          <Typography color="error" variant="body1" align="center">
            Error: {error}
          </Typography>
        )}

        {/* Mostrar resultados solo si no está cargando y no hay error */}
        {!loading && !error && (
          <>
            {/* Mensaje si se buscó y no se encontraron resultados */}
            {fetchAttempted && recommendedActivities.length === 0 && (
              <Typography variant="body1" align="center" color="textSecondary">
                No se encontraron actividades recomendadas para las condiciones actuales.
              </Typography>
            )}

            {/* Mostrar la lista si hay actividades */}
            {recommendedActivities.length > 0 && (
              <>
                <Typography variant="h6" component="h2" align="center" gutterBottom>
                  Actividades Sugeridas:
                </Typography>
                <List dense={true}> {/* List de MUI */}
                  {recommendedActivities.map((activity) => (
                    <ListItem key={activity.id}>
                      {/* o más detalles */}
                      <ListItemText
                        primary={activity.name}
                        // secondary={`Temp: ${activity.minTemp ?? 'N/A'}° - ${activity.maxTemp ?? 'N/A'}°`} //
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* Mensaje inicial si aún no se ha buscado */}
            {!fetchAttempted && (
              <Typography variant="body2" color="textSecondary" align="center">
                Pulsa el botón para obtener recomendaciones basadas en el clima actual (para Concepción).
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}