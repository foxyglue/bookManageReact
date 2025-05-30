import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Loading from "@/component/Loading";
// import AuthMiddleware from "@/middleware/AuthMiddleware";

const BookManagement = lazy(() => import("./BookManagement"));
const BookManagementRoute: RouteObject = {
  path: "/books",
  element: (
    <Suspense fallback={<Loading />}>
      {/* <AuthMiddleware> */}
        <BookManagement />
      {/* </AuthMiddleware> */}
    </Suspense>
  ),
};

export default BookManagementRoute;
