import React, { ReactNode, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Spinner } from 'blocks';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from "../constants";

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { loadingUser } = useContext(AuthContext);

    if (loadingUser === "loading" || loadingUser === "idle")
        return <Spinner variant="primary" size="large" />;
    else if (loadingUser === "rejected") return <>{children}</>;
    else return <Navigate to={APP_ROUTES.WALLET} />
};

export { PublicRoute };