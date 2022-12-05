import React from 'react';
import { Avatar, Paper, Button, Grid, Box } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import FeedIcon from '@mui/icons-material/Feed';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeartOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResponsiveAppBar from './ResponsiveAppBar.js';

const KEY = "App.rol";

const Home =()=>{
    console.log("Hola")
    let storedRol = JSON.parse(localStorage.getItem(KEY));
    

    const avatarStyle={backgroundColor:'#005588'}
    const paperStyle={padding :20,height:'20vh',width:260, margin:"20px auto"}

    const navigateServicio = () => {
        window.location.href = '/historico';
    }
    return(
        <div className="home">
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar flag={storedRol.flag}  nick={storedRol.inicial}/>
            </div>
            <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
            <Grid container spacing={3}>            
            <Grid item xs>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LocalHospitalIcon/></Avatar>
                        <h5>Listar por Servicio</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" onClick={navigateServicio}></Button>
                    </Grid>
                </Paper>
            </Grid>

            <Grid item xs>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><MonitorHeartIcon/></Avatar>
                        <h5>Listar por Pendientes</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon/>} margin="normal" onClick={navigateServicio}></Button>
                    </Grid>
                </Paper>
                </Grid>
            </Grid>
            { !storedRol.flagJ && 
            <Grid item xs>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><TimelineIcon/></Avatar>
                        <h5>Reporte Mensual</h5>
                        <Button href = "/mensual" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon/>} margin="normal" ></Button>
                    </Grid>
                </Paper>
            </Grid>}
            </div>

        </div>
    );
}

export default Home;