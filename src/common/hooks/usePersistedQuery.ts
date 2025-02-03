export const usePersistedQuery = () => {
  const params = new URLSearchParams(location.search);

  const persistQuery = (path: string) => {
    const app = params.get("app");
    return `${path}${app ? `?app=${app}` : ""}`;
  };

  return persistQuery;
};
