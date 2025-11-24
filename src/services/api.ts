const DELAY = 500;
const getFromStorage = <T>(key: string, defaultData: T[]): T[] => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  return defaultData;
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
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
        const currentData = getFromStorage<T>(key, []);
        const updatedData = [...currentData, newItem];
        saveToStorage(key, updatedData);
        resolve(newItem);
      }, DELAY);
    });
  }
};
