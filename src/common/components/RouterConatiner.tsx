import { FC } from "react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Authentication } from "../../modules/Authentication";
import { Wallet } from "../../modules/wallet";
import { Profile } from '../../pages/Profile';
const RouterConatiner: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Wallet />} />
      <Route path="/protected-wallet" element={<Wallet />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export { RouterConatiner };
