export type RolUsuario = 'ADMIN' | 'COORD' | 'VOLUNTARIO' | 'DONANTE';
export type TipoVoluntario = 'REGULAR' | 'EVENTUAL';
export type EstadoProyecto = 'PLAN' | 'EJECUCION' | 'FINALIZADO';
export type TipoDonacion = 'MONETARIA' | 'EN_ESPECIE';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolUsuario;
}

export interface Voluntario extends Usuario {
  id_voluntario: number;
  telefono: string;
  disponibilidad: string;
  habilidades: string;
  tipo_voluntario: TipoVoluntario;
  fecha_registro: string;
}

export interface Proyecto {
  id_proyecto: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoProyecto;
  presupuesto: number;
  progreso: number;
}

export interface Donacion {
  id_donacion: number;
  monto: number;
  descripcion: string;
  tipo_donacion: TipoDonacion;
  fecha: string;
  donante_nombre: string;
  id_proyecto?: number;
}