import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from "./Logo.js";
import Link from '@mui/material/Link';


import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../features/authSlice';
import {removeToken } from '../services/LocalStorageService';
import { unsetUserInfo } from '../features/userSlice';
const pages = ['Menú', 'Añadir usuario'];
const settings = ['Configuración', 'Cerrar sesión']

//Barra superior
const ResponsiveAppBar = ({flag, nick}) => {

  
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(unsetUserInfo({ name: "", nickname: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    navigate('/login')
  }


  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    
    <Box sx={{ display: 'flex' }}>
    <AppBar component='nav'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
         <Logo/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href='/dashboard'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            RUVI1

          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            RUVI1
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir ajustes">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={nick}/*añadir usuario de la bd*/ src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            > 
              
              <MenuItem key={1} onClick={handleCloseUserMenu}>
                <Link href="/dashboard" underline="hover"><Typography textAlign="center" >Home</Typography></Link>
              </MenuItem>
              <MenuItem key={4} onClick={handleCloseUserMenu}>
                <Link href="/reportes" underline="hover"><Typography textAlign="center" >Reportes</Typography></Link>
              </MenuItem>
              { flag && <MenuItem key={settings[0]} onClick={handleCloseUserMenu}><Link href="/config" underline="hover"><Typography textAlign="center">{settings[0]}</Typography></Link></MenuItem>
              }
              
              <MenuItem key={settings[1]} onClick={handleCloseUserMenu}>
                <Link href="/" onClick={handleLogout}><Typography textAlign="center" color="red" fontWeight='bold'>{settings[1]}</Typography></Link>
              </MenuItem>
              
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </Box>
  );
};
export default ResponsiveAppBar;
