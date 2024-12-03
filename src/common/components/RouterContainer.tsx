import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Authentication } from "../../modules/Authentication";
import { Wallet } from "../../modules/wallet";
import { PrivateRoute } from "../../pages/PrivateRoute";
import { APP_ROUTES } from "../../constants";
import { usePersistedQuery } from "../hooks/usePersistedQuery";
const RouterContainer: FC = () => {
  const persistNavigate = usePersistedQuery();

  return (
    <Routes>
      <Route path="/"
        element={<Navigate to={persistNavigate(APP_ROUTES.WALLET)} state={{ from: location }} />}
      />
      <Route
        path={APP_ROUTES.WALLET}
        element={
          <PrivateRoute>
            <Wallet />
          </PrivateRoute>
        }
      />
      <Route path={APP_ROUTES.AUTH} element={<Authentication />} />
    </Routes>
  );
};

export { RouterContainer };
