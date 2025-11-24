import type { Voluntario, Proyecto, Donacion } from "../interfaces/types";

export const VOLUNTARIOS_MOCK: Voluntario[] = [
  {
    id_usuario: 101,
    id_voluntario: 1,
    nombre: "Jhair",
    apellido: "Maldonado",
    correo: "jhair@utp.edu.pe",
    rol: "VOLUNTARIO",
    telefono: "999888777",
    disponibilidad: "Fines de semana",
    habilidades: "Java, React",
    tipo_voluntario: "REGULAR",
    fecha_registro: "2024-03-01"
  },
  {
    id_usuario: 102,
    id_voluntario: 2,
    nombre: "Ana",
    apellido: "Torres",
    correo: "ana@gmail.com",
    rol: "VOLUNTARIO",
    telefono: "987654321",
    disponibilidad: "Mañanas",
    habilidades: "Logística",
    tipo_voluntario: "EVENTUAL",
    fecha_registro: "2024-04-10"
  }
];

// src/data/mockData.ts

// ... (Mantén tus imports y la lista de voluntarios igual) ...

export const PROYECTOS_MOCK: Proyecto[] = [
  {
    id_proyecto: 1,
    titulo: "Campaña Invierno Sin Frío",
    descripcion: "Recolección de abrigos para zonas altoandinas.",
    fecha_inicio: "2024-01-01",
    fecha_fin: "2024-03-30",
    estado: "FINALIZADO", // El sistema lo calculará como Finalizado (pasado)
    presupuesto: 5000,
    progreso: 100
  },
  {
    id_proyecto: 2,
    titulo: "Comedor Popular San Juan",
    descripcion: "Construcción y abastecimiento de comedor diario.",
    fecha_inicio: "2024-06-01", 
    fecha_fin: "2025-12-31", // Fecha presente/futura cercana
    estado: "EJECUCION", // El sistema lo calculará como Ejecución (presente)
    presupuesto: 15000,
    progreso: 45
  },
  {
    id_proyecto: 3,
    titulo: "Talleres Digitales 2026",
    descripcion: "Capacitación en computación básica para adultos mayores.",
    fecha_inicio: "2026-01-01", // Fecha futura
    fecha_fin: "2026-06-30",
    estado: "PLAN", // El sistema lo calculará como Planificación (futuro)
    presupuesto: 8000,
    progreso: 0
  }
];

// ... (Mantén donaciones igual) ...

export const DONACIONES_MOCK: Donacion[] = [];