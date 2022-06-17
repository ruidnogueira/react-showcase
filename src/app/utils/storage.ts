export const getFromLocalStorage = <T>(key: string) => getFromStorage<T>(localStorage, key);
export const saveToLocalStorage = <T>(key: string, item: T) =>
  saveToStorage<T>(localStorage, key, item);

export const getFromSessionStorage = <T>(key: string) => getFromStorage<T>(sessionStorage, key);
export const saveToSessionStorage = <T>(key: string, item: T) =>
  saveToStorage<T>(sessionStorage, key, item);

const getFromStorage = <T>(storage: Storage, key: string): T | null => {
  try {
    const serializedItem = storage.getItem(key);

    if (serializedItem === null) {
      return null;
    }

    return JSON.parse(serializedItem) as T;
  } catch {
    return null;
  }
};

const saveToStorage = <T>(storage: Storage, key: string, item: T) => {
  try {
    const serializedItem = JSON.stringify(item);
    storage.setItem(key, serializedItem);
  } catch {
    // Do nothing if we can't write to local storage
  }
};
