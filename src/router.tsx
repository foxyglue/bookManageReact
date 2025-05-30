import { createBrowserRouter } from "react-router-dom";
import HomepageRoute from "./pages/Homepage/HomepageRouter";
// import AuthRoute from "./pages/Auth/AuthRouter";
import ProfileRoute from "./pages/Profile/ProfileRouter";
import BookManagementRoute from './pages/Books/BookManagementRouter';

const router = createBrowserRouter([HomepageRoute, ProfileRoute, BookManagementRoute]);

export default router;
