import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { makeStyles, Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, ListItemButton, ListItemIcon, Checkbox, List, ListItem, ListItemAvatar, ListItemText, Button, DialogContentText} from '@mui/material';
import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue, yellow, red } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
const KEY = "App.rol";
const theme = createTheme({
  palette: {
    primary: red,
    secondary: yellow
  }
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.header,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));


//mostrar tabla
function ShowUsuarios() {

    //definicion columnas tabla
    const columns = [
      { field: 'nickname', headerName: 'Nickname', headerClassName: 'super-app-theme--header', width: 200},
      { field: 'nombre', headerName: 'Nombre', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'apellido', headerName: 'Apellido', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'rut', headerName: 'RUT', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'nombre_servicio', headerName: 'Servicio', headerClassName: 'super-app-theme--header', width: 200},
      { field: 'nombre_rol', headerName: 'Rol de usuario', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'eliminar', headerName: 'Eliminar', headerClassName: 'super-app-theme--header', renderCell: (params) => {
          return (
            <ShowDialog props={params}/>
          )
        }
      }
    ];

    //setteo de usuarios

    //llamados backend
    const [pageSize, setPageSize] = React.useState(10);
    const [ listUsuarios, setListUsuarios ] = useState([])
    const getUsuarios = async() => {
      const {data} = await axios.get('http://localhost:8000/usuariosG/')
      setListUsuarios(data)
    }

    useEffect(() => {
      getUsuarios()
    }, [])


    /*useEffect(() => {
      getRoles()  
    },[])

    const getRoles = async() => {
        const { data } = await axios.get('http://localhost:8000/rol/')
        setListRoles(data)
    }

    useEffect(() => {
      getServicios()  
    },[])

    const getServicios = async() => {
        const { data } = await axios.get('http://localhost:8000/servicios/')
        setListServicios(data)
    }

    useEffect(() => {
      getUsuarios()
    },[])
      
    const getUsuarios  = async() => {
        const { data } = await axios.get('http://localhost:8000/usuarios/')
        setListUsuarios(data)
    }*/
    //fin llamados backend

    //setteo coordinado

    //console.log(listUsuariosAux.servicio)
    //setListUsuarios(listUsuariosAux)
    /*for (let i = 0; i < listUsuarios.length; i++) {
      let aux = listUsuarios[i].servicio-1
      console.log(aux)
      let auxNombre = listServicios[aux]
      console.log(auxNombre)

      listUsuariosAux[i].servicio = listServicios[listUsuarios[i].servicio-1].nombre
    }*/

    //fin setteo usuarios

    const handleEliminar = (usuario) => async() => {
        console.log(usuario.id)
        const json = {"id": usuario.id }
        const {data} = await axios.post('http://localhost:8000/deleteuser/', json)
        getUsuarios()
        //window.location.replace('/resumen');
    }

    function ShowDialog(props) {
      const [open, setOpen] = React.useState(false);
      
      return ( 
        <div>
          <ThemeProvider theme={theme}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            <DeleteIcon/>
          </Button>
          </ThemeProvider>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle align='center'>¿Está seguro que desea eliminar al usuario {props.props.row.nickname}? </DialogTitle>
            <div align="center">
              <Button variant="contained" color="primary" sx={{m:2}} align="center" onClick={handleEliminar(props.props.row)}>
                Sí
              </Button>
              <Button variant="contained" color="primary" sx={{m:2}} align="center" onClick={() => setOpen(false)}>
                No
              </Button>
            </div>
          </Dialog>
        </div>
      );
    };
    
    return (
      <Box sx={{height: 300, width: '100%', "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "rgba(0,0,200,0.6)",
        fontSize: 16
      },}}>
        <DataGrid
              autoHeight
              autoWidth
              rows={listUsuarios}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              getRowHeight={() => 'auto'}
              rowsPerPageOptions={[10,25,100]}
              pagination
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
          />
      </Box>
      );
}

// deploy vista

const GestionUser = () => {
  let storedRol = JSON.parse(localStorage.getItem(KEY));
  const handleRegister = async (e) => {
    window.location.replace('/register');
    
  }

    return (
      <div className='GestionUser' >
        <Box sx={{ display: 'flex' }}>
          <ResponsiveAppBar flag={storedRol.flag}/>
        </Box>
        <Grid item xs={6} sx={{width: '95%', mt:9, ml: 4, mr: 5, mb: 2}}>
            <Item><h1> GESTIÓN USUARIOS </h1></Item>
        </Grid>
        <Box sx={{ width: '95%', ml: 4, mr: 5}}>
          <ShowUsuarios/>
        </Box>
        <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
          <Fab variant="extended" color="primary" onClick={handleRegister}>
            Registrar nuevo usuario <PersonAddAlt1Icon sx={{ml:1}}/>
          </Fab>
        </Box>
      </div>
    );
}

export default GestionUser