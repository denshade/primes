import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EuclidExtendedPage from './pages/EuclidExtendedPage';
import RecursivePowPage from './pages/RecursivePowPage';
import ChineseRemainderPage from './pages/ChineseRemainderPage';
import PolynomialGcdPage from './pages/PolynomialGcdPage';
import FpIrreduciblePage from './pages/FpIrreduciblePage';
import PolyRootsFpPage from './pages/PolyRootsFpPage';
import HenselLiftPage from './pages/HenselLiftPage';
import JacobiSymbolPage from './pages/JacobiSymbolPage';
import SqrtModPPage from './pages/SqrtModPPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/tools/extended-euclid"
            element={<EuclidExtendedPage />}
          />
          <Route
            path="/tools/recursive-pow"
            element={<RecursivePowPage />}
          />
          <Route
            path="/tools/chinese-remainder"
            element={<ChineseRemainderPage />}
          />
          <Route
            path="/tools/jacobi-symbol"
            element={<JacobiSymbolPage />}
          />
          <Route
            path="/tools/sqrt-mod-p"
            element={<SqrtModPPage />}
          />
          <Route
            path="/tools/polynomial-gcd"
            element={<PolynomialGcdPage />}
          />
          <Route
            path="/tools/fp-irreducible"
            element={<FpIrreduciblePage />}
          />
          <Route
            path="/tools/poly-roots-fp"
            element={<PolyRootsFpPage />}
          />
          <Route
            path="/tools/hensel-lift"
            element={<HenselLiftPage />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
