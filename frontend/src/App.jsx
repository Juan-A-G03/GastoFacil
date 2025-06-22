import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tipos from "./pages/Tipo";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Historico from "./pages/Historico";

function App() {
  const location = useLocation();
  // Oculta la navbar en login y register
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/tipos"
          element={
            <RequireAuth>
              <Tipos />
            </RequireAuth>
          }
        />
        <Route
          path="/historico"
          element={
            <RequireAuth>
              <Historico />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
