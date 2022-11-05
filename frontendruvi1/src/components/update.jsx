import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Avatar, Paper, Button, Grid,Box} from '@mui/material';

import { useState} from 'react'
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
                width:520,
              },
            },
          ],
        },
      },
    });

    ///// SECCION SUBIDA ARCHIVO

    const [file, setFile] = useState()

    const handleInputChange = (event) => {
      console.log(event.target.files)
      setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {

      event.preventDefault();
      const url = 'http://localhost:8000/subir/';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      axios.post(url, formData, config).then((response) => {
        console.log(response.data);
      });

    };
    ///////// FIN SECCION SUBIDA ARCHIVO


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

                <form onSubmit={handleSubmit}>
                <Box textAlign='center'>
                    <ThemeProvider theme={theme}>
                        <Button variant="dashed" sx={{ m: 2 }} component="label" >
                            aqui deberia colocar el archivo y/o visualizarse
                            <input type="file" name="file" onChange={handleInputChange} />
                        </Button>
                    </ThemeProvider>
                </Box>


                <Box textAlign='center'>
                    <Button variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" type='submit' >
                        Subir
                    </Button>
                </Box>

                </form>
        
            </Paper>
        </Grid>

        </div>
    )
}

export default Update;