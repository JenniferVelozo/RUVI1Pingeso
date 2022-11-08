import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {es} from 'date-fns/locale';
import { useState, useEffect} from 'react';
import axios from 'axios';
import Historico from './historico';




function ShowDate(){
  const [value, setValue] = useState(new Date());

  let baseURL = 'http://localhost:8000/historicoDates/';

  const [ listFechas, setListFechas ] = useState([]);

  useEffect(() => {
    getFechas(); 
  },[])

  const getFechas = async() => {
    const { data } = await axios.get(baseURL)
    setListFechas(data)
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  function disableNotHistorico(date) {
    for (var i = 0; i < listFechas.length; i++){
      var historico = new Date(addDays(listFechas[i].fecha,1));
      if (historico.getDate() === date.getDate() && historico.getMonth() === date.getMonth() && historico.getFullYear() === date.getFullYear()){
        return false;
      }
    }
    return true;
  }

  return(
    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
    <DatePicker
      label="Elegir fecha"
      shouldDisableDate={disableNotHistorico}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  </LocalizationProvider>
  );
}

const BasicDatePicker = () => {
  return (
    <ShowDate/>
  );
}
export default BasicDatePicker;
