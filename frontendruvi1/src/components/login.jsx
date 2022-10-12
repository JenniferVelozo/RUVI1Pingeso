import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box, Link } from '@mui/material';
import Logo from "./Logo.js";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Login=()=>{
    const paperStyle={padding :20,height:'50vh',width:260, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#005588', width:60,height:60}
    return(
        <Grid container spacing={0}>
          <Paper elevation={10} style={paperStyle}>
            <Grid align='center'>
                <Avatar style={avatarStyle}><Logo/></Avatar>
                <h2>Acceso RUVI1</h2>
            </Grid>

            <TextField label="nombre de usuario" placeholder="nombre de usuario" margin="normal" fullWidth required />
            <TextField label="contraseña" placeholder="contraseña" margin="normal" fullWidth required />

            <Box textAlign='center'>
                <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" >
                    Ingresar
                </Button>
            </Box>
        
          </Paper>
        </Grid>
    )
}

export default Login;