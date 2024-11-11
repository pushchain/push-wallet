import { FC, ReactNode } from "react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import {Landing} from "../../modules/Landing";

const RouterConatiner: FC = () => {
  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
    </Routes>
  );
};

export { RouterConatiner };
