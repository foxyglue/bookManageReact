import { createBrowserRouter } from "react-router-dom";
import HomepageRoute from "./pages/Homepage/HomepageRouter";
import AuthRoute from "./pages/Auth/AuthRouter";
import ProfileRoute from "./pages/Profile/ProfileRouter";

const router = createBrowserRouter([AuthRoute, HomepageRoute, ProfileRoute]);

export default router;
