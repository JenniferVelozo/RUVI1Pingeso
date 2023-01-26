import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Box, Select, MenuItem, FormControl, InputLabel, Grid} from '@mui/material';
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
import $ from 'jquery';


//direccionamiento
const direccion = process.env.REACT_APP_DIRECCION_IP

//rol de usuario
const KEY = "App.rol";

//tematizacion paper
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.header,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
  }));

////definicion columnas tabla
const columns = [
  { field: 'id', headerName: 'Id', width: 60 },
  { field: 'fecha', headerName: 'Fecha', width: 100 },
  { field: 'criterioView', headerName: 'Días restantes para EM norma', width: 240},
  { field: 'outlineView', headerName: 'Días restantes para Outlier', width: 210},
  { field: 'nombreServicio', headerName: 'Servicio', width: 100 },
  { field: 'criterio', headerName: 'Índice (EM)', width: 110},
  { field: 'outline', headerName: 'Outline (PC)', width: 110},
  { field: 'cama', headerName: 'Cama', width: 70},
  { field: 'rut', headerName: 'Rut', width: 100},
  { field: 'nombrePaciente', headerName: 'Nombre Paciente', width: 250 },
  { field: 'estancia', headerName: 'Estancia', width: 80 },
  { field: 'diagnostico1', headerName: 'Diagnostico 1', width: 250 },
  { field: 'diagnostico2', headerName: 'Diagnostico 2', width: 250 },
  { field: 'ir_grd', headerName: 'IR-GRD', width: 80 },
  { field: 'emNorma', headerName: 'EM Norma', width: 100},
  { field: 'pcSuperior', headerName: 'PC Sup.', width: 80 },
  { field: 'pesoGRD', headerName: 'Peso GRD', width: 100 },
  { field: 'pendiente', headerName: 'Pendiente', width: 200 },
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

  //datafetch para obtener fechas historicas
  const getFechas = async() => {
    const { data } = await axios.get(URL)
    setListFechas(data)
  }

  //nuevas fechas
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  //deshabilitar fechas
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
  const [ listServicios, setListServicios ] = useState([{id:1,nombre:"Unidad de gestion de pacientes"}])

  //datafetch para obtener servicios
  const getServicios = async() => {
      const { data } = await axios.get(direccion+'/servicios/')
      setListServicios(data)
  }

  useEffect(() => {
      getServicios() 
  },[])

   //npm i dotenv


  const [ listResumen, setListResumen ] = useState([])

  useEffect(() => {
      getResumen(evento,value) 
  },[])
  //edicion de lineas
  function addOutline(data){
    var ret= [];
    for (var i = 1; i <= data.length; i++){
      if(data[i-1].estancia === 0 || data[i-1].pcSuperior === 0){
        $.extend( data[i-1], {outline:""});
        ret.push(data[i-1]);

      } else{
        var aux = data[i-1].estancia / data[i-1].pcSuperior;
        $.extend( data[i-1], {outline:aux});
        var aux2 = data[i-1].estancia - data[i-1].emNorma;
        $.extend( data[i-1], {criterioView:aux2});
        var aux3 = data[i-1].estancia - data[i-1].pcSuperior;
        $.extend( data[i-1], {outlineView:aux3});
        ret.push(data[i-1]);
      }

    }
    return ret;
  }
  //datafetch para obtener resumen
  const getResumen = async(evento,value) => {
      var dateOb = value.getDate();
      if(dateOb < 10){
        dateOb = "0" + dateOb;
      }
      var dateM=value.getMonth()+1;
      if(dateM<10){
        dateM="0"+dateM
      }
      let baseURL = direccion+'/historico/'+ value.getFullYear() + "-" + dateM + "-" + dateOb + "/" + listServicios[evento-1].nombre
      const { data } = await axios.get(baseURL)
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        if(data[i].nombreServicio==='nan'){
          data[i].nombreServicio=""
        }
        if (data[i].emNorma !== 0){
          data[i].emNorma = data[i].emNorma.toFixed(4);
        }
        if (data[i].emNorma !== 0){
          data[i].criterio = (data[i].estancia/data[i].emNorma);
        }
        let listPendienteString = ''
        for (var j = 0; j < data[i].pendientesJson.length; j++) {
          if (j < data[i].pendientesJson.length - 1) {
            listPendienteString = data[i].pendientesJson[j].nombre + ', '
          }
          else{
            listPendienteString = listPendienteString + data[i].pendientesJson[j].nombre
          }
        }
        data[i].pendiente = listPendienteString
      }
      if(storedRol.flagJ){
        
        let resumenFiltrado = []
        for (let i = 0; i < data.length; i++) {
          if (storedRol.servicio_id === data[i].servicio_id) {
            resumenFiltrado.push(data[i])
          }
        }
        await axios.post(direccion+'/exportarH/', data)
        setListResumen(addOutline(resumenFiltrado))
        setEvento(evento)
      }
      else{
        
        await axios.post(direccion+'/exportarH/', data)
        setListResumen(addOutline(data))
        setEvento(evento)
      }
  }
    


  //display de la tabla
  return (
    <div className='historico' >
    <Box sx={{ display: 'flex' }}>
          <ResponsiveAppBar flag={storedRol.flag} nick={storedRol.inicial}/>
    </Box>
    <Box sx={{ml: 4, mt:9, mb: 1, width: '95%'}}>
      <Grid container spacing={3}>
          <Grid item xs>
          {storedRol.flagJ?
          <FormControl margin="normal" required sx = {{ width:500 }}>
            <InputLabel id="rol">{storedRol.servicio}</InputLabel>
          </FormControl>
          :
          <FormControl fullWidth required>
            <InputLabel id="rol">Servicio</InputLabel>
            <Select labelId="rol" id="rol" label="Rol" onChange={(newServicio) => {
                getResumen(newServicio.target.value,value);
              }}>
                  { listServicios.map(servicios => (
                  <MenuItem value={servicios.id}>
                    {servicios.nombre}
                  </MenuItem>
                  ))}
            </Select>
          </FormControl>
        }
          </Grid>
          <Grid item xs={6}>
            <Item><h1>LISTAR POR SERVICIO</h1></Item>
          </Grid>
          <Grid item xs>
          <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
            <DatePicker
              label="Elegir fecha"
              shouldDisableDate={disableNotHistorico}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                getResumen(evento,newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          </Grid>
      </Grid>
      </Box>
      <Box sx={{ml: 4, mt:9, mb: 1, width: '95%'}}>
      <Box
      sx={{
        height: 300,
        width: '100%',
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: '#1F90E9',
          fontSize: 16
        },
        '& .edited': {
          backgroundColor: '#CCCCCC',
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
        '& .amarillo': {
          backgroundColor: '#ffcc00',
          color: '#1a3e72',
        },
      }}
    >
      <DataGrid
        getCellClassName={(params) => {
          if (params.field === 'criterioView' && params.row.emNorma > 0 && params.row.outline !== "") {
            return params.row.criterio >= 1 ? 'hot' : (params.row.criterio >= 0.75 ? "mediumhot" : (params.row.criterio >= 0.5 ? "mediumcold" : "cold"));
          }
          if (params.field === 'outlineView' && params.value !== "" && params.row.criterio >= 1) {
            return params.row.outline >= 1 ? 'hot' : (params.row.outline >= 0.6 ? "mediumhot" : "amarillo");
          }
          if (params.row.flag_diag === true ||params.row.flag_pend === true) {
            return 'edited'
          }
        return '';}}
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
          <Fab variant="extended" color="primary" href={direccion+'/descargaH/'} download="Historico.xlsx">
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