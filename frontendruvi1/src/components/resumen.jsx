import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, ListItemButton, ListItemIcon, Checkbox, List, ListItem, ListItemAvatar, ListItemText, Button, DialogContentText} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';


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
  { field: 'pendiente', headerName: 'Pendiente', width: 100 },
  { field: 'Editar Diagnostico 2', renderCell: (params) => {
    return (
      <ShowDialogDiagnostico props={params}/>
    )
  }},
  { field: 'Editar Pendientes', renderCell: (params) => {
    return (
      <ShowDialogPendientes props={params}/>
    )
  }}
  
];

// ZONA EDICION PENDIENTES

// INICIO CHECKBOXES PENDIENTES

function CheckboxesPendientes(idProp, openProp) {

  const handleGuardar = async() => {
      console.log(idProp.openProp)
      const listaSalida = GenerarListaPendientes();
      const json = {"id": idProp.props, "pendientes": listaSalida }
      const {data} = await axios.post('http://localhost:8000/setPendientes/', json)
      window.location.replace('/resumen');
  };

  //llamado pendientes
  const [ listPendientes, setListPendientes ] = useState([])
  const getPendientes = async() => {
      const { data } = await axios.get('http://localhost:8000/pendientes/')
      setListPendientes(data)
  }

  useEffect(() => {
      getPendientes()
  },[])

  //fin llamado pendientes

  //guardado de elecciones

  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
  const currentIndex = checked.indexOf(value);
  const newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
  } else {
    newChecked.splice(currentIndex, 1);
  }

  setChecked(newChecked);
};

function GenerarListaPendientes() {
  const listaSalida = []
  for (let i = 0; i < listPendientes.length; i++) {
    if (checked.indexOf(listPendientes[i].id) !== -1) {
      listaSalida.push(listPendientes[i].id)
    }
  }
  console.log(listaSalida)
  return listaSalida;
}

return (
  <Box sx={{ display: 'flex' }}>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    
      {listPendientes.map((pendientes) => {
          const labelId = `checkbox-list-label-${pendientes.id}`;
          return (
            <ListItem
              key={pendientes.id}
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(pendientes.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(pendientes.id) !== -1}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': labelId }}
                    id = {pendientes.id}
                    label={pendientes.id + ' ' + pendientes.nombrePendiente}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${pendientes.id} ${pendientes.nombrePendiente}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      <Box textAlign='center'>
          <Button variant="contained" color="primary" margin="normal" type='submit' onClick={handleGuardar}>
              Guardar
          </Button>
      </Box>
    </List>
  </Box>
);
}

// END CHECKBOXES PENDIENTES

// DIALOG PENDIENTES

function ShowDialogPendientes(props) {
const [open, setOpen] = React.useState(false);

return (
  <div>
    <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        <TouchAppIcon/>
    </Button>
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Seleccione pendientes</DialogTitle>
      <CheckboxesPendientes props={props.props.row.id} openProp={open}/>
      
    </Dialog>
  </div>
);
};

//END DIALOG PENDIENTES

// END ZONA EDICION PENDIENTES

// ZONA EDICION DIAGNOSTICO 2

// INICIO LISTA DIAGNOSTICOS

function ListaDiagnosticos(props, openProp) {
  const handleClick = (diagnostico) => async() => {
    console.log(props.openProp)
    console.log(diagnostico)
    console.log(props.props)
    const jsonAux = {"codigo": props.props.diagnostico1Cod, "nombre": props.props.diagnostico1}
    var listaSalida = props.props.diagnostico1Cod
    for (let i = 0; i < props.props.diagnostico2Json.length; i++) {
      if (props.props.diagnostico2Json[i].codigo !== diagnostico.codigo) {
      listaSalida = listaSalida + ',' + props.props.diagnostico2Json[i].codigo
      } else { }
    }
    console.log(listaSalida)
    const json = {"id": props.props.id, "principal": diagnostico.codigo, "secundarios": listaSalida, "dias": props.props.estancia}
    console.log(json)
    const {data} = await axios.post('http://localhost:8000/setDiagnosticos/', json)
    window.location.replace('/resumen');
  };

function GenerarListaDiagnosticos(props) {
    console.log(props.id)
    const listaSalida = props
    
    return listaSalida;
}

return (
  <Box sx={{ display: 'flex' }}>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    
      {props.props.diagnostico2Json.map((diagnostico) => {
          const labelId = `checkbox-list-label-${diagnostico.codigo}`;
          return (
            <ListItem
              //key={diagnostico.codigo}
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleClick(diagnostico)}dense>
                <ListItemText id={labelId} primary={`${diagnostico.codigo} ${diagnostico.nombre}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  </Box>
);
}

// END LISTA DIAGNOSTICOS

// DIALOG DIAGNOSTICO 2

function ShowDialogDiagnostico(props) {
  const [open, setOpen] = React.useState(false);

  function StringDiagnostico(props) {
    const texto = props.props.diagnostico1Cod + " " + props.props.diagnostico1
    return texto
  };

  return ( 
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        <TouchAppIcon/>
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle align='center'>Diagnóstico 1 actual:<br/><StringDiagnostico props={props.props.row}/></DialogTitle>
        <DialogContentText align='center'>Diagnosticos secundarios:</DialogContentText>
        <ListaDiagnosticos props={props.props.row} openProp={open}/>
      </Dialog>
    </div>
  );
};

//END DIALOG DIAGNOSTICO 2

// END ZONA EDICION DIAGNOSTICO 2


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
      <FormControl margin="normal" required sx = {{ width:260 }}>
          <InputLabel id="rol">Servicio</InputLabel>
          <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                { listServicios.map(servicios => (
                <MenuItem value={servicios.id}>{servicios.nombre}</MenuItem>
                ))}
          </Select>
      </FormControl>
      <Grid item xs={6}>
          <Item>Resumen pacientes</Item>
          </Grid>
      <DataGrid
        getCellClassName={(params) => {
        if (params.field !== 'criterio' || params.value == null) {
          return '';
        }
        return params.value >= 1 ? 'hot' : (params.value >= 0.75 ? "mediumhot" : (params.value >= 0.5 ? "mediumcold" : "cold"));}}
        autoHeight
        autoWidth
        rows={listResumen}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowHeight={() => 'auto'}
        rowsPerPageOptions={[10,25,100]}
        pagination
        //checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      </Box>
  );
}


const Resumen = () => {

    const handleExport = (event) => {
        window.location.replace('/home');
    }

    return (
        <div className='resumen' >
          <Box sx={{ display: 'flex' }}>
                <ResponsiveAppBar/>
          </Box>
          <Box sx={{ width: '95%', p: 9}}>
            <ShowTable/>
         </Box>
         <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
              <Fab variant="extended" color="primary" onClick={handleExport}>
                  Exportar a XLS <DownloadIcon />
              </Fab>
          </Box>
        </div>
    )
}

export default Resumen;