import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { HomePage } from '@/pages/HomePage';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="planner-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;