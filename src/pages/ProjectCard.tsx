import type { Proyecto } from '../interfaces/types';
import { Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { getColorEstado, formatearFecha } from '../utils/projectUtils';

interface Props {
  proyecto: Proyecto;
}

export default function ProjectCard({ proyecto }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded text-xs font-bold border ${getColorEstado(proyecto.estado)}`}>
          {proyecto.estado}
        </span>
        <span className="text-xs text-slate-400 font-mono">ID: {proyecto.id_proyecto}</span>
      </div>
      
      <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{proyecto.titulo}</h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{proyecto.descripcion}</p>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center text-sm text-slate-600">
          <Calendar size={16} className="mr-2 text-slate-400" />
          <span>{formatearFecha(proyecto.fecha_inicio)} - {formatearFecha(proyecto.fecha_fin)}</span>
        </div>
        
        <div className="flex items-center text-sm text-slate-600">
          <DollarSign size={16} className="mr-2 text-slate-400" />
          <span>S/ {proyecto.presupuesto.toLocaleString('es-PE')}</span>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1"><BarChart3 size={12}/> Avance</span>
            <span className="font-semibold">{proyecto.progreso}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${proyecto.progreso}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
