import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EuclidExtendedPage from './pages/EuclidExtendedPage';
import RecursivePowPage from './pages/RecursivePowPage';
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
