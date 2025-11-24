import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { VOLUNTARIOS_MOCK } from '../data/mockData';
import type { Voluntario, TipoVoluntario } from '../interfaces/types';
import { Plus, Search } from 'lucide-react';

export default function VoluntariosView() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);

  const initialFormState = {
    nombre: '', apellido: '', correo: '', telefono: '',
    disponibilidad: '', habilidades: '', tipo_voluntario: 'REGULAR' as TipoVoluntario
  };
  const [formData, setFormData] = useState(initialFormState);

  const loadVoluntarios = async () => {
    const data = await api.getAll<Voluntario>('voluntarios', VOLUNTARIOS_MOCK);
    setVoluntarios(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await api.getAll<Voluntario>('voluntarios', VOLUNTARIOS_MOCK);
      if (!mounted) return;
      setVoluntarios(data);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVol: Voluntario = {
      ...formData,
      id_voluntario: Date.now(),
      id_usuario: Date.now() + 1,
      rol: 'VOLUNTARIO',
      fecha_registro: new Date().toISOString().split('T')[0]
    };
    
  await api.create<Voluntario>('voluntarios', newVol);
    alert('Voluntario registrado correctamente');
    loadVoluntarios();
    setFormData(initialFormState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600"/> Nuevo Registro
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required className="input-base" />
          <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required className="input-base" />
          <input name="correo" type="email" placeholder="Correo" value={formData.correo} onChange={handleChange} required className="input-base" />
          <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="input-base" />
          <input name="habilidades" placeholder="Habilidades" value={formData.habilidades} onChange={handleChange} className="input-base" />
          <select name="tipo_voluntario" value={formData.tipo_voluntario} onChange={handleChange} className="input-base">
            <option value="REGULAR">Regular</option>
            <option value="EVENTUAL">Eventual</option>
          </select>
          <div className="md:col-span-2 lg:col-span-3">
             <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium w-full md:w-auto">
               Guardar Voluntario
             </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Listado de Personal</h3>
          <div className="relative">
             <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
             <input placeholder="Buscar..." className="pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando datos...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Voluntario</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Habilidades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {voluntarios.map((vol) => (
                <tr key={vol.id_voluntario} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-800">{vol.nombre} {vol.apellido}</td>
                  <td className="px-6 py-3 text-slate-600">{vol.correo}<br/><span className="text-xs text-slate-400">{vol.telefono}</span></td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      vol.tipo_voluntario === 'REGULAR' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {vol.tipo_voluntario}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{vol.habilidades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
