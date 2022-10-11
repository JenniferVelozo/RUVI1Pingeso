import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="navbar navbar-expand-sm" >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/" >Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;


