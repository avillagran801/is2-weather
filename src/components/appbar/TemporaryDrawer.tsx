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
import Link from 'next/link';

type TemporaryDrawerProps = {
  open: boolean;
  handleClose: () => void;
}

export default function TemporaryDrawer({open, handleClose}: TemporaryDrawerProps) {
  const pagesList = [
    {
      name: "Mis actividades",
      url: "/mis-actividades",
      icon: <DirectionsRunIcon />
    },
    {
      name: "Blabla",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      icon: undefined
    },
    {
      name: "Blabla",
      url: "/",
      icon: undefined
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
      <Drawer open={open} onClose={handleClose}>
        {DrawerList}
      </Drawer>
    </>
  );
}
