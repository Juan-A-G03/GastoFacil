import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tipos from "./pages/Tipo";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Historico from "./pages/Historico";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import PartyDivider from './pages/PartyDivider.jsx';


function App() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register", "/home"].includes(location.pathname);

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
        <Route path="/editar-perfil" element={<EditProfile />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/party"
          element={
            <RequireAuth>
              <PartyDivider />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
