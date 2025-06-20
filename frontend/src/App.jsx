import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tipo from "./pages/Tipo";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
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
              <Tipo />
            </RequireAuth>
          }
        />
      </Routes>
      <Navbar />
    </BrowserRouter>
  );
}

export default App;
