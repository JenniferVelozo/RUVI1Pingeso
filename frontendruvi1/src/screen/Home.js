import  { useEffect, useState } from 'react'
import axios from 'axios' //npm i axios

//components
import Card from '../components/Card'

//variable de entorno
let baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function Home() {

const [ listPersona, setListPersona ] = useState([])
const [nombre, setNombre ] = useState('')
const [apellido, setApellido ] = useState('')

  useEffect(() => {
    getPersonas() 
  },[])

 const getPersonas = async() => {
    const { data } = await axios.get(baseURL)
    setListPersona(data)
    console.log(data)
 } 

 const savePersona = async() => {
   const json = { nombre, apellido } 
   const res = await axios.post(baseURL, json)
   console.log(res) 
   getPersonas() 
   clearInput()

  }

  const clearInput = () => {
    setNombre('')
    setApellido('')
  }

  const deletePersona = async(id) => {
    if(window.confirm('¿Quieres eliminar?')){
      await axios.delete(baseURL+`${id}/`)
      getPersonas()
    }  
  }

    return (
        <div className="p-3">
            <div className="row justify-content-left">
                <div className="col-md-4">
                    <div className="card p-2 mb-2">
                        <input type="text"
                               placeholder="Nombre"
                               className="form-control mt-2"
                               value={nombre}
                               onChange={
                                 (e) => setNombre(e.target.value)}
                        />

                        <input type="text"
                               placeholder="Apellido"
                               className="form-control mt-2"
                               value={apellido}
                               onChange={
                                (e) => setApellido(e.target.value)}
                        />
                       
                        <button className="btn btn-primary mt-2 mb-2"
                                onClick={savePersona}>
                            Save
                        </button>
                        
                                           
                    </div>
                </div>
                 
              <div className="col-md-8 ">
              <div className="row ">
              { listPersona.map(persona => (
                 <div className="col-md-6 mb-2" key={persona.id}>
                      <Card 
                          id={persona.id}
                          nombre={persona.nombre}
                          apellido={persona.apellido} 
                          deletePersona={deletePersona}
                        />
                </div>              
              ))}   
                </div>                          
              </div>   
            </div>
        </div>
    );
}

export default Home;