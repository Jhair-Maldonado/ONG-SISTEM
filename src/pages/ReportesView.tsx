import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PROYECTOS_MOCK, DONACIONES_MOCK } from '../data/mockData';
import type { Proyecto, Donacion } from '../interfaces/types';
import { Download, FileText, TrendingUp, Filter, Calendar } from 'lucide-react';

export default function ReportesView() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ mes: string; monto: number; altura: number }[]>([]);

  // 1. PRIMERO: Definimos la función auxiliar (Lógica de Negocio)
  // Al estar definida aquí arriba, el useEffect ya la puede "ver" y usar.
  const procesarGrafico = (data: Donacion[]) => {
    const agrupado = data
      .filter(d => d.tipo_donacion === 'MONETARIA')
      .reduce((acc, curr) => {
        const fecha = new Date(curr.fecha);
        // Usamos 'short' para obtener "ene", "feb", etc.
        const mesKey = fecha.toLocaleString('es-PE', { month: 'short' }); 
        acc[mesKey] = (acc[mesKey] || 0) + Number(curr.monto);
        return acc;
      }, {} as Record<string, number>);

    const mesesOrden = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    
    const valores = Object.values(agrupado);
    const maxVal = Math.max(...valores, 1); // Evitamos dividir por 0

    const resultado = Object.keys(agrupado)
      .sort((a, b) => mesesOrden.indexOf(a) - mesesOrden.indexOf(b))
      .map(mes => ({
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        monto: agrupado[mes],
        altura: Math.round((agrupado[mes] / maxVal) * 100)
      }));

    setChartData(resultado);
  };

  // 2. SEGUNDO: El Efecto que carga los datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [donacionesData, proyectosData] = await Promise.all([
        api.getAll<Donacion>('donaciones', DONACIONES_MOCK),
        api.getAll<Proyecto>('proyectos', PROYECTOS_MOCK)
      ]);

      setDonaciones(donacionesData);
      setProyectos(proyectosData);
      
      // Ahora sí podemos llamar a la función porque ya fue declarada arriba
      procesarGrafico(donacionesData);
      
      setLoading(false);
    };

    loadData();
  }, []); // Array vacío para ejecutar solo al inicio

  const handleExport = () => {
    alert("Generando PDF de Transparencia... (Simulación)");
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Generando reportes financieros...</div>;

  const totalRecaudado = donaciones
    .filter(d => d.tipo_donacion === 'MONETARIA')
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reportes de Transparencia</h2>
          <p className="text-slate-500 text-sm">Auditoría financiera y estado de recursos.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10 font-medium"
        >
          <Download size={18} /> Descargar Informe PDF
        </button>
      </div>

      {/* Tarjeta Principal: Gráfico Financiero */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500"/> Flujo de Ingresos (2025)
              </h3>
              <p className="text-sm text-slate-400">Total Recaudado: <span className="text-slate-700 font-bold">S/ {totalRecaudado.toLocaleString('es-PE')}</span></p>
           </div>
           
           <button className="text-sm text-slate-500 hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 transition-colors">
              <Calendar size={14} /> Este Año
           </button>
        </div>
        
        {/* Gráfico Dinámico */}
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No hay datos financieros registrados aún.
          </div>
        ) : (
          <div className="h-64 flex items-end justify-around gap-2 px-4 border-b border-slate-100 pb-2">
             {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full max-w-[60px]">
                    <div className="relative w-full h-full flex items-end group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                           S/ {d.monto.toLocaleString()}
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg opacity-90 group-hover:opacity-100 transition-all duration-700" 
                          style={{ height: `${d.altura * 2}px`, minHeight: '4px' }} 
                        ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">{d.mes}</span>
                </div>
             ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Desglose por Proyecto */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Asignación de Recursos</h3>
            <Filter size={16} className="text-slate-400 cursor-pointer hover:text-blue-600"/>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Proyecto</th>
                <th className="px-6 py-3 text-right">Presupuesto</th>
                <th className="px-6 py-3 text-right">Recaudado</th>
                <th className="px-6 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proyectos.map(p => {
                const recaudadoProj = donaciones
                  .filter(d => d.id_proyecto === p.id_proyecto && d.tipo_donacion === 'MONETARIA')
                  .reduce((acc, curr) => acc + Number(curr.monto), 0);
                
                const porcentaje = p.presupuesto > 0 ? Math.round((recaudadoProj / p.presupuesto) * 100) : 0;

                return (
                  <tr key={p.id_proyecto} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{p.titulo}</td>
                    <td className="px-6 py-4 text-right text-slate-500">S/ {p.presupuesto.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-emerald-600">S/ {recaudadoProj.toLocaleString()}</span>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                          p.estado === 'EJECUCION' ? 'bg-green-50 text-green-600 border-green-100' : 
                          p.estado === 'PLAN' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                       }`}>
                         {p.estado}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen Rápido / Documentos */}
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <FileText size={24} className="text-blue-300"/>
            </div>
            <h3 className="text-xl font-bold mb-2">Auditoría 2025</h3>
            <p className="text-slate-300 text-sm mb-6">Genera reportes oficiales para SUNAT y donantes internacionales.</p>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors border border-white/5">
                <div className="w-8 h-8 rounded bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">PDF</div>
                <div className="flex-1">
                   <p className="text-sm font-medium">Reporte Anual</p>
                   <p className="text-[10px] text-slate-400">1.2 MB • Hace 2 días</p>
                </div>
                <Download size={16} className="text-slate-400"/>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}