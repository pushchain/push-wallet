import React from "react";
import { useWalletEvents } from "../hooks";

const WalletConnections = () => {
  const { handleUserLoggedIn } = useWalletEvents();
  return null;
};

export { WalletConnections };
