import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FolderHeart, Gift, FileBarChart, LogOut } from 'lucide-react';

export default function Sidebar() {
  // Función para estilos dinámicos del menú
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `group flex items-center gap-3 px-4 py-3.5 mx-3 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-teal-500/10 text-teal-300 shadow-inner shadow-teal-500/5' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
    }`;

  const { logout, user } = useAuth(); // Usamos el hook

  return (
    // Fondo oscuro profundo con un degradado muy sutil hacia abajo
    <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-white/5 flex flex-col z-20 shadow-2xl">
      {/* Logo Area */}
      <div className="p-8 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
             <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">ONG System</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Gestión Social</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        <p className="px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Principal</p>
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={20} className="transition-transform group-hover:scale-110" /> Dashboard
        </NavLink>
        <NavLink to="/proyectos" className={navClass}>
          <FolderHeart size={20} className="transition-transform group-hover:scale-110" /> Proyectos
        </NavLink>
        
        <p className="px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Gestión</p>
        <NavLink to="/voluntarios" className={navClass}>
          <Users size={20} className="transition-transform group-hover:scale-110" /> Voluntarios
        </NavLink>
        <NavLink to="/donaciones" className={navClass}>
          <Gift size={20} className="transition-transform group-hover:scale-110" /> Donaciones
        </NavLink>
        <NavLink to="/reportes" className={navClass}>
          <FileBarChart size={20} className="transition-transform group-hover:scale-110" /> Reportes
        </NavLink>
      </nav>

      {/* User Profile - Bottom */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.nombre.charAt(0)}{user?.apellido.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.nombre}</p>
              <p className="text-[10px] text-teal-400 truncate">{user?.rol}</p>
            </div>
          </div>
          
          <button 
            onClick={logout} 
            title="Cerrar Sesión"
            className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-400/10 rounded-lg"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}