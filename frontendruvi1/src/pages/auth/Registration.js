import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/LocalStorageService';

const Registration = () => {
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
      servicio: data.get('servicio'),
      rol: data.get('rol'),
      password: data.get('password'),
      password2: data.get('password2'),
    }
    const res = await registerUser(actualData)
    if (res.error) {
      
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      storeToken(res.data.token)
      navigate('/dashboard')
    }
  }
  return <>
    {}
    <Box component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
    
      <TextField margin='normal' required fullWidth id='nickname' name='nickname' label='Nickname' />
      {server_error.nickname ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.nickname[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='nombre' name='nombre' label='Nombre' />
      {server_error.nombre ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.nombre[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='apellido' name='apellido' label='Apellido' />
      {server_error.apellido ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.apellido[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='rut' name='rut' label='Rut' />
      {server_error.rut ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.rut[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='servicio' name='servicio' label='Servicio' />
      {server_error.servicio ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.servicio[0]}</Typography> : ""}

      <TextField margin='normal' required fullWidth id='rol' name='rol' label='Rol' />
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
  </>;
};

export default Registration;
