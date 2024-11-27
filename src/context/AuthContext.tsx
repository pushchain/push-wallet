import React, { createContext, ReactNode, useEffect, useState } from "react";
import { extractStateFromUrl, fetchJwtUsingState } from "../helpers/AuthHelper";
import { useGlobalState } from "./GlobalContext";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

type AuthContextType = {
  loadingUser: "idle" | "success" | "loading" | "rejected";
  sessionToken: string | null;
  setLoadingUser: (loadingUser: "idle" | "success" | "loading" | "rejected") => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { primaryWallet } = useDynamicContext();
  const [loadingUser, setLoadingUser] = useState<
    "idle" | "success" | "loading" | "rejected"
  >("idle");

  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const { dispatch } = useGlobalState();

  const stateParam = extractStateFromUrl();

  const storedToken = sessionStorage.getItem("jwt");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser("loading");

        if (stateParam) {
          const fetchJwt = await fetchJwtUsingState({
            stateParam,
            dispatch,
          });

          setSessionToken(fetchJwt);

          const url = new URL(window.location.href);
          url.searchParams.delete("state");
          window.history.replaceState({}, document.title, url.pathname);
          setLoadingUser("success");
        } else if (storedToken) {
          dispatch({ type: "SET_JWT", payload: storedToken });
          setSessionToken(storedToken);
          setLoadingUser("success");
        } else if (primaryWallet) {
          setLoadingUser("success");
        } else {
          setLoadingUser("rejected");
        }
      } catch (error) {
        setLoadingUser("rejected");
        console.error("Error creating wallet:", error);
        throw error;
      }
    };

    fetchUser();
  }, [stateParam, storedToken, primaryWallet]);

  return (
    <AuthContext.Provider value={{ loadingUser, sessionToken, setLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
