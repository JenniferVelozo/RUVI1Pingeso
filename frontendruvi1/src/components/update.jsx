import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Avatar, Paper, TextField, Button, Grid, Container, Stack, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Component, useState, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider, darken, lighten } from '@mui/material/styles';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



const Update = () => {

    const paperStyle={padding :20,height:'50vh',width:260, margin:"100px auto"}
    const avatarStyle={backgroundColor:'#005588', width:60,height:60}

    const defaultTheme = createTheme();

    const theme = createTheme({
      components: {
        MuiButton: {
          variants: [
            {
              props: { variant: 'dashed' },
              style: {
                textTransform: 'none',
                border: `2px dashed ${defaultTheme.palette.primary.main}`,
                color: defaultTheme.palette.primary.main,
                height:'20vh',
                width:220,
              },
            },
          ],
        },
      },
    });

    
    /////////


    return (
        <div className='update' >
          <Box sx={{ display: 'flex' }}>
                <ResponsiveAppBar/>
          </Box>
          <Grid container spacing={0}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><NoteAddIcon/></Avatar>
                    <h3>Seleccione el archivo que desea subir </h3>
                </Grid>

                <Box textAlign='center'>
                    <ThemeProvider theme={theme}>
                        <Button variant="dashed" sx={{ m: 2 }} >
                            aqui deberia colocar el archivo y/o visualizarse
                        </Button>
                    </ThemeProvider>
                </Box>

                <Box textAlign='center'>
                    <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" >
                        Subir
                    </Button>
                </Box>
        
            </Paper>
        </Grid>

        </div>
    )
}

export default Update;