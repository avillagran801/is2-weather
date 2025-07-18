import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeIcon from '@mui/icons-material/Home';
import InterestsIcon from '@mui/icons-material/Interests';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Link from 'next/link';

type TemporaryDrawerProps = {
  open: boolean;
  handleClose: () => void;
}

export default function TemporaryDrawer({open, handleClose}: TemporaryDrawerProps) {
  const pagesList = [
    {
      name: "Inicio",
      url: "/",
      icon: <HomeIcon/>
    },
    {
      name: "Mis actividades",
      url: "/mis-actividades",
      icon: <DirectionsRunIcon/>
    },
    {
      name: "Mis categorias",
      url: "/mis-categorias",
      icon: <InterestsIcon/>
    },
    {
      name: "Mi ubicación",
      url: "/mi-ubicacion",
      icon: <LocationCityIcon/>
    },
    {
      name: "Gift",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      icon: <CardGiftcardIcon/>
    },
  ];
  
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleClose}>
      <List>
        {pagesList.map((page) => (
          <Link key={page.name} href={page.url}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {page.icon? page.icon : <LocationCityIcon />}
                </ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer open={open} onClose={handleClose} disableScrollLock={true}>
        {DrawerList}
      </Drawer>
    </>
  );
}
