import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { styled, Paper, TextField, DataGrid,Button, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Component, useState, useEffect} from 'react'


const columns = [
  { id: 'id', label: 'Id', minWidth: 100, align: 'left' },
  { id: 'cama', label: 'Cama', minWidth: 100, align: 'left' },
  { id: 'rut', label: 'Rut', minWidth: 100, align: 'left',},
  { id: 'nombrePaciente', label: 'Nombre Paciente', minWidth: 100, align: 'left', },
  { id: 'estancia', label: 'Estancia', minWidth: 100, align: 'left', },
  { id: 'diagnostico1', label: 'Diagnostico 1', minWidth: 100, align: 'left', },
  { id: 'diagnostico2', label: 'Diagnostico 2', minWidth: 100, align: 'left', },
  { id: 'ir_grd', label: 'IR-GRD', minWidth: 100, align: 'left', },
  { id: 'emNorma', label: 'EM Norma', minWidth: 100, align: 'left', },
  { id: 'pcSuperior', label: 'PC Sup.', minWidth: 100, align: 'left', },
  { id: 'pesoGRD', label: 'Peso GRD', minWidth: 100, align: 'left', },
  { id: 'pendiente', label: 'Pendiente', minWidth: 100, align: 'left', },
  { id: 'editar', label: 'Editar', minWidth: 100, align: 'left', },
];

function createData(id, cama, rut, nombrePaciente, estancia, diagnostico1, diagnostico2, ir_grd, emNorma, pcSuperior, pesoGRD) {
  return { id, cama, rut, nombrePaciente, estancia, diagnostico1, diagnostico2, ir_grd, emNorma, pcSuperior, pesoGRD, pendiente: 'archivo.xls', editar: <TouchAppIcon/> };
}

const rows = [
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', '13241713-5', '3287263', '1', 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
  createData('India', 'IN', 'JoseEduardo nombre muy largo', 3287263, 1, 'diag1', 'diag2', 'ir_grd', 'emNorma', 'pcSuperior', 'pesoGRD'),
];

function ShowTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let baseURL = process.env.REACT_APP_API_URL //npm i dotenv

  const [ listResumen, setListResumen ] = useState([])

    useEffect(() => {
        getResumen() 
    },[])

    const getResumen = async() => {
        const { data } = await axios.get(baseURL)
        setListResumen(data)
        console.log(data)
    }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 595 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor:'#89CFF0',}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {getResumen().data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


const Resumen = () => {
    return (
        <div className='resumen'>
            <div className='App d-flex justify-content-center align-items-center'>
                <ResponsiveAppBar/>
            </div>
            <div className='App d-flex justify-content-center align-items-center'>
                <ShowTable/>
            </div>
        </div>
    )
}

export default Resumen;