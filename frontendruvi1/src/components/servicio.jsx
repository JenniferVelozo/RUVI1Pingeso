import * as React from 'react';
import axios from 'axios';
import {Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useState, useEffect} from 'react';

function ShowServicio() {

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
      <FormControl fullWidth required>
          <InputLabel id="rol">Servicio</InputLabel>
          <Select labelId="rol" id="rol" label="Rol" onChange={handleChange}>
                { listServicios.map(servicios => (
                <MenuItem value={servicios.id}>{servicios.nombre}</MenuItem>
                ))}
          </Select>
      </FormControl>
  );

}

const Servicio = () => {
    return ( 
        <ShowServicio/>
    )
}
export default Servicio;