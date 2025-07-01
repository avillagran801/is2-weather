import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type LoginRegisterFormProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => void;
  handleRegister: () => void;
}

export default function LoginRegisterForm({ isLogin, setIsLogin, username, setUsername, password, setPassword, handleLogin, handleRegister } : LoginRegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleButton = () => {
    if(isLogin){
      handleLogin();
    }
    else {
      handleRegister();
    }
  }
  
  return(
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        padding: "5rem"
      }}>
        <Paper sx={{
          width: "35rem",
          padding: "2rem"
        }}>
          <Typography variant="h5" align="center" >
            <b>{isLogin? "Iniciar sesión" : "Registrarse"}</b>
          </Typography>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            paddingX: "1rem",
            paddingY: "3rem",
            gap: "1.5rem",
          }}>
            <TextField
              id="username"
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
              label="Nombre de usuario"
              required
            />

            <FormControl fullWidth variant="outlined" required>
              <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </FormControl>
          </Box>

          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "3rem"
          }}>
            <Button
              variant="contained"
              onClick={() => handleButton()}
            >
              {isLogin? "Iniciar sesión" : "Registrarse"}
            </Button>
          </Box>

          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            {isLogin? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <Button
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin? "Regístrate" : "Inicia sesión"}
            </Button>
          </Box>

        </Paper>
      </Box>
    </>
  );
}