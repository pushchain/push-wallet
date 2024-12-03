import { useSearchParams } from "react-router-dom";

export const usePersistedQuery = () => {
  const [searchParams] = useSearchParams();

  const persistQuery = (path: string) => {
    const app = searchParams.get("app");
    return `${path}${app ? `?app=${app}` : ""}`;
  };

  return persistQuery;
};
