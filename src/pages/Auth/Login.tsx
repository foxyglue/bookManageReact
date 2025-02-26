import Loading from "@/component/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetchData } from "@/helper/FetchDataHelper";
import StorageHelper from "@/helper/StorageHelper";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function Login() {
  const keyRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { fetchData: fetchLogin, ...loginData } = useFetchData<{
    data: {
      token: string;
    };
  }>();
  const storageHelper = new StorageHelper(localStorage);
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const key = keyRef.current?.value;
    const password = passwordRef.current?.value;
    if (!key || !password) return;
    fetchLogin({
      url: "/login",
      method: "POST",
      schema: z.object({
        data: z.object({
          token: z.string(),
        }),
      }),
      axiosConfig: {
        data: {
          key,
          password,
        },
      },
    });
  }
  useEffect(() => {
    if (loginData.data) {
      storageHelper.setItem("token", loginData.data.data.token);
      return navigate("/");
    }
  }, [loginData.data]);
  useEffect(() => {
    if (loginData.error) {
      toast.error("Invalid email/username or password");
    }
  }, [loginData.error]);
  if (loginData.loading) return <Loading />;
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credential below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="key">Email/Username</Label>
                <Input
                  id="key"
                  type="text"
                  placeholder="example"
                  required
                  ref={keyRef}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  ref={passwordRef}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/register"
                className="underline underline-offset-4"
              >
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
