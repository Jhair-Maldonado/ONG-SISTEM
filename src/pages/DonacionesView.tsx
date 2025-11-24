import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DONACIONES_MOCK, PROYECTOS_MOCK } from '../data/mockData';
import type { Donacion, Proyecto, TipoDonacion } from '../interfaces/types';
import DonationStats from '../components/donaciones/DonationStats';
import { Plus, Gift } from 'lucide-react';

export default function DonacionesView() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario
  const initialForm = {
    donante_nombre: '',
    monto: 0,
    descripcion: '',
    tipo_donacion: 'MONETARIA' as TipoDonacion,
    id_proyecto: '' // String temporal para el select
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Cargamos ambas listas en paralelo para ganar velocidad
      const [donacionesData, proyectosData] = await Promise.all([
        api.getAll<Donacion>('donaciones', DONACIONES_MOCK),
        api.getAll<Proyecto>('proyectos', PROYECTOS_MOCK)
      ]);
      setDonaciones(donacionesData);
      setProyectos(proyectosData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDonacion: Donacion = {
      ...form,
      id_donacion: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      // Convertimos el string del select a number, o undefined si está vacío
      id_proyecto: form.id_proyecto ? Number(form.id_proyecto) : undefined
    };

  await api.create<Donacion>('donaciones', newDonacion);
    setDonaciones([...donaciones, newDonacion]); // Actualización optimista
    setForm(initialForm);
    alert('Donación registrada con éxito');
  };

  // Cálculos para las tarjetas
  const totalMonetario = donaciones
    .filter(d => d.tipo_donacion === 'MONETARIA')
    .reduce((acc, curr) => acc + curr.monto, 0);
    
  const totalEspecie = donaciones
    .filter(d => d.tipo_donacion === 'EN_ESPECIE')
    .length;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Gestión de Donaciones</h2>

      {/* Componente de Estadísticas */}
      <DonationStats totalMonetario={totalMonetario} totalEspecie={totalEspecie} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Registro */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Plus size={20} className="text-blue-600"/> Registrar Aporte
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Donante</label>
                <input required className="input-base" placeholder="Nombre o Empresa" 
                  value={form.donante_nombre} 
                  onChange={e => setForm({...form, donante_nombre: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select className="input-base" 
                    value={form.tipo_donacion}
                    onChange={e => setForm({...form, tipo_donacion: e.target.value as TipoDonacion})}>
                    <option value="MONETARIA">Dinero</option>
                    <option value="EN_ESPECIE">Especie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {form.tipo_donacion === 'MONETARIA' ? 'Monto (S/)' : 'Valor Est. (S/)'}
                  </label>
                  <input type="number" className="input-base" min="0"
                    value={form.monto}
                    onChange={e => setForm({...form, monto: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <input required className="input-base" placeholder="Ej: Transferencia BCP / 50kg Arroz" 
                  value={form.descripcion}
                  onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asignar a Proyecto (Opcional)</label>
                <select className="input-base" 
                  value={form.id_proyecto}
                  onChange={e => setForm({...form, id_proyecto: e.target.value})}>
                  <option value="">-- Fondos Generales --</option>
                  {proyectos.map(p => (
                    <option key={p.id_proyecto} value={p.id_proyecto}>
                      {p.titulo} ({p.estado})
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition font-medium">
                Registrar Donación
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Últimas Donaciones */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-700">Historial de Ingresos</h3>
            </div>
            {loading ? (
              <div className="p-10 text-center text-slate-400">Cargando registros...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Donante</th>
                    <th className="px-6 py-3">Detalle</th>
                    <th className="px-6 py-3 text-right">Monto/Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donaciones.length === 0 ? (
                     <tr><td colSpan={4} className="p-6 text-center text-slate-400">No hay donaciones registradas</td></tr>
                  ) : (
                    donaciones.map(d => (
                      <tr key={d.id_donacion} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-500">{d.fecha}</td>
                        <td className="px-6 py-3 font-medium text-slate-800">{d.donante_nombre}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {d.tipo_donacion === 'EN_ESPECIE' && <Gift size={14} className="text-orange-500"/>}
                            <span className="text-slate-600">{d.descripcion}</span>
                          </div>
                          {d.id_proyecto && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                              Proyecto #{d.id_proyecto}
                            </span>
                          )}
                        </td>
                        <td className={`px-6 py-3 text-right font-bold ${d.tipo_donacion === 'MONETARIA' ? 'text-green-600' : 'text-orange-600'}`}>
                          {d.tipo_donacion === 'MONETARIA' ? 'S/ ' : 'Val: S/ '}
                          {d.monto.toLocaleString('es-PE')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}