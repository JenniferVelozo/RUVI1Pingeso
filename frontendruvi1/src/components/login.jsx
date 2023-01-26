import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box, Link, } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import Logo from "./Logo.js";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Component, useState, useEffect} from 'react';
import axios from 'axios'; 
import Home from './home';

//direccionamiento
const direccion = process.env.REACT_APP_DIRECCION_IP

//login de usuarios.
function Login(){
    const paperStyle={padding :20,height:'50vh',width:260, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#005588', width:60,height:60}

    const [usuario, setUsuario ] = useState("")
    const [password, setPassword ] = useState("")
    const [respuesta, setRespuesta ] = useState("")

    const getUsuarios = async() => {
        const { data } = await axios.get(direccion+'/login/')
        console.log(data);

     } 

    const loginUsuario = async() => {
        const json = {"nickname": usuario, "password": password } 
        const {data} = await axios.post(direccion+'/login/', json)
        setRespuesta(data)
        data=JSON.parse(data)
        if (data.entra == 'SI' && data.rol=='Administrador'){
            window.location.replace('/home');
        }
        clearInput()
     
    }

    const clearInput = () => {
        setUsuario('')
        setPassword('')
      }

    //display login
    return(
        <Grid container spacing={0}>
          <Paper elevation={10} style={paperStyle}>
            <Grid align='center'>
                <Avatar style={avatarStyle}><Logo/></Avatar>
                <h2>Acceso RUVI1</h2>
            </Grid>

            <TextField label="nombre de usuario" placeholder="nombre de usuario" margin="normal" fullWidth required onChange={(e) => setUsuario(e.target.value)} />
            <TextField label="contraseña" placeholder="contraseña" margin="normal" fullWidth required onChange={(e) => setPassword(e.target.value)} />

            <Box textAlign='center'>
                <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" onClick={loginUsuario} >
                    Ingresar
                </Button>
            </Box>
        
          </Paper>
        </Grid>
    )
}

export default Login;