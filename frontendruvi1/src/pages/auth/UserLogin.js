import { TextField, Button, Box, Alert, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setUserToken } from '../../features/authSlice';
import { getToken, storeToken } from '../../services/LocalStorageService';
import { useLoginUserMutation } from '../../services/userAuthApi';

import { Avatar, Paper, Grid, Link, } from '@mui/material';
import Logo from "./Logo.js";

const UserLogin = () => {
  const paperStyle={padding :20,height:'50vh',width:260, margin:"20px auto"}
  const avatarStyle={backgroundColor:'#005588', width:60,height:60}


  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      nickname: data.get('nickname'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error) {
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      // console.log(typeof (res.data))
      // console.log(res.data)
      storeToken(res.data.token)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
      navigate('/home')
    }
  }
  let { access_token } = getToken()
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }))
  }, [access_token, dispatch])


  return<>
    <Grid container spacing={0}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><Logo/></Avatar>
          <h2>Acceso RUVI1</h2>
        </Grid>

      
        {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
        {server_error.nickname ? console.log(server_error.nickname[0]) : ""}
        {server_error.password ? console.log(server_error.password[0]) : ""}
        <Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required fullWidth id='nickname' name='nickname' label='Nickname' />
          {server_error.nickname ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.nickname[0]}</Typography> : ""}
          <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
          {server_error.password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</Typography> : ""}
          <Box textAlign='center'>
            {isLoading ? <CircularProgress /> : <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button>}
          </Box>
        </Box>
      </Paper>
    </Grid>
  </>;

    
 

  
};

export default UserLogin;
