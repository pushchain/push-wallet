import { FC } from "react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import {Authentication} from "../../modules/Authentication";

const RouterConatiner: FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
    </Routes>
  );
};

export { RouterConatiner };
