import { Avatar, Paper, TextField, FormControl, InputLabel, Button, Box, Grid, Alert, Typography, MenuItem, Select} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/LocalStorageService';
import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import React from 'react';
import { useEffect} from 'react';
import axios from 'axios';

const direccion = process.env.REACT_APP_DIRECCION_IP

const KEY = "App.rol";
const Registration = () => {
  const paperStyle={padding :30,height:'100vh',width:260, margin:"40px auto"}
  const avatarStyle={backgroundColor:'#005588', width:60,height:60}

  const [evento1, setEvento] = React.useState('');
  
  const handleChange1 = (event) => {setEvento(event.target.value);
  };

  const [evento2, setEvento2] = React.useState('');
  const handleChange2 = (event2) => {setEvento2(event2.target.value);
  };

  

  const [ listRoles, setListRoles ] = useState([])
  const [ listServicios, setListServicios ] = useState([])

  useEffect(() => {
    getRoles() 
  },[])

  useEffect(() => {
      getServicios() 
  },[])

  const getRoles = async() => {
    const { data } = await axios.get(direccion+'/rol/')
    setListRoles(data)
  }

  const getServicios = async() => {
      const { data } = await axios.get(direccion+'/servicios/')
      setListServicios(data)
  }

  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  

  const handleSubmit = async (e) => {
    

    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      nickname: data.get('nickname'),
      nombre: data.get('nombre'),
      apellido: data.get('apellido'),
      rut: data.get('rut'),
      servicio: evento1,
      rol: evento2,
      password: data.get('password'),
      password2: data.get('password2'),
      
    }
    const res = await registerUser(actualData)
    console.log(isLoading)
    if (res.error) {
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      storeToken(res.data.token)
      navigate('/home')
    }
  }
  
  const storedRol = JSON.parse(localStorage.getItem(KEY));
  return <>
    {}
    <div className='register'> 
      <div className='App d-flex justify-content-center align-items-center'>
        <ResponsiveAppBar flag={storedRol.flag} nick={storedRol.inicial}/>
      </div>
    <Grid container spacing={0}> 
    <Paper elevation={10} style={paperStyle}>
    <Grid align='center'>
        <Avatar style={avatarStyle}><PersonAddAltIcon/></Avatar>
    </Grid>
    <Box component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
    
      <TextField margin='normal' required fullWidth id='nickname' name='nickname' label='Nickname' />
      {server_error.nickname ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.nickname[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='nombre' name='nombre' label='Nombre' />
      {server_error.nombre ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.nombre[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='apellido' name='apellido' label='Apellido' />
      {server_error.apellido ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.apellido[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='rut' name='rut' label='Rut' />
      {server_error.rut ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.rut[0]}</Typography> : ""}

      <FormControl margin="normal" fullWidth required>
                        <InputLabel id="servicio">Servicio</InputLabel>
                        <Select labelId="servicio" id="servicio" label="Servicio" onChange={handleChange1} >
                        { listServicios.map(servicios => (
                            <MenuItem value={servicios.id}>{servicios.nombre}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
      
      {server_error.servicio ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.servicio[0]}</Typography> : ""}
      
      <FormControl margin="normal" fullWidth required>
                        <InputLabel id="rol">Rol</InputLabel>
                        <Select labelId="rol" id="rol" label="Rol" onChange={handleChange2} >
                        { listRoles.map(roles => (
                            <MenuItem value={roles.id}>{roles.nombre}</MenuItem>
                        ))}
                        </Select> 
                    
                    </FormControl>
                    
      {server_error.rol ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.rol[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='password' name='password' label='Contraseña' type='password' />
      {server_error.password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</Typography> : ""}
      
      <TextField margin='normal' required fullWidth id='password2' name='password2' label='Confirmar contraseña' type='password' />
      {server_error.password2 ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password2[0]}</Typography> : ""}
      
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Registrar</Button>
      </Box>
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
    </Box>
    </Paper>
    </Grid>
    </div>
  </>;
};

export default Registration;




