import { useParams } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
function Homepage() {
  const { component } = useParams();
  if (!component) throw new Error("No component provided");
  if (component !== "login" && component !== "register")
    throw new Error("Invalid component provided");
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
            {component === "login" ? (
              <Login />
            ) : component === "register" ? (
              <Register />
            ) : null}
        </div>
      </div>
    </>
  );
}

export default Homepage;
