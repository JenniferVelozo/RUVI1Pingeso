import * as React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import axios from 'axios';
import { Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, Avatar, List, ListItem, ListItemAvatar, ListItemText, Button} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';




const columns = [
  { field: 'servicioNombre', headerName: 'Servicio', width: 80},
  { field: 'em', headerName: 'EM', width: 80},
  { field: 'emaf', headerName: 'EMAF', width: 100},
  { field: 'iema', headerName: 'IEMA', width: 100 },
  { field: 'peso', headerName: 'Peso', width: 80 },
  { field: 'iemaInliersMenor', headerName: 'iemaInliers <1', width: 110 },
  { field: 'iemaInliersMayor', headerName: 'iemaInliers >1', width: 110 },
  { field: 'outliers', headerName: 'outliers', width: 80 },
  { field: 'pInt', headerName: 'pInt', width: 80},
  { field: 'pExt', headerName: 'pExt', width: 80 },
  { field: 'condP', headerName: 'condP', width: 80 }
  
];

// DIALOG 

function ShowDialog(props) {
  const [open, setOpen] = React.useState(false);
  const emails = ['username@gmail.com', 'user02@gmail.com'];

  const [ listPendientes, setListPendientes ] = useState([])
    const getPendientes = async() => {
        const { data } = await axios.get('http://localhost:8000/pendientes/')
        setListPendientes(data)
        console.log(data)
    }

    useEffect(() => {
        getPendientes() 
    },[])

  const handleListItemClick = (value) => {
    //onClose(value);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
          <TouchAppIcon/>
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Seleccione pendientes</DialogTitle>
        <List sx={{ pt: 0 }}>
        {listPendientes.map((pendientes) => (
          <ListItem button onClick={() => handleListItemClick(pendientes.nombrePendiente)} key={pendientes.nombrePendiente}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={pendientes.nombrePendiente} />
          </ListItem>
        ))}
      </List>
      </Dialog>
    </div>
  );
};

//END DIALOG


function ShowTable() {

  const [pageSize, setPageSize] = React.useState(10);

  let baseURL = 'http://localhost:8000/mensual/2022/11' //npm i dotenv

  const [ listResumen, setListResumen ] = useState([])

    useEffect(() => {
        getResumen() 
    },[])

    const getResumen = async() => {
        const { data } = await axios.get(baseURL)
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
      <FormControl margin="normal" required sx = {{ width:260 }}>
          <InputLabel id="rol">Mes</InputLabel>
          <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                <MenuItem value={9}>Septiembre</MenuItem>
                <MenuItem value={10}>Octubre</MenuItem>
                <MenuItem value={11}>Noviembre</MenuItem>
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
              
          </Box>
        </div>
    )
}

export default Resumen;