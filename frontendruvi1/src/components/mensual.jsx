import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';

import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

//direccionamiento
const direccion = process.env.REACT_APP_DIRECCION_IP

//vista de reporte mensual.

//tematizacion paper
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.header,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

//rol de usuario
const KEY = "App.rol";
const storedRol = JSON.parse(localStorage.getItem(KEY));

//definicion columnas tabla
const columns = [
  { field: 'servicioNombre', headerName: 'Servicio', width: 200, height:50},
  { field: 'fecha', headerName: 'Fecha Creacion', width: 140,height:50 },
  { field: 'em', headerName: 'EM', width: 140, height:50},
  { field: 'emaf', headerName: 'EMAF', width: 140, height:50},
  { field: 'iema', headerName: 'IEMA', width: 140, height:50 },
  { field: 'peso', headerName: 'Peso', width: 140, height:50 },
  { field: 'iemaInliersMenor', headerName: 'iemaInliers <1', width: 140, height:50 },
  { field: 'iemaInliersMayor', headerName: 'iemaInliers >1', width: 140, height:50 },
  { field: 'outliers', headerName: 'outliers', width: 140, height:50  },
  { field: 'pInt', headerName: 'pInt', width: 140, height:50 },
  { field: 'pExt', headerName: 'pExt', width: 140, height:50 },
  { field: 'condP', headerName: 'condP', width: 140, height:50  }
  
];


function ShowTable() {
  const [pageSize, setPageSize] = React.useState(10);
  let baseURL = direccion+'/mensual/' //npm i dotenv
  const [ listMensual, setListMensual ] = useState([])

    useEffect(() => {
        getMensual() 
    },[])
    //datafetch mensual
    const getMensual = async(year, mes) => {
        const { data } = await axios.get(baseURL+year+"/"+mes)
        for (var i = 0; i < data.length; i++) {
          var aux=data[i].em;
          data[i].em=data[i].em.toFixed(2);
          data[i].emaf=data[i].emaf.toFixed(2);
          data[i].iema=data[i].iema.toFixed(2);
          data[i].peso=data[i].peso.toFixed(2);
          data[i].iemaInliersMenor=data[i].iemaInliersMenor.toFixed(2);
          data[i].iemaInliersMayor=data[i].iemaInliersMayor.toFixed(2);
          data[i].outliers=data[i].outliers.toFixed(2);
          data[i].pInt=data[i].pInt.toFixed(2);
          data[i].pExt=data[i].pExt.toFixed(2);
          data[i].condP=data[i].condP.toFixed(2);
        }
        setListMensual(data)
        await axios.post(direccion+'/exportarM/', data)

    }
  
  const handleChange = async(event) => {
    let fechas=listMeses[event.target.value].fecha.split("-")
    getMensual(fechas[0],fechas[1])

  };
  const [ listMeses, setListMeses ] = useState([])
  //datafetch meses
  const getMeses = async() => {
      const { data } = await axios.get(direccion+'/mensualDates/')
      let i=1
      while (i<=data.length){
        let sep=data[i-1].fecha.split("-")
        let aux=sep[0]+"-"+sep[1]
        data[i-1].id=i-1
        data[i-1].fecha=aux
        i=i+1
      }
      setListMeses(data)
  }

  useEffect(() => {
      getMeses()
  },[])
  //retorno de tabla
  return (
    <div>
    <Box>
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
                <MenuItem value={meses.id}>{meses.fecha}</MenuItem>
                ))}
          </Select>
        </FormControl>
        }
        <Grid item xs={6} >
          <Item><h1> REPORTE MENSUAL </h1></Item>
        </Grid>
      </Box>
    </Box>
    <Box
      sx={{
        ml: 4, mr:4,
        height: 300,
        width: '95%',
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: '#1F90E9',
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
        rowsPerPageOptions={[10,25,100]}
        pagination
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      </Box>
      </div>
  );
}

//display vista mensual
const Mensual = () => {

    const storedRol = JSON.parse(localStorage.getItem(KEY));
    return (
        <div className='mensual' >
          <Box sx={{ display: 'flex' }}>
                <ResponsiveAppBar flag={storedRol.flag} nick={storedRol.inicial}/>
          </Box>
          <Box sx={{ width: '95%'}}>
            <ShowTable/>
         </Box>
         <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
          <Fab variant="extended" color="primary" href={direccion+'/descargaM/'} download="Reporte_mensual.xlsx">
              Exportar a XLS <DownloadIcon />
          </Fab>
         </Box>
        </div>
    )
}

export default Mensual;