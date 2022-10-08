import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import FeedIcon from '@mui/icons-material/Feed';
import PieChartIcon from '@mui/icons-material/PieChart';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Home =()=>{
    const avatarStyle={backgroundColor:'#005588'}
    const paperStyle={padding :20,height:'20vh',width:260, margin:"20px auto"}
    return(
        <div classname="home">

            <Grid container spacing={0}>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                        <h5>Análisis de datos</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                    </Grid>
                </Paper>
            </Grid>
            
            <Grid container spacing={0}>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><AccessAlarmIcon/></Avatar>
                        <h5>Pendientes</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                    </Grid>
                </Paper>
            </Grid>

            <Grid container spacing={0}>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><FeedIcon/></Avatar>
                        <h5>Reportes</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                    </Grid>
                </Paper>
            </Grid>

            <Grid container spacing={0}>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><PersonAddAltIcon/></Avatar>
                        <h5>añadir usuario</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                    </Grid>
                </Paper>
            </Grid>

        </div>
    )
}

export default Home;