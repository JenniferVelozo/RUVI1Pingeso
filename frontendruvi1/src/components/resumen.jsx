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
//import Gestion_de_Pacientes from '../../Gestion_de_Pacientes.xlsx';
const KEY = "App.rol";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.header,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const Resumen = () => {

  const handleExport = async(event) => {
    const { data } = await axios.get("http://localhost:8000/resumen/")
    const data2 = await axios.post('http://localhost:8000/exportar/', data)
    
  }

  const storedRol = JSON.parse(localStorage.getItem(KEY));

  //mostrar tabla
  function ShowTable() {

    //definicion columnas tabla
    const columns = [
      { field: 'id', headerName: 'Id', width: 60 },
      { field: 'criterio', headerName: 'Criterio', width: 80},
      { field: 'cama', headerName: 'Cama', width: 70},
      { field: 'rut', headerName: 'Rut', width: 100},
      { field: 'nombrePaciente', headerName: 'Nombre Paciente', width: 250 },
      { field: 'estancia', headerName: 'Estancia', width: 80 },
      { field: 'diagnostico1', headerName: 'Diagnostico 1', width: 250 },
      { field: 'diagnostico2', headerName: 'Diagnostico 2', width: 250 },
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
  //END definicion columnas tabla

  // ZONA EDICION PENDIENTES

  // INICIO CHECKBOXES PENDIENTES

  function CheckboxesPendientes(idProp, openProp) {

    console.log(idProp)
    console.log(idProp.props.pendientesJson)
    //listaPendientesPaciente = idProp.pendientesJson.length
    const handleGuardar = async() => {
      console.log(idProp)
      const listaSalida = GenerarListaPendientes();
      const json = {"id": idProp.props.id, "pendientes": listaSalida }
      const {data} = await axios.post('http://localhost:8000/setPendientes/', json)
      getResumen()
    };

    useEffect(() => {
      getPendientes()
    }, [])

    //llamado pendientes
    const [ listPendientes, setListPendientes ] = useState([])
    const getPendientes = async() => {
      const { data } = await axios.get('http://localhost:8000/pendientes/')
      console.log(data)
      for (let i = 0; i < idProp.props.pendientesJson.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (idProp.props.pendientesJson[i].id == data[j].id) {
            console.log(data[j])
            handleToggle(data[j])
          }
        }
      }
      console.log(data)
      setListPendientes(data)
    }

    console.log(idProp)

    

    //fin llamado pendientes

    //guardado de elecciones

    const [checked, setChecked] = React.useState([0]);

    const getChecked = async() => {
      let listaSalida = [0]
      for (let i = 0; i < idProp.props.pendientesJson.length; i++) {
        listaSalida.push(idProp.props.pendientesJson[i].id)
      }
      console.log(listaSalida)
      setChecked(listaSalida)
    }

    useEffect(() => {
      getChecked()
    }, [])

    const handleToggle = (value) => () => {
      console.log(checked)
      console.log("ola")
      const currentIndex = checked.indexOf(value);
      console.log(currentIndex)
      const newChecked = [...checked];
      console.log(newChecked)

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      console.log(newChecked)

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
            <ListItem key={pendientes.id} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(pendientes.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    checked={
                      checked.indexOf(pendientes.id) !== -1}
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
          <CheckboxesPendientes props={props.props.row} openProp={open}/>
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
      getResumen(data)
    //window.location.replace('/resumen');
    };
  

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

  const [pageSize, setPageSize] = React.useState(10);
    
  let baseURL = 'http://localhost:8000/resumen/' //npm i dotenv
    
  const [ listResumen, setListResumen ] = useState([])
    
  useEffect(() => {
    getResumen()
  },[])
    
  const getResumen = async() => {
  const { data } = await axios.get(baseURL)
  const data2 = await axios.post('http://localhost:8000/exportar/', data)
  //console.log(data2.data.msg)
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
      
      if(storedRol.flagJ){
        let resumenFiltrado = []
        for (let i = 0; i < data.length; i++) {
          if (storedRol.servicio_id == data[i].servicio) {
            resumenFiltrado.push(data[i])
          }
        }
        setListResumen(resumenFiltrado)
      }
      else{
        setListResumen(data)
      }
    }

    //funcion filtro servicio
    function FiltroServicio() {

      const [evento, setEvento] = React.useState('');
      const handleChange = async(event) => {
        setEvento(event);
        const { data } = await axios.get('http://localhost:8000/resumen/')
        
        let resumenFiltrado = []
        for (let i = 0; i < data.length; i++) {
          if (event.target.value == data[i].servicio) {
            resumenFiltrado.push(data[i])
          }
        }
        const data2 = await axios.post('http://localhost:8000/exportar/', resumenFiltrado)
        setListResumen(resumenFiltrado)

      };
      const [ listServicios, setListServicios ] = useState([])
      const getServicios = async() => {
          const { data } = await axios.get('http://localhost:8000/servicios/')
          setListServicios(data)
      }

      useEffect(() => {
          getServicios()
      },[])
      
      return (
        <Box sx={{ml: 4, mt:9, mb: 1, width: '95%'}}>
          {storedRol.flagJ?
          <FormControl margin="normal" required sx = {{ width:500 }}>
            <InputLabel id="rol">{storedRol.servicio}</InputLabel>
          </FormControl>
          :
          <FormControl margin="normal" required sx = {{ width:260 }}>
            <InputLabel id="rol">Servicio</InputLabel>
            <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                  
                  { listServicios.map(servicios => (
                  <MenuItem value={servicios.id}>{servicios.nombre}</MenuItem>
                  ))}
            </Select>
          </FormControl>
          }
          <Grid item xs={6}>
              <Item><h1> RESUMEN PACIENTES </h1></Item>
          </Grid>
        </Box>
      );
    }

    //fin filtro servicio
    
  return (
    <div>
    <Box>
      <FiltroServicio/>
    </Box>
    <Box
      sx={{
      ml: 4, mr:3,
      height: 300,
      width: '95%',
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "rgba(0,0,200,0.6)",
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
    </div>
    );
  }

  //END mostrar tabla

  return (
    <div className='resumen' >
      <Box sx={{ display: 'flex' }}>
        <ResponsiveAppBar flag={storedRol.flag}/>
      </Box>
      <Box>
        <ShowTable/>
      </Box>
      <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
        <Fab variant="extended" color="primary" href="http://localhost:8000/descarga/" download="Resumen.xlsx">
          Exportar a XLS <DownloadIcon />
        </Fab>
        
      </Box>
    </div>
  )
}

export default Resumen;