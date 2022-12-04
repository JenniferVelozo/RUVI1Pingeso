import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, Avatar, List, ListItem, ListItemAvatar, ListItemText, Button} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.header,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const KEY = "App.rol";

const storedRol = JSON.parse(localStorage.getItem(KEY));


const columns = [
  { field: 'servicioNombre', headerName: 'Servicio', width: 200},
  { field: 'em', headerName: 'EM', width: 80},
  { field: 'emaf', headerName: 'EMAF', width: 100},
  { field: 'iema', headerName: 'IEMA', width: 100 },
  { field: 'peso', headerName: 'Peso', width: 80 },
  { field: 'iemaInliersMenor', headerName: 'iemaInliers <1', width: 150 },
  { field: 'iemaInliersMayor', headerName: 'iemaInliers >1', width: 150 },
  { field: 'outliers', headerName: 'outliers', width: 80 },
  { field: 'pInt', headerName: 'pInt', width: 80},
  { field: 'pExt', headerName: 'pExt', width: 80 },
  { field: 'condP', headerName: 'condP', width: 80 }
  
];


function ShowTable() {

  const [pageSize, setPageSize] = React.useState(10);

  let baseURL = 'http://localhost:8000/mensual/2022/12  ' //npm i dotenv

  const [ listMensual, setListMensual ] = useState([])

    useEffect(() => {
        getMensual() 
    },[])

    const getMensual = async() => {
        const { data } = await axios.get(baseURL)
        setListMensual(data)
    }
    

    const [evento, setEvento] = React.useState('');
    const handleChange = (event) => {setEvento(event.target.value);};

  //funcion filtro mes
  function FiltroMes() {

    const [evento, setEvento] = React.useState('');
    const handleChange = async(event) => {
      console.log('esperar al cambio')

    };
    const [ listMeses, setListMeses ] = useState([])
    const getMeses = async() => {
        const { data } = await axios.get('http://localhost:8000/servicios/')
        setListMeses(data)
    }

    useEffect(() => {
        getMeses()
    },[])
    
    //retorno filtro y titulo
    return (
      <Box sx={{ml: 4, mt:9, mb: 1, width: '95%'}}>
        {storedRol.flagJ?
        <FormControl margin="normal" required sx = {{ width:500 }}>
          <InputLabel id="rol">{storedRol.servicio}</InputLabel>
        </FormControl>
        :
        <FormControl margin="normal" required sx = {{ width:260 }}>
          <InputLabel id="rol">Mes</InputLabel>
          <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                
                { listMeses.map(meses => (
                <MenuItem value={meses.id}>{meses.nombre}</MenuItem>
                ))}
          </Select>
        </FormControl>
        }
        <Grid item xs={6} >
          <Item><h1> REPORTE MENSUAL </h1></Item>
        </Grid>
      </Box>
    );
  }
  

  //retorno de tabla
  return (
    <div>
    <Box>
      <FiltroMes/>
    </Box>
    <Box
      sx={{
        ml: 4, mr:4,
        height: 300,
        width: '95%',
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "rgba(0,0,200,0.6)",
          fontSize: 16
        },
      }}
    >
      <DataGrid
        autoHeight
        autoWidth
        rows={listMensual}
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
      </div>
  );
}

//deploy vista
const Mensual = () => {

    const storedRol = JSON.parse(localStorage.getItem(KEY));
    return (
        <div className='mensual' >
          <Box sx={{ display: 'flex' }}>
                <ResponsiveAppBar flag={storedRol.flag}/>
          </Box>
          <Box sx={{ width: '95%'}}>
            <ShowTable/>
         </Box>
        </div>
    )
}

export default Mensual;