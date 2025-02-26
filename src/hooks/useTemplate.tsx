import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import StorageHelper from "../helper/StorageHelper";

interface TemplateState {
  template: number | null;
  setTemplate: (template: number | null) => void;
  getTemplate: () => number | null;
}

export const useTemplate = create(
  persist<TemplateState>(
    (set, get) => ({
      template: 0,
      setTemplate: (template) => set({ template }),
      getTemplate: () => get().template,
    }),
    {
      name: "template",
      storage: createJSONStorage(() => new StorageHelper(localStorage)),
    },
  ),
);
