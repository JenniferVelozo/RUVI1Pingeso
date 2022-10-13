import React from 'react'
import { Component, useState, useEffect} from 'react'
import {  } from '@mui/material';
import axios from 'axios';

function Lala() {

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

    return(
        <div>
            <h1>hola</h1>

            { listResumen.map(resumen => (
                 <div className="col-md-6 mb-2" key={resumen.id}>
                      <h4> LALA{resumen.rut} </h4>
                </div>
              ))}
        </div>
    )
    
}

export default Lala;