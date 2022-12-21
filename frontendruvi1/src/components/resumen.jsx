import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Paper, Grid, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, ListItemButton, ListItemIcon, Checkbox, List, ListItem, ListItemText, Button, DialogContentText} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import $ from 'jquery';
import SaveIcon from '@mui/icons-material/Save';

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

//scrollbar
const barra = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "5px"
        },
        "*::-webkit-scrollbar-track": {
          background: "#E4EFEF"
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#1D388F61",
          borderRadius: "2px"
        }
      }
    }
  }
});

const Resumen = () => {
  const storedRol = JSON.parse(localStorage.getItem(KEY));

  //mostrar tabla
  function ShowTable() {

    //definicion columnas tabla
    const columns = [
      { field: 'id', headerName: 'Id', width: 80 },
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
      { field: 'Editar Diagnóstico', width:150, renderCell: (params) => {
        return (
          <ShowDialogDiagnostico props={params}/>
        )
      }},
      { field: 'Editar Pendientes', width:150, renderCell: (params) => {
        return (
          <ShowDialogPendientes props={params}/>
        )
      }}
    
    ];
    const columnsJ = [
      { field: 'id', headerName: 'Id', width: 40 },
      { field: 'criterioView', headerName: 'EM - Estancia', width: 100},
      { field: 'outlineView', headerName: 'PC - Estancia', width: 110},
      { field: 'nombreServicio', headerName: 'Servicio', width: 100 },
      { field: 'criterio', headerName: 'Índice (EM)', width: 100},
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
      { field: 'pendiente', headerName: 'Pendiente', width: 200 }
    
    ];
  //END definicion columnas tabla

  // ZONA EDICION PENDIENTES

  // INICIO CHECKBOXES PENDIENTES

  function CheckboxesPendientes(idProp, openProp) {

    //handler post cambio pendientes
    const handleGuardar = async() => {
      const listaSalida = GenerarListaPendientes();
      const json = {"id": idProp.props.id, "pendientes": listaSalida}
      const {data} = await axios.post(direccion+'/setPendientes/', json)
      getResumen(data)
      
    };
    useEffect(() => {
      getPendientes()
    }, [])

    //llamado pendientes
    const [ listPendientes, setListPendientes ] = useState([])
    const getPendientes = async() => {
      const { data } = await axios.get(direccion+'/pendientes/')
      for (let i = 0; i < idProp.props.pendientesJson.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (idProp.props.pendientesJson[i].id == data[j].id) {
            handleToggle(data[j])
          }
        }
      }
      setListPendientes(data)
    }
    //fin llamado pendientes

    //guardado de elecciones
    const [checked, setChecked] = React.useState([0]);
    const getChecked = async() => {
      let listaSalida = [0]
      for (let i = 0; i < idProp.props.pendientesJson.length; i++) {
        listaSalida.push(idProp.props.pendientesJson[i].id)
      }
      setChecked(listaSalida)
    }
    useEffect(() => {
      getChecked()
    }, [])

    //handler cambio en checkbox
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

    //generar lista de nuevos pendientes checkeados
    function GenerarListaPendientes() {
      const listaSalida = []
      for (let i = 0; i < listPendientes.length; i++) {
        if (checked.indexOf(listPendientes[i].id) !== -1) {
          listaSalida.push(listPendientes[i].id)
        }
      }
      return listaSalida;
    }

    //display de checkboxes de pendientes
    return (
      <Grid item>
      <Grid>
        <ThemeProvider theme={barra}>
        <List sx={{ width: '100%', maxHeight: 360, maxWidth: 360 }}>
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
        </List>
        </ThemeProvider>
      </Grid>
      <Box const style = {{position: 'fixed'}} sx={{height: '100%', width: '100%'}}>
        <Button  sx={{mt: 2, ml: 14}} variant="contained" color="primary" type='submit' onClick={handleGuardar}>
            Guardar
        </Button>
      </Box>
      </Grid>
    );
  }

  // END CHECKBOXES PENDIENTES

  // DIALOG PENDIENTES

  function ShowDialogPendientes(props) {
    const [open, setOpen] = React.useState(false);

    //display boton edicion de pendientes
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

  // END DIALOG PENDIENTES

  // END ZONA EDICION PENDIENTES

  // ZONA EDICION DIAGNOSTICOS

  function ListaDiagnosticos(props, openProp) {

    //handler intercambio de diagnostico 1 y 2
    const handleClick = (diagnostico) => async() => {
      var listaSalida = []
      if (props.props.diagnostico1Cod != 0) {
        listaSalida = props.props.diagnostico1Cod
      }
      else{
        return 0
      }
      for (let i = 0; i < props.props.diagnostico2Json.length; i++) {
        if (props.props.diagnostico2Json[i].codigo !== diagnostico.codigo) {
          if (listaSalida.length !== 0) {
            listaSalida = listaSalida + ',' + props.props.diagnostico2Json[i].codigo
          } else {
          listaSalida = props.props.diagnostico2Json[i].codigo
          }
        } else { }
      }
      if (listaSalida.length === 0) {
        listaSalida = ''
      }
      
      const json = {"id": props.props.id, "principal": diagnostico.codigo, "secundarios": listaSalida, "dias": props.props.estancia}
      const {data} = await axios.post(direccion+'/setDiagnosticos/', json)
      getResumen(data)
    
    };
  
    //display de lista de diagnosticos
    return (
      <Box sx={{ display: 'flex' }}>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {props.props.diagnostico2Json.map((diagnostico) => {
            const labelId = `checkbox-list-label-${diagnostico.codigo}`;
            return (
              <ListItem
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

    //diagnosticos con su id en string
    function StringDiagnostico(props) {
      const texto = props.props.diagnostico1Cod + " " + props.props.diagnostico1
      return texto
    };

    //display boton edicion de diagnosticos
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

  //edicion de lineas
  function addOutline(data){
    var ret= [];
    for (var i = 1; i <= data.length; i++){
      if(data[i-1].estancia == 0 || data[i-1].pcSuperior == 0){
        $.extend( data[i-1], {outline:""});
        ret.push(data[i-1]);

      } else{
        var aux = data[i-1].estancia / data[i-1].pcSuperior;
        $.extend( data[i-1], {outline:aux});
        var aux = data[i-1].estancia - data[i-1].emNorma;
        $.extend( data[i-1], {criterioView:aux});
        var aux = data[i-1].estancia - data[i-1].pcSuperior;
        $.extend( data[i-1], {outlineView:aux});
        ret.push(data[i-1]);
      }

    }
    return ret;
  }

  const [pageSize, setPageSize] = React.useState(10);
  const [ listResumen, setListResumen ] = useState([])
  useEffect(() => {
    getResumen()
  },[])
    
  //datafetch resumen
  const getResumen = async() => {
    const { data } = await axios.get(direccion+'/resumen/')
    for (var i = 0; i < data.length; i++) {
        if(data[i].nombreServicio=='nan'){
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
            listPendienteString = listPendienteString + data[i].pendientesJson[j].nombre + ', '
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
        const data2 = await axios.post(direccion+'/exportar/', resumenFiltrado)
        setListResumen(addOutline(resumenFiltrado))
      }
      else{
        const data2 = await axios.post(direccion+'/exportar/', data)
        setListResumen(addOutline(data))
      }
    }

  //filtro servicio
  const [evento, setEvento] = React.useState('');
  const handleChange = async(event) => {
    setEvento(event);
    const { data } = await axios.get(direccion+'/resumen/')
    for (var i = 0; i < data.length; i++) {
      if(data[i].nombreServicio=='nan'){
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
          listPendienteString = listPendienteString + data[i].pendientesJson[j].nombre + ', '
        }
        else{
          listPendienteString = listPendienteString + data[i].pendientesJson[j].nombre
        }
      }
      data[i].pendiente = listPendienteString
    }
    let resumenFiltrado = []
    if(event==1){
      resumenFiltrado = data
    }
    else{
      resumenFiltrado = []
      for (let i = 0; i < data.length; i++) {
        if (event.target.value == data[i].servicio) {
          resumenFiltrado.push(data[i])
        }
      }
    }
    const data2 = await axios.post(direccion+'/exportar/', resumenFiltrado)
    setListResumen(addOutline(resumenFiltrado))

  };

  //datafetch servicios
  const [ listServicios, setListServicios ] = useState([])
  const getServicios = async() => {
      const { data } = await axios.get(direccion+'/servicios/')
      setListServicios(data)
  }
  useEffect(() => {
      getServicios()
  },[])  

  //display de tabla de resumen
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
            <InputLabel id="rol">Servicio</InputLabel>
            <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                  
                  { listServicios.map(servicios => (
                  <MenuItem value={servicios.id}>
                    {servicios.nombre}
                  </MenuItem>
                  ))}
            </Select>
          </FormControl>
          }
          <Grid item xs={6}>
              <Item><h1> RESUMEN PACIENTES </h1></Item>
          </Grid>
        </Box>
    </Box>
    <Box
      sx={{
      ml: 4, mr:3,
      height: 300,
      width: '95%',
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
          if (params.field == 'criterioView' && params.row.emNorma > 0 && params.row.outline !== "") {
            return params.row.criterio >= 1 ? 'hot' : (params.row.criterio >= 0.75 ? "mediumhot" : (params.row.criterio >= 0.5 ? "mediumcold" : "cold"));
          }
          if (params.field == 'outlineView' && params.value !== "" && params.row.criterio >= 1) {
            return params.row.outline >= 1 ? 'hot' : (params.row.outline >= 0.6 ? "mediumhot" : "amarillo");
          }
          if (params.row.flag_diag == true) {
            return 'edited'
          }
          return '';}}
            autoHeight
            autoWidth
            rows={listResumen}
            columns={storedRol.flagJ? columnsJ:columns}
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

  //END mostrar tabla

  //display de resumen
  return (
    <div className='resumen' >
      <Box sx={{ display: 'flex' }}>
        <ResponsiveAppBar flag={storedRol.flag}  nick={storedRol.inicial}/>
      </Box>
      <Box>
        <ShowTable/>
      </Box>
      <Box const style = {{position: 'fixed', bottom: 0, left: 0, margin: 20}}>
        <Fab variant="extended" color="primary" href={direccion+'/descarga/'} download="Resumen.xlsx">
          Exportar a XLS <DownloadIcon />
        </Fab>
        
      </Box>
    </div>
  )
}

export default Resumen;