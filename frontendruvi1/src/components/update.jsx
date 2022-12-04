import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Dialog, DialogTitle, Avatar, Paper, Button, Grid,Box} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState} from 'react'
import { createTheme, ThemeProvider, darken, lighten } from '@mui/material/styles';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const KEY = "App.rol";

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
    function SubirArchivo() {

      const [open, setOpen] = React.useState(false);

      const [file, setFile] = useState()
      console.log(file)

      const handleInputChange = (event) => {
        console.log(event.target.files[0])
        setFile(event.target.files[0]);

      };

      const handleSubmit = async(event) => {
        console.log(file)
        
        /*else{
          event.preventDefault();
          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", file.name)
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const {data} = await axios.post('http://localhost:8000/subir/pacientes', formData, config)
          const respuestaAlternativo = true
          console.log(data[0])

          

      
          if (data[0].cargado != true) {
            alert("Ningun archivo seleccionado");
          }
          else {
            console.log("Hola Mundo");
            console.log(respuestaAlternativo)
            alert("Archivo subido correctamente, redirigiendo a resumen de pacientes")
            window.location.href = '/resumen';
          }
        }*/
  
        
  
        /*axios.post(url, formData, config).then((response) => {
          console.log(response);
          console.log(formData)
          console.log(response.data);
        });*/
  
      };

      return (
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
                            <input type="file" name="file" onChange={handleInputChange}/>
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
      )

    }
    ///////// FIN SECCION SUBIDA ARCHIVO

    //console.log(file)

    const storedRol = JSON.parse(localStorage.getItem(KEY));
    return (
        <div className='update' >
          <Box sx={{ display: 'flex' }}>
                <ResponsiveAppBar flag={storedRol.flag}/>
          </Box>
          <SubirArchivo/>

        </div>
    )
}

export default Update;