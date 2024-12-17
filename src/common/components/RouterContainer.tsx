import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Authentication } from "../../modules/Authentication";
import { Wallet } from "../../modules/wallet";
import { PrivateRoute } from "../../pages/PrivateRoute";
import { APP_ROUTES } from "../../constants";
import { usePersistedQuery } from "../hooks/usePersistedQuery";
import { OAuthRedirect } from "../../modules/OAuth/OAuthRedirect";
const RouterContainer: FC = () => {
  const persistQuery = usePersistedQuery();

  return (
    <Routes>
      <Route path="/"
        element={<Navigate to={persistQuery(APP_ROUTES.WALLET)} />}
      />
      <Route path={APP_ROUTES.OAUTH_REDIRECT}
        element={<OAuthRedirect />}
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
