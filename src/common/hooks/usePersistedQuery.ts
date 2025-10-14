export const usePersistedQuery = () => {
  const params = new URLSearchParams(location.search);

  const persistQuery = (path: string, state?: string) => {
    const app = params.get("app");
    const version = params.get("version");
    const queryParams: string[] = [];

    if (app) queryParams.push(`app=${app}`);
    if (version) queryParams.push(`version=${version}`);
    if (state) queryParams.push(`state=${state}`);

    return `${path}${queryParams.length ? `?${queryParams.join("&")}` : ""}`;
  };

  return persistQuery;
};
