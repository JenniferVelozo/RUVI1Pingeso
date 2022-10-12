import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box, FormControl,InputLabel, Select, MenuItem } from '@mui/material';
import Logo from "./Logo.js";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResponsiveAppBar from './ResponsiveAppBar.js';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const Register=()=>{
    const paperStyle={padding :20,height:'80vh',width:260, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#005588', width:60,height:60}
    return(
        <div className='register'>
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar/>
            </div>
            <Grid container spacing={0}>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><PersonAddAltIcon/></Avatar>
                    </Grid>

                    <TextField label="nombre" placeholder="nombre" margin="normal" fullWidth required />
                    <TextField label="apellido" placeholder="apellido" margin="normal" fullWidth required />
                    <TextField label="nickname" placeholder="nickname" margin="normal" fullWidth required />
                    <TextField label="contraseña" placeholder="contraseña" margin="normal" fullWidth required />

                    <FormControl margin="normal" fullWidth required>
                        <InputLabel id="rol">Rol</InputLabel>
                        <Select labelId="rol" id="rol" label="Rol" >
                            <MenuItem value={1}>rol ejemplo 1</MenuItem>
                            <MenuItem value={2}>rol ejemplo 2</MenuItem>
                            <MenuItem value={3}>rol ejemplo 3</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl margin="normal" fullWidth required>
                        <InputLabel id="servicio">Servicio</InputLabel>
                        <Select labelId="servicio" id="servicio" label="Servicio" >
                            <MenuItem value={1}>servicio ejemplo 1</MenuItem>
                            <MenuItem value={2}>servicio ejemplo 2</MenuItem>
                            <MenuItem value={3}>servicio ejemplo 3</MenuItem>
                        </Select>
                    </FormControl>

                    <Box textAlign='center'>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" >
                            Registrar
                        </Button>
                    </Box>
        
                </Paper>
            </Grid>
        </div>
    )
}

export default Register;