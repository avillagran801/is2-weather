import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TemporaryDrawer from './TemporaryDrawer';

export default function MenuAppBar() {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleOpenDrawer = () => {
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
  }

  return (
    <>
      <AppBar
        position="static"
        style={{ background: "#3a5a40"}}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpenDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nombre aplicación
          </Typography>
        </Toolbar>
      </AppBar>
      <TemporaryDrawer
        open={openDrawer}
        handleClose={handleCloseDrawer}
      />
    </>
  );
}
