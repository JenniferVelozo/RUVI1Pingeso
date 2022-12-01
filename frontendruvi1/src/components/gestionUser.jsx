import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { makeStyles, Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, ListItemButton, ListItemIcon, Checkbox, List, ListItem, ListItemAvatar, ListItemText, Button, DialogContentText} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue, yellow, red } from '@mui/material/colors';

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
  color: theme.palette.text.secondary,
}));


//mostrar tabla
function ShowUsuarios() {

    //definicion columnas tabla
    const columns = [
      { field: 'nickname', headerName: 'Nickname', headerClassName: 'super-app-theme--header', width: 200},
      { field: 'nombre', headerName: 'Nombre', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'apellido', headerName: 'Apellido', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'rut', headerName: 'RUT', headerClassName: 'super-app-theme--header', width: 200 },
      { field: 'servicio', headerName: 'Servicio', headerClassName: 'super-app-theme--header', width: 200},
      { field: 'rol', headerName: 'Rol de usuario', headerClassName: 'super-app-theme--header', width: 200 },
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
    const [ listServicios, setListServicios ] = useState([])
    const [ listRoles, setListRoles ] = useState([])

    const getRoles = async() => {
      const {data} = await axios.get('http://localhost:8000/rol/')
      setListRoles(data)
    }
    const getservicios = async() => {
      const {data} = await axios.get('http://localhost:8000/servicios/')
      setListServicios(data)
    }
    const getUsuarios = async() => {
      const {data} = await axios.get('http://localhost:8000/usuarios/')
      console.log('alo')
      setListUsuarios(data)
    }

    useEffect(() => {
      getUsuarios()
      getservicios()
      getRoles()
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

    console.log(listUsuarios)
    console.log(listServicios)
    console.log(listRoles)

    var listUsuariosAux = listUsuarios
    console.log(listUsuarios)

    const reordenar = async() => {
      listUsuarios.map((usuario) => {
        listUsuariosAux.servicio = listServicios[18].nombre
      })
    }

    //console.log(listUsuariosAux.servicio)
    //setListUsuarios(listUsuariosAux)

    useEffect(() => {
      reordenar()
    },[])
    /*for (let i = 0; i < listUsuarios.length; i++) {
      let aux = listUsuarios[i].servicio-1
      console.log(aux)
      let auxNombre = listServicios[aux]
      console.log(auxNombre)

      listUsuariosAux[i].servicio = listServicios[listUsuarios[i].servicio-1].nombre
    }*/

    //fin setteo usuarios

    const handleEliminar = (params) => {
      console.log('deberia eliminar aqui')
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
              <Button variant="contained" color="primary" sx={{m:2}} align="center" onClick={handleEliminar}>
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

    return (
      <div className='GestionUser' >
        <Box sx={{ display: 'flex' }}>
          <ResponsiveAppBar/>
        </Box>
        <Grid item xs={6} sx={{width: '95%', mt:9, ml: 5, mr: 5, mb: 2}}>
            <Item><h1> GESTIÓN USUARIOS </h1></Item>
        </Grid>
        <Box sx={{ width: '95%', ml: 5, mr: 5}}>
          <ShowUsuarios/>
        </Box>
      </div>
    );
}

export default GestionUser