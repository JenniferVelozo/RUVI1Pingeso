import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box, FormControl,InputLabel, Select, MenuItem } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResponsiveAppBar from './ResponsiveAppBar.js';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Component, useState, useEffect} from 'react';
import axios from 'axios';

//direccionamiento
const direccion = process.env.REACT_APP_DIRECCION_IP

function Register(){
    //tematizacion paper
    const paperStyle={padding :20,height:'80vh',width:260, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#005588', width:60,height:60}

    const [evento, setEvento] = React.useState('');
    const handleChange = (event) => {setEvento(event.target.value);};

    const [ listRoles, setListRoles ] = useState([])
    const [ listServicios, setListServicios ] = useState([])
    //rol de usuario
    let storedRol = JSON.parse(localStorage.getItem(KEY));
    
    useEffect(() => {
        getRoles() 
    },[])

    useEffect(() => {
        getServicios() 
    },[])

    //datafetch roles
    const getRoles = async() => {
        const { data } = await axios.get(direccion+'/rol/')
        setListRoles(data)
        console.log(data)
    }

    //datafetch servicios
    const getServicios = async() => {
        const { data } = await axios.get(direccion+'/servicios/')
        setListServicios(data)
        console.log(data)
    }

    //display formulario
    return(
        <div className='register'>
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar flag={storedRol.flag}/>
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
                        <Select labelId="rol" id="rol" label="Rol" onChange={handleChange} >
                        { listRoles.map(roles => (
                            <MenuItem value={roles.id}>{roles.nombre}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                    <FormControl margin="normal" fullWidth required>
                        <InputLabel id="servicio">Servicio</InputLabel>
                        <Select labelId="servicio" id="servicio" label="Servicio" onChange={handleChange} >
                        { listServicios.map(servicios => (
                            <MenuItem value={servicios.id}>{servicios.nombre}</MenuItem>
                        ))}
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