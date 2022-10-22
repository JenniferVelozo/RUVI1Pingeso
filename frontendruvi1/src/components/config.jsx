import React from 'react';
import { Avatar, Paper, TextField, Button, Grid, Box, Toolbar } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import FeedIcon from '@mui/icons-material/Feed';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResponsiveAppBar from './ResponsiveAppBar.js';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const Home =()=>{
    const avatarStyle={backgroundColor:'#005588'}
    const paperStyle={padding :20,height:'20vh',width:260, margin:"20px auto"}

    const navigateResumen = () => {
        window.location.href = '/config';
    }

    return(
        <div classname="config">
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar/>
            </div>
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="150"
                    image="https://play-lh.googleusercontent.com/eqmvk0feztsrv-qFNIkb-K7MiDt9OSvfjRZ4-gLGgzrTjSJa09mLzhD8R5w5EQrF_al-"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Gestionar BD CIE10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aquí puedes gestionar las bases de datos correspondientes a la norma CIE10
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
            </Grid>

            </div>


    );
}

export default Home;