import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { VOLUNTARIOS_MOCK, PROYECTOS_MOCK, DONACIONES_MOCK } from '../data/mockData';
import { Users, FolderHeart, Wallet, Activity, ArrowUpRight, Calendar } from 'lucide-react';
import type { Donacion, Proyecto, Voluntario } from '../interfaces/types';

type Actividad = {
  id: string;
  tipo: 'VOL' | 'DON' | 'PROY';
  mensaje: string;
  fecha: string;
  color: string;
  monto?: number;
};

export default function DashboardView() {
  const [stats, setStats] = useState({
    totalVoluntarios: 0,
    totalProyectos: 0,
    proyectosActivos: 0,
    recaudacionTotal: 0
  });
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true);
      const [voluntarios, proyectos, donaciones] = await Promise.all([
        api.getAll<Voluntario>('voluntarios', VOLUNTARIOS_MOCK),
        api.getAll<Proyecto>('proyectos', PROYECTOS_MOCK),
        api.getAll<Donacion>('donaciones', DONACIONES_MOCK)
      ]);
      const recaudado = donaciones
        .filter(d => d.tipo_donacion === 'MONETARIA')
        .reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

      setStats({
        totalVoluntarios: voluntarios.length,
        totalProyectos: proyectos.length,
        proyectosActivos: proyectos.filter(p => p.estado === 'EJECUCION').length,
        recaudacionTotal: recaudado
      });
      const actsVol: Actividad[] = voluntarios.map(v => ({
        id: `v-${v.id_voluntario}`,
        tipo: 'VOL',
        mensaje: `${v.nombre} ${v.apellido}`,
        fecha: v.fecha_registro,
        color: 'from-blue-500 to-cyan-400'
      }));

      const actsDon: Actividad[] = donaciones.map(d => ({
        id: `d-${d.id_donacion}`,
        tipo: 'DON',
        mensaje: `${d.donante_nombre}`,
        monto: d.monto,
        fecha: d.fecha,
        color: 'from-emerald-500 to-teal-400'
      }));

      const actsPro: Actividad[] = proyectos.map(p => ({
        id: `p-${p.id_proyecto}`,
        tipo: 'PROY',
        mensaje: `${p.titulo}`,
        fecha: p.fecha_inicio,
        color: 'from-violet-500 to-purple-400'
      }));

      const feed = [...actsVol, ...actsDon, ...actsPro]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);

      setActividades(feed);
      setLoading(false);
    };

    cargarDashboard();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Calculando indicadores...</div>;

  return (
    <div className="space-y-8 font-sans">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +5% <ArrowUpRight size={12} className="ml-1"/>
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Voluntarios Activos</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalVoluntarios}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-50 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <FolderHeart size={24} />
            </div>
            <span className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              Activos: {stats.proyectosActivos}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Cartera de Proyectos</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalProyectos}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/10 text-emerald-300 rounded-xl backdrop-blur-sm">
              <Wallet size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-300">Recaudación Total</p>
            <h3 className="text-3xl font-bold text-white mt-1">S/ {stats.recaudacionTotal.toLocaleString('es-PE')}</h3>
            <div className="w-full bg-slate-700/50 h-1 mt-4 rounded-full overflow-hidden">
               <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${Math.min((stats.recaudacionTotal / 50000) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">Meta anual: S/ 50,000</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Activity size={24} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Impacto Social</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">Alto</h3>
            <p className="text-xs text-slate-400 mt-1">Calculado por IA</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h3 className="text-xl font-bold text-slate-800">Balance Financiero</h3>
                <p className="text-sm text-slate-500">Ingresos vs Egresos (Últimos 6 meses)</p>
             </div>
             <button className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-1 rounded-lg transition-colors">Ver Reporte</button>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4">
             {[45, 70, 50, 90, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-t-2xl relative h-full overflow-hidden">
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-teal-500 to-emerald-400 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-2xl" 
                          style={{height: `${h}%`}}
                        ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-teal-600 transition-colors">Mes {i+1}</span>
                </div>
             ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Actividad Reciente</h3>
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
            {actividades.map((act) => (
              <div key={act.id} className="relative pl-8 group">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gradient-to-br ${act.color}`}></div>
                
                <div className="flex flex-col">
                   <span className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Calendar size={10}/> {new Date(act.fecha).toLocaleDateString()}
                   </span>
                   <p className="text-sm font-medium text-slate-700 group-hover:text-teal-600 transition-colors">
                      {act.tipo === 'DON' ? `Donación recibida` : act.tipo === 'PROY' ? 'Proyecto iniciado' : 'Nuevo Voluntario'}
                   </p>
                   <p className="text-sm text-slate-500">
                      {act.mensaje} {act.monto && <span className="font-bold text-slate-700"> - S/ {act.monto}</span>}
                   </p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            Ver todo el historial
          </button>
        </div>

      </div>
    </div>
  );
}
