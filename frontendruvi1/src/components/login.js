import React from 'react';
import { Avatar, Paper, TextField, Button, Grid } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Login=()=>{
    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    return(
        <Grid container spacing={0}>
          <Paper elevation={10} style={paperStyle}>
            <Grid align='center'>
                <Avatar style={avatarStyle}><LocalHospitalIcon/></Avatar>
                <h2>Login frontend RUVI1</h2>
            </Grid>

            <TextField id="" label="nombre de usuario" value={'ingrese usuario'} margin="normal" fullWidth required />
            <TextField id="" label="contraseña" value={'ingrese contraseña'} margin="normal" fullWidth required />

            <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />}   >
                Ingresar
            </Button>
        
          </Paper>
        </Grid>
    )
}

export default Login;