import { create } from "zustand";

const useSearchStore = create((set) => ({
  search: "",
  setSearch: (value) => set({ search: typeof value === "string" ? value : "" }),
  clearSearch: () => set({ search: "" }),
}));

export default useSearchStore;