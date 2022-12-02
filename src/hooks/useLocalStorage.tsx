export const useLocalStorage = () => {
  const get = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  const set = (key: string, value: string) => {
    return localStorage.setItem(key, value);
  };

  const remove = (key: string) => {
    return localStorage.removeItem(key);
  };

  return {
    get,
    set,
    remove,
  };
};
