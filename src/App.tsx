import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import VoluntariosView from './pages/VoluntariosView';
import ProyectosView from './pages/ProyectosView';
import DonacionesView from './pages/DonacionesView';
import DashboardView from './pages/DashboardView';
import LoginView from './pages/LoginView';
import ReportesView from './pages/ReportesView';
import type { ReactElement } from 'react';

// CORRECCIÓN 2: Usamos ReactElement en lugar de JSX.Element
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<LoginView />} />

          {/* Rutas Privadas (Protegidas) */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardView />} />
            <Route path="voluntarios" element={<VoluntariosView />} />
            <Route path="proyectos" element={<ProyectosView />} />
            <Route path="donaciones" element={<DonacionesView />} />
            <Route path="reportes" element={<ReportesView />} />
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;