export const usePersistedQuery = () => {
  const params = new URLSearchParams(location.search);

  const persistQuery = (path: string, state?: string) => {
    const app = params.get("app");
    if (state) {
      return `${path}${app ? `?app=${app}&state=${state}` : `?state=${state}`}`;
    } else {
      return `${path}${app ? `?app=${app}` : ""}`;
    }
  };

  return persistQuery;
};
