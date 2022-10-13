import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box, Link, } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import Logo from "./Logo.js";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Component, useState, useEffect} from 'react';
import axios from 'axios'; 
import Home from './home';

function Login(){
    const paperStyle={padding :20,height:'50vh',width:260, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#005588', width:60,height:60}

    const [usuario, setUsuario ] = useState("")
    const [password, setPassword ] = useState("")
    const [respuesta, setRespuesta ] = useState("")

    const getUsuarios = async() => {
        const { data } = await axios.get('http://localhost:8000/login/')
        console.log(data);
     } 

    const loginUsuario = async() => {
        const json = {"nickname": usuario, "password": password } 
        const {data} = await axios.post('http://localhost:8000/login/', json)
        console.log(data);
        setRespuesta(data)
        if (data == "{'entra': 'SI'}"){
            window.location.replace('/home');

        }
        clearInput()
     
    }

    const clearInput = () => {
        setUsuario('')
        setPassword('')
      }


    const handleChange1 = event => {
        this.setState({ usuario: event.target.value });
    }

    const handleChange2 = event => {
        this.setState({ password: event.target.value });
    }

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