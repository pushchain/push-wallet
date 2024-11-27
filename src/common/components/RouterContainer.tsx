import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Authentication } from "../../modules/Authentication";
import { Wallet } from "../../modules/wallet";
import { PrivateRoute } from "../../pages/PrivateRoute";
import { PublicRoute } from "../../pages/PublicRoute";
import { APP_ROUTES } from "../../constants";
const RouterContainer: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={APP_ROUTES.WALLET} />} />
      <Route
        path={APP_ROUTES.WALLET}
        element={
          <PrivateRoute>
            <Wallet />
          </PrivateRoute>
        }
      />
      <Route
        path={APP_ROUTES.AUTH}
        element={
          <PublicRoute>
            <Authentication />
          </PublicRoute>
        } />
    </Routes>
  );
};

export { RouterContainer };
