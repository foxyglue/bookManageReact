import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import StorageHelper from "../helper/StorageHelper";
import { UserModel } from "@/model/user.model";
import { z } from "zod";

interface UserState {
  user: z.infer<typeof UserModel> | null;
  setUser: (user: z.infer<typeof UserModel> | null) => void;
  getUser: () => z.infer<typeof UserModel> | null;
}

export const useUser = create(
  persist<UserState>(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getUser: () => get().user,
    }),
    {
      name: "user",
      storage: createJSONStorage(() => new StorageHelper(localStorage)),
    }
  )
);
