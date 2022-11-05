import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useState, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';




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
  { field: 'pendiente', headerName: 'Pendiente', width: 100 },
  { field: 'editar', headerName: 'Editar', width: 100 },
  
];



function ShowTable() {

  const [pageSize, setPageSize] = React.useState(10);

  let baseURL = 'http://localhost:8000/resumen/' //npm i dotenv

  const [ listResumen, setListResumen ] = useState([])

    useEffect(() => {
        getResumen() 
    },[])

    const getResumen = async() => {
        const { data } = await axios.get(baseURL)
        for (var i = 0; i < data.length; i++) {
          if (data[i].emNorma !== 0){
          data[i].emNorma = data[i].emNorma.toFixed(4);
          }
          if (data[i].pcSuperior !== 0){
          data[i].criterio = (data[i].estancia/data[i].pcSuperior);
          }
       }
        setListResumen(data)
        console.log(data)
    }
    

    const [evento, setEvento] = React.useState('');
    const handleChange = (event) => {setEvento(event.target.value);};

    const [ listServicios, setListServicios ] = useState([])
    const getServicios = async() => {
        const { data } = await axios.get('http://localhost:8000/servicios/')
        setListServicios(data)
        console.log(data)
    }

    useEffect(() => {
        getServicios() 
    },[])
  


  return (
    <Box
      sx={{
        height: 300,
        width: '100%',
        '& .cold': {
          backgroundColor: '#c9ffb8',
          color: '#1a3e72',
        },
        '& .mediumcold': {
          backgroundColor: '#b9d5ff91',
          color: '#1a3e72',
        },
        '& .hot': {
          backgroundColor: '#ff3838',
          color: '#1a3e72',
        },
        '& .mediumhot': {
          backgroundColor: '#ff943975',
          color: '#1a3e72',
        },
      }}
    >
      <FormControl margin="normal" required>
          <InputLabel id="rol">Servicio</InputLabel>
          <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                { listServicios.map(servicios => (
                <MenuItem value={servicios.id}>{servicios.nombre}</MenuItem>
                ))}
          </Select>
      </FormControl>
      <DataGrid
        getCellClassName={(params) => {
        if (params.field !== 'criterio' || params.value == null) {
          return '';
        }
        return params.value >= 1.5 ? 'hot' : (params.value >= 0.75 ? "mediumhot" : (params.value >= 0.5 ? "mediumcold" : "cold"));}}
        autoHeight
        autoWidth
        rows={listResumen}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowHeight={() => 'auto'}
        rowsPerPageOptions={[10,25,100]}
        pagination
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      </Box>
  );
}


const Resumen = () => {
    return (
        <div className='resumen' >
          <Box sx={{ display: 'flex' }}>
                <ResponsiveAppBar/>
          </Box>
          <Box sx={{ width: '95%', p: 9}}>
            <ShowTable/>
         </Box>
         <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
              <Fab variant="extended" color="primary">
                  Exportar a XLS <DownloadIcon />
              </Fab>
          </Box>
        </div>
    )
}

export default Resumen;