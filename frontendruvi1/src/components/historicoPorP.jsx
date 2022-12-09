import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Box, Select, MenuItem, FormControl, InputLabel, Grid, Button} from '@mui/material';
import { useState, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import 'react-calendar/dist/Calendar.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale';

const direccion = process.env.REACT_APP_DIRECCION_IP

const KEY = "App.rol";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.header,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const columns = [
  { field: 'id', headerName: 'Id', width: 60 },
  { field: 'criterio', headerName: 'Criterio', width: 80},
  { field: 'cama', headerName: 'Cama', width: 70},
  { field: 'rut', headerName: 'Rut', width: 100},
  { field: 'nombrePaciente', headerName: 'Nombre Paciente', width: 250 },
  { field: 'estancia', headerName: 'Estancia', width: 80 },
  { field: 'diagnostico1', headerName: 'Diagnostico 1', width: 250 },
  { field: 'diagnostico2', headerName: 'Diagnostico 2', width: 100 },
  { field: 'ir_grd', headerName: 'IR-GRD', width: 80 },
  { field: 'emNorma', headerName: 'EM Norma', width: 80},
  { field: 'pcSuperior', headerName: 'PC Sup.', width: 50 },
  { field: 'pesoGRD', headerName: 'Peso GRD', width: 100 },
];



function ShowTable() {
  const storedRol = JSON.parse(localStorage.getItem(KEY));
  const [pageSize, setPageSize] = React.useState(10);

  const [value, setValue] = useState(new Date());

  let URL = direccion+'/historicoDates/';

  const [ listFechas, setListFechas ] = useState([]);

  useEffect(() => {
    getFechas(); 
  },[])

  const getFechas = async() => {
    const { data } = await axios.get(URL)
    setListFechas(data)
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  function disableNotHistorico(date) {
    for (var i = 0; i < listFechas.length; i++){
      var historico = new Date(addDays(listFechas[i].fecha,1));
      if (historico.getDate() === date.getDate() && historico.getMonth() === date.getMonth() && historico.getFullYear() === date.getFullYear()){
        return false;
      }
    }
    return true;
  }

  const [evento, setEvento] = React.useState(1);
  const handleChange = (event) => {setEvento(event.target.value);};




  const [ listPendientes, setlistPendientes ] = useState([{id:0,nombre:"todos",}])

  const getPendientes = async() => {
      const { data } = await axios.get(direccion+'/pendientes/')
      setlistPendientes(data)
      console.log(data)
  }

  useEffect(() => {
      getPendientes() 
  },[])

  var dateOb = value.getDate();

  if(dateOb < 10){
    dateOb = "0" + dateOb;
  }

  console.log(evento)
  console.log(listPendientes)
   //npm i dotenv


  const [ listResumen, setListResumen ] = useState([])

  useEffect(() => {
      getResumen() 
  },[])
  

  const getResumen = async(evento) => {
      let baseURL = direccion+'/historico/'+ value.getFullYear() + "-" + (value.getMonth()+1) + "-" + dateOb + "/todos/"+listPendientes[evento-1].nombrePendiente
      const { data } = await axios.get(baseURL)
      for (var i = 0; i < data.length; i++) {
        if (data[i].emNorma !== 0){
        data[i].emNorma = data[i].emNorma.toFixed(4);
        }
        if (data[i].emNorma !== 0){
        data[i].criterio = (data[i].estancia/data[i].emNorma);
        }
      }
      setListResumen(data)
      console.log(data)
  }
    



  return (
    <div className='historico' >
    <Box sx={{ display: 'flex' }}>
          <ResponsiveAppBar flag={storedRol.flag} nick={storedRol.inicial}/>
    </Box>
    <Box sx={{ width: '100%', p: 9}}>
      <Grid container spacing={3}>
          <Grid item xs>
          <FormControl fullWidth required>
            <InputLabel id="rol">Pendiente</InputLabel>
            <Select displayEmpty labelId="rol" id="rol" label="Rol" onChange={(newPendiente) => {
                // setEvento(newPendiente.target.value);
                getResumen(newPendiente.target.value);
              }}>
                  { listPendientes.map(pendientes => (
                  <MenuItem value={pendientes.id}>
                    {pendientes.nombrePendiente}
                  </MenuItem>
                  ))}
            </Select>
        </FormControl>
          </Grid>
          <Grid item xs={6}>
          <Item><h1>LISTAR POR PENDIENTES</h1></Item>
          </Grid>
          <Grid item xs>
          <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
            <DatePicker
              label="Elegir fecha"
              shouldDisableDate={disableNotHistorico}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                getResumen();
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          </Grid>
      </Grid>
      </Box>
      <Box sx={{ width: '95%', p: 9}}>
      <Box
      sx={{
        height: 300,
        width: '100%',
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: '#1F90E9',
          fontSize: 16
        },
        '& .cold': {
          backgroundColor: '#37c871',
          color: '#1a3e72',
        },
        '& .mediumcold': {
          backgroundColor: '#ffcc00',
          color: '#1a3e72',
        },
        '& .hot': {
          backgroundColor: '#0066ff',
          color: '#000000',
        },
        '& .mediumhot': {
          backgroundColor: '#ff0000',
          color: '#1a3e72',
        },
      }}
    >
      <DataGrid
        getCellClassName={(params) => {
        if (params.field !== 'criterio' || params.value == null) {
          return '';
        }
        return params.value >= 1.5 ? 'hot' : (params.value >= 0.75 ? "mediumhot" : (params.value >= 0.5 ? "mediumcold" : "cold"));}}
        autoHeight
        autoWidth
        onChange={(newRows) => {
          setValue(newRows);
        }}
        rows={listResumen}
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
      </Box>
      <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
          <Fab variant="extended" color="primary">
              Exportar a XLS <DownloadIcon />
          </Fab>
      </Box>

  </div>
    
  );
}



const Historico = () => {
    return (
      <ShowTable/>
    )
}

export default Historico;