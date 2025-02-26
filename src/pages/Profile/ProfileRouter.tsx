import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "@/component/Loading";
import AuthMiddleware from "@/middleware/AuthMiddleware";

const Profile = lazy(() => import("./Profile"));
const ProfileRoute: RouteObject = {
  path: "/profile",
  element: (
    <Suspense fallback={<Loading />}>
      <AuthMiddleware>
        <Profile />
      </AuthMiddleware>
    </Suspense>
  ),
};

export default ProfileRoute;
