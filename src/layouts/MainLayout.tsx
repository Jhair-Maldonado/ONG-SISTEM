import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Panel de Control';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    // CAMBIO: Quitamos cualquier clase bg-... aquí para dejar que index.css controle el fondo global (#EEF2F6)
    <div className="flex min-h-screen"> 
      <Sidebar />
      
      <div className="flex-1 ml-72 flex flex-col relative">
        
        {/* Header: Ahora es blanco puro (bg-white) para contrastar con el fondo gris de la app */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Domingo, 23 Noviembre 2025</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Barra de búsqueda con fondo grisáceo interno para contraste */}
            <div className="hidden md:flex items-center bg-slate-100/80 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all w-64">
               <Search size={18} className="text-slate-400" />
               <input placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-600 placeholder:text-slate-400"/>
            </div>

            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}