import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "@/component/Loading";

const Auth = lazy(() => import("./Auth"));
const AuthRoute: RouteObject = {
  path: "/auth/:component",
  element: (
    <Suspense fallback={<Loading />}>
      <Auth />
    </Suspense>
  ),
};

export default AuthRoute;
