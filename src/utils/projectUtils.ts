import type { EstadoProyecto } from '../interfaces/types';
export const calcularEstado = (inicio: string, fin: string): EstadoProyecto => {
  const hoy = new Date();
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);
  hoy.setHours(0, 0, 0, 0);
  fechaInicio.setHours(0, 0, 0, 0);
  fechaFin.setHours(0, 0, 0, 0);

  if (hoy < fechaInicio) return 'PLAN';
  if (hoy >= fechaInicio && hoy <= fechaFin) return 'EJECUCION';
  return 'FINALIZADO';
};

export const getColorEstado = (estado: EstadoProyecto): string => {
  switch (estado) {
    case 'PLAN': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'EJECUCION': return 'bg-green-100 text-green-700 border-green-200';
    case 'FINALIZADO': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-slate-100';
  }
};

export const formatearFecha = (fecha: string) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
