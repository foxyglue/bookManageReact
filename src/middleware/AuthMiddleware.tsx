import Loading from "@/component/Loading";
import { useFetchData } from "@/helper/FetchDataHelper";
import StorageHelper from "@/helper/StorageHelper";
import { useUser } from "@/hooks/useUser";
import { UserModel } from "@/model/user.model";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export default function AuthMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { fetchData: fetchUser, ...userData } =
    useFetchData<z.infer<typeof UserModel>>();
  const stateUser = useUser();
  const navigate = useNavigate();
  const storageHelper = new StorageHelper(localStorage);

  useEffect(() => {
    if (stateUser.getUser()?.data) {
      setLoading(false);
      return;
    }
    const token = storageHelper.getItem("token");
    if (token) {
      fetchUser({
        url: "/user",
        method: "GET",
        schema: UserModel,
      });
      return;
    }
    setLoading(false);
    navigate("/auth/login");
  }, []);

  useEffect(() => { //runs when userData.data changes, ex: when user is fetched
    if (userData.data) {
      stateUser.setUser(userData.data);
      setLoading(false);
    }
  }, [userData.data]);

  useEffect(() => {
    if (userData.error) {
      setLoading(false);
      navigate("/auth/login");
    }
  }, [userData.error]);

  if (loading) {
    return <Loading />;
  }

  return children;
}
