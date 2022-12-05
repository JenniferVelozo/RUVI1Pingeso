import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Typography, Dialog, DialogTitle, Avatar, Paper, Button, Grid,Box} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState} from 'react'
import { createTheme, ThemeProvider, darken, lighten } from '@mui/material/styles';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const direccion = process.env.REACT_APP_DIRECCION_IP

const KEY = "App.rol";

const Update = () => {

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonSx = {
    ...(success && {
      '&:hover': {
      },
    }),
  };

  const paperStyle={padding :20,height:'48vh',width:350, margin:"100px auto"}
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
              height:'15vh',
              width:300,
            },
          },
        ],
      },
    },
  });

  ///// SECCION SUBIDA ARCHIVO
  function SubirArchivo() {

    const [file, setFile] = useState()
    console.log(file)

    const handleInputChange = (event) => {
      console.log(event.target.files[0])
      setFile(event.target.files[0]);

    };

    const handleSubmit = async(event) => {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      if (file == undefined){
        console.log('no hay file')
      }
      else{
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        const {data} = await axios.post(direccion+'/subir/CIE10GRD', formData, config)
        const respuestaAlternativo = true
        console.log(data[0])

        

    
        if (data[0].cargado != true) {
          if(data[0].ErrorFormato){
            alert("Archivo archivo seleccionado no cumple con el formato");
          }
          else{
            alert("Ningun archivo seleccionado");
          }
          setSuccess(false);
          setLoading(false);
        }
        else {
          console.log("Hola Mundo");
          setSuccess(true);
          setLoading(false);
          alert("Archivo subido correctamente, redirigiendo a menu")
          window.location.href = '/config';
        }
      }

    };

    return (
      <Grid container spacing={0}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><NoteAddIcon/></Avatar>
                    <h3>Seleccione el archivo Excel .xlsm que desea subir </h3>
                </Grid>

              <Box textAlign='center'>
                  <ThemeProvider theme={theme}>
                      <Button variant="dashed" sx={{ m: 2 }} component="label" >
                      {file == undefined 
                            ? 
                            <Typography variant="h6" component="h2">
                              {loading
                              ?
                              "Cargando archivo"
                              :
                              "Ningún archivo seleccionado"
                              }
                            </Typography> : 
                            <Typography variant="body1" component="body1" noWrap sx={{
                            textAlign: 'center'}}>
                              {file.name}
                            </Typography>}
                          <input type="file" name="file" onChange={handleInputChange} hidden/>
                      </Button>
                  </ThemeProvider>
              </Box>

              <Box textAlign='center'>
              {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '64%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
                {file == undefined ? <Button disabled variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal">
                    Subir
                    </Button>
                    :
                    <Button
                      sx={buttonSx}
                      disabled={loading}
                      variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />} margin="normal" onClick={handleSubmit}>
                      Subir
                    </Button>
                }
              </Box>
      
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
                <ResponsiveAppBar flag={storedRol.flag}  nick={storedRol.inicial}/>
          </Box>
          <SubirArchivo/>

        </div>
    )
}

export default Update;