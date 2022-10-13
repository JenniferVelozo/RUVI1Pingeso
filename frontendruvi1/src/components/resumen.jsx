import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Container, Paper, TextField,Button, Stack, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Component, useState, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';


const columns = [
  { field: 'id', headerName: 'Id', width: 60 },
  { field: 'cama', headerName: 'Cama', width: 55},
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

function createData(id, cama, rut, nombrePaciente, estancia, diagnostico1, diagnostico2, ir_grd, emNorma, pcSuperior, pesoGRD) {
  return { id, cama, rut, nombrePaciente, estancia, diagnostico1, diagnostico2, ir_grd, emNorma, pcSuperior, pesoGRD, pendiente: 'archivo.xls', editar: <TouchAppIcon/> };
}


function ShowTable() {

  const [pageSize, setPageSize] = React.useState(10);

  let baseURL = process.env.REACT_APP_API_URL //npm i dotenv

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
       }
        setListResumen(data)
        console.log(data)
    }


  return (
      <DataGrid
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

        </div>
    )
}

export default Resumen;