import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../services/api';
import { PROYECTOS_MOCK, DONACIONES_MOCK } from '../data/mockData';
import type { Proyecto, Donacion } from '../interfaces/types';
import { calcularEstado } from '../utils/projectUtils';
import ProjectCard from './ProjectCard';
import { Plus, X, Calendar, DollarSign, Type } from 'lucide-react';

export default function ProyectosView() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    presupuesto: ''
  });

  const loadProyectos = async () => {
    setLoading(true);
    try {
      const [proyectosData, donacionesData] = await Promise.all([
        api.getAll<Proyecto>('proyectos', PROYECTOS_MOCK),
        api.getAll<Donacion>('donaciones', DONACIONES_MOCK)
      ]);
      const processedData = proyectosData.map(p => {
        const estadoCalculado = calcularEstado(p.fecha_inicio, p.fecha_fin);
        const totalRecaudado = donacionesData
          .filter(d => d.id_proyecto === p.id_proyecto && d.tipo_donacion === 'MONETARIA')
          .reduce((acc, d) => acc + Number(d.monto), 0);
        let porcentajeAvance = 0;
        if (p.presupuesto > 0) {
          porcentajeAvance = Math.round((totalRecaudado / p.presupuesto) * 100);
        }
        return {
          ...p,
          estado: estadoCalculado,
          progreso: Math.min(porcentajeAvance, 100)
        };
      });

      setProyectos(processedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProyectos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const presupuestoNum = parseFloat(newProject.presupuesto);
    if (isNaN(presupuestoNum)) return alert("El presupuesto debe ser un número válido");

    const proyectoGuardar: Proyecto = {
      id_proyecto: Date.now(),
      titulo: newProject.titulo,
      descripcion: newProject.descripcion,
      fecha_inicio: newProject.fecha_inicio,
      fecha_fin: newProject.fecha_fin,
      presupuesto: presupuestoNum,
      progreso: 0,
      estado: calcularEstado(newProject.fecha_inicio, newProject.fecha_fin)
    };

    await api.create('proyectos', proyectoGuardar);
    loadProyectos(); 
    closeModal();
    alert("Proyecto creado exitosamente");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProject({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', presupuesto: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Cartera de Proyectos</h2>
          <p className="text-sm text-slate-500">Gestión del ciclo de vida y presupuestos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={18} /> Nuevo Proyecto
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center flex flex-col items-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p>Calculando financiamiento...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proj) => (
            <ProjectCard key={proj.id_proyecto} proyecto={proj} />
          ))}
        </div>
      )}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fadeIn transform transition-all scale-100">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Nuevo Proyecto Social</h3>
              <button type="button" onClick={closeModal} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título del Proyecto</label>
                <div className="relative">
                  <Type size={18} className="absolute left-3 top-3 text-slate-400"/>
                  <input required value={newProject.titulo} onChange={e => setNewProject({...newProject, titulo: e.target.value})} placeholder="Ej: Campaña de Salud 2025" className="input-base" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descripción</label>
                <textarea required rows={3} value={newProject.descripcion} onChange={e => setNewProject({...newProject, descripcion: e.target.value})} placeholder="Objetivos y alcance..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Inicio</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3 text-slate-400"/>
                    <input type="date" required value={newProject.fecha_inicio} onChange={e => setNewProject({...newProject, fecha_inicio: e.target.value})} className="input-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fin</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3 text-slate-400"/>
                    <input type="date" required value={newProject.fecha_fin} onChange={e => setNewProject({...newProject, fecha_fin: e.target.value})} className="input-base" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Presupuesto (S/)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-3 text-slate-400"/>
                  <input type="number" required min="0" step="0.01" value={newProject.presupuesto} onChange={e => setNewProject({...newProject, presupuesto: e.target.value})} placeholder="0.00" className="input-base" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"><Plus size={18} /> Crear Proyecto</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
