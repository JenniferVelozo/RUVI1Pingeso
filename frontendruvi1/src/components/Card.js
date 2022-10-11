

function Card({ id, nombre, apellido,deletePersona}) {
    return (
        <div className="card mb-1 border-secondary">
          <img className="mx-auto" width="170" height="110"
               alt={nombre}
               src="https://st2.depositphotos.com/3643473/6205/i/600/depositphotos_62059311-stock-photo-3d-man-choosing-between-yes.jpg"/> 
          
           <div className="card-body">
             <h4>nombre: {nombre}</h4>
             <h4>apellido: {apellido}</h4>
             
            <div className="d-flex flex-row-reverse bd-highlight">
              <button className="btn btn-danger"
              onClick={deletePersona.bind(this, id)}
              >
                <i className="fas fa-trash text-white"></i>
              </button>
            </div>

          </div>
       </div>
    );
  }
 export default Card;