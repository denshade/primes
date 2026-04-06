import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EuclidExtendedPage from './pages/EuclidExtendedPage';
import RecursivePowPage from './pages/RecursivePowPage';
import ChineseRemainderPage from './pages/ChineseRemainderPage';
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
