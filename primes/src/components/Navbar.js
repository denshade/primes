import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const dropdownRef = useRef(null);

  function closeDropdown() {
    const el = dropdownRef.current;
    if (el) {
      el.open = false;
    }
  }

  return (
    <nav className="navbar" aria-label="Main">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" end>
          Primes
        </NavLink>
        <ul className="navbar-menu">
          <li>
            <details ref={dropdownRef} className="navbar-dropdown">
              <summary className="navbar-dropdown-summary">
                number theoretical tools
              </summary>
              <ul className="navbar-dropdown-panel" role="menu">
                <li role="none">
                  <NavLink
                    to="/tools/extended-euclid"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    euclid algorithm extended
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/recursive-pow"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    recursive powering
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/chinese-remainder"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    chinese remainder theorem
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/jacobi-symbol"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    jacobi / legendre symbol
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/sqrt-mod-p"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    square root (mod p)
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
                    onClick={closeDropdown}
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
                    onClick={closeDropdown}
                  >
                    irreducibility test (F_p[x])
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/poly-roots-fp"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    polynomial roots (F_p)
                  </NavLink>
                </li>
                <li role="none">
                  <NavLink
                    to="/tools/hensel-lift"
                    className="navbar-dropdown-link"
                    role="menuitem"
                    onClick={closeDropdown}
                  >
                    hensel lifting (mod p^k)
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
