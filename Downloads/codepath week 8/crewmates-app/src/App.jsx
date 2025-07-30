import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateCrewmate from './pages/CreateCrewmate';
import CrewmateGallery from './pages/CrewmateGallery';
import CrewmateDetail from './pages/CrewmateDetail';
import EditCrewmate from './pages/EditCrewmate';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <h1 className="logo">Crewmates</h1>
          <nav>
            <ul className="nav-list">
              <li><Link to="/">Create</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<CreateCrewmate />} />
            <Route path="/gallery" element={<CrewmateGallery />} />
            <Route path="/crewmates/:id" element={<CrewmateDetail />} />
            <Route path="/crewmates/:id/edit" element={<EditCrewmate />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

