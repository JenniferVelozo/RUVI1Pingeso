import React from 'react';
import { Button, Grid} from '@mui/material';
import ResponsiveAppBar from './ResponsiveAppBar.js';
import { Avatar, Paper } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {  useNavigate } from 'react-router-dom';

const KEY = "App.rol";

const Config =()=>{
    const avatarStyle={backgroundColor:'#005588'}
    const paperStyle={padding :20,height:'20vh',width:260, margin:"20px auto"}
    const storedRol = JSON.parse(localStorage.getItem(KEY));
    

    const navigateResumen = () => {
        window.location.href = '/config';
    }

    return(
        <div classname="config">
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar flag={storedRol.flag}/>
            </div>
            <div style={{
        position: 'absolute', left: '30%', top: '30%',
        transform: 'translate(-20%, -20%)'
      }}>
        <Grid container spacing={8}>
            <Grid item xs>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                            <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                            <h5>Gestionar BD CIE10</h5>
                            <Button href = "/updateCG" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                        </Grid>
                    </Paper>
                </Grid>
            <Grid item xs>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                            <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                            <h5>Gestionar Usuarios</h5>
                            <Button href = "/gestionUser" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                        </Grid>
                    </Paper>
                </Grid>
              <Grid item xs>
                  <Paper elevation={10} style={paperStyle}>
                      <Grid align='center'>
                          <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                          <h5>Configuración del Sistema</h5>
                          <Button href = "/resumen" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                      </Grid>
                  </Paper>
              </Grid>
              </Grid>
            <Grid container spacing={8}>
            <Grid item xs>
                  <Paper elevation={10} style={paperStyle}>
                      <Grid align='center'>
                          <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                          <h5>Gestionar BD GRD</h5>
                          <Button href = "/updateCG" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                      </Grid>
                  </Paper>
              </Grid>
              <Grid item xs>
                  <Paper elevation={10} style={paperStyle}>
                      <Grid align='center'>
                          <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                          <h5>Gestionar tabla Pendientes</h5>
                          <Button href = "/updateP" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                      </Grid>
                  </Paper>
              </Grid>
              <Grid item xs>
                  <Paper elevation={10} style={paperStyle}>
                      <Grid align='center'>
                          <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                          <h5>Información del Sistema</h5>
                          <Button href = "/resumen" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                      </Grid>
                  </Paper>
              </Grid>
              
            </Grid>
            </div>

            </div>


    );
}

export default Config;