import { Routes, Route } from "react-router-dom";

import { routes } from "@/shared/config";

import { Home } from "./home/Home";
import { Programs } from "./programs/Programs";
import { Codes } from "./codes/Codes";
import { Program } from "./program/Program";
import { Code } from "./code/Code";

const Routing = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.programs} element={<Programs />} />
      <Route path={routes.program} element={<Program />} />
      <Route path={routes.codes} element={<Codes />} />
      <Route path={routes.code} element={<Code />} />

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export { Routing };
