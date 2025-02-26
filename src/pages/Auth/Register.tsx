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
import { cn } from "@/lib/utils";
import { UserModel } from "@/model/user.model";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { fetchData: fetchRegister, ...registerData } =
    useFetchData<z.infer<typeof UserModel>>();
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !username || !password) return;
    fetchRegister({
      url: "/register",
      method: "POST",
      schema: UserModel,
      axiosConfig: {
        data: {
          email,
          username,
          password,
        },
      },
    });
  }
  useEffect(() => {
    if (registerData.data) {
      toast.success("Register success");
      navigate("/auth/login");
    }
  }, [registerData.data]);
  useEffect(() => {
    if (registerData.error) {
      toast.error(registerData.errorResponse?.message);
    }
  }, [registerData.error]);
  if (registerData.loading) return <Loading />;
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="example"
                  required
                  ref={usernameRef}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  ref={emailRef}
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
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
