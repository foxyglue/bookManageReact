import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserModel } from "@/model/user.model";
import { useFetchData } from "@/helper/FetchDataHelper";
import { useEffect, useRef } from "react";
import { z } from "zod";
import Loading from "@/component/Loading";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
function Profile() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { fetchData: fetchUpdate, ...updateData } =
    useFetchData<z.infer<typeof UserModel>>();
  const stateUser = useUser();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    fetchUpdate({
      url: "/user",
      method: "PUT",
      schema: UserModel,
      axiosConfig: {
        data: {
          email,
          username,
          password: !!password ? password : undefined,
        },
      },
    });
  }
  useEffect(() => {
    if (updateData.data) {
      toast.success("Update success");
      stateUser.setUser(updateData.data);
    }
  }, [updateData.data]);
  useEffect(() => {
    if (updateData.error) {
      toast.error(updateData.errorResponse?.message);
    }
  }, [updateData.error]);
  useEffect(() => {
    if (
      stateUser.getUser() &&
      emailRef.current &&
      usernameRef.current &&
      passwordRef.current
    ) {
      emailRef.current.value = stateUser.getUser()?.data.email ?? "";
      usernameRef.current.value = stateUser.getUser()?.data.username ?? "";
      passwordRef.current.value = "";
    }
  }, [stateUser.user]);
  if (updateData.loading) return <Loading />;
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Getting Started</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Profile</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-col gap-4 p-4">
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
                    ref={passwordRef}
                    autoCorrect="off"
                    spellCheck="false"
                    autoComplete="off"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default Profile;
