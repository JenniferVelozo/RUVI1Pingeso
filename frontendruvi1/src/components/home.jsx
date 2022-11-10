import React from 'react';
import { Avatar, Paper, Button, Grid, Box } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import FeedIcon from '@mui/icons-material/Feed';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResponsiveAppBar from './ResponsiveAppBar.js';


const Home =()=>{
    const avatarStyle={backgroundColor:'#005588'}
    const paperStyle={padding :20,height:'20vh',width:260, margin:"20px auto"}

    const navigateResumen = () => {
        window.location.href = '/resumen';
    }

    return(
        <div classname="home">
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar/>
            </div>
            <Box align="center" sx={{ width: '100%', p: 7}}>
            <Grid container spacing={3}>
                    <Grid item xs>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                            <Avatar style={avatarStyle}><PieChartIcon/></Avatar>
                            <h5>Análisis de datos</h5>
                            <Button href = "/resumen" variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                        </Grid>
                    </Paper>
                </Grid>
            
            <Grid item xs>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><AccessAlarmIcon/></Avatar>
                        <h5>Pendientes</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" onClick={navigateResumen}></Button>
                    </Grid>
                </Paper>
            </Grid>

            <Grid item xs>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><FeedIcon/></Avatar>
                        <h5>Reportes</h5>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" ></Button>
                    </Grid>
                </Paper>
                </Grid>
            </Grid>
            </Box>

        </div>
    );
}

export default Home;