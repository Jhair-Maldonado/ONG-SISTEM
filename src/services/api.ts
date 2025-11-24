// Simula latencia de red
const DELAY = 500;

// Función auxiliar para manejar LocalStorage
const getFromStorage = <T>(key: string, defaultData: T[]): T[] => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  return defaultData;
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  // Ahora pide una 'key' (nombre de la tabla) para saber dónde buscar
  getAll: <T>(key: string, mockData: T[]): Promise<T[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getFromStorage(key, mockData);
        resolve(data);
      }, DELAY);
    });
  },

  create: <T>(key: string, newItem: T): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1. Leemos lo que ya existe
        const currentData = getFromStorage<T>(key, []);
        // 2. Agregamos lo nuevo
        const updatedData = [...currentData, newItem];
        // 3. Guardamos en el "Disco Duro" (LocalStorage)
        saveToStorage(key, updatedData);
        resolve(newItem);
      }, DELAY);
    });
  }
};