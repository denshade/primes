import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" end>
          Primes
        </NavLink>
        <ul className="navbar-menu">
          <li>
            <details className="navbar-dropdown">
              <summary className="navbar-dropdown-summary">
                number theoretical tools
              </summary>
              <ul className="navbar-dropdown-panel" role="menu">
                <li role="none">
                  <NavLink
                    to="/tools/extended-euclid"
                    className="navbar-dropdown-link"
                    role="menuitem"
                  >
                    euclid algorithm extended
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/recursive-pow"
                    className="navbar-dropdown-link"
                    role="menuitem"
                  >
                    recursive powering
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/chinese-remainder"
                    className="navbar-dropdown-link"
                    role="menuitem"
                  >
                    chinese remainder theorem
                  </NavLink>
                </li>
                <li
                  className="navbar-dropdown-divider"
                  role="separator"
                  aria-hidden
                />
                <li role="none">
                  <NavLink
                    to="/tools/polynomial-gcd"
                    className="navbar-dropdown-link"
                    role="menuitem"
                  >
                    extended gcd for polynomials
                  </NavLink>
                </li>
                <li
                  className="navbar-dropdown-divider"
                  role="separator"
                  aria-hidden
                />
                <li role="none">
                  <NavLink
                    to="/tools/fp-irreducible"
                    className="navbar-dropdown-link"
                    role="menuitem"
                  >
                    irreducibility test (F_p[x])
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
