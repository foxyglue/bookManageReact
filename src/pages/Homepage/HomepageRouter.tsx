import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "@/component/Loading";
import AuthMiddleware from "@/middleware/AuthMiddleware";

const Homepage = lazy(() => import("./Homepage"));
const HomepageRoute: RouteObject = {
  path: "/",
  element: (
    <Suspense fallback={<Loading />}>
      <AuthMiddleware>
        <Homepage />
      </AuthMiddleware>
    </Suspense>
  ),
};

export default HomepageRoute;
