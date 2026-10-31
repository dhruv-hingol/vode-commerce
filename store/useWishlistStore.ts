"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { findProduct } from "@/lib/products";
export const useWishlistStore = create<{
  ids: string[];
  toggle: (id: string) => void;
}>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => {
        if (findProduct(id))
          set((s) => ({
            ids: s.ids.includes(id)
              ? s.ids.filter((value) => value !== id)
              : [...s.ids, id],
          }));
      },
    }),
    {
      name: "vode-wishlist",
      skipHydration: true,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch {
            /* This visit stays usable. */
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            /* This visit stays usable. */
          }
        },
      })),
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === "object" && "ids" in persisted
            ? persisted.ids
            : [];
        return {
          ...current,
          ids: Array.isArray(raw)
            ? [
                ...new Set(
                  raw.filter(
                    (id): id is string =>
                      typeof id === "string" && Boolean(findProduct(id)),
                  ),
                ),
              ]
            : [],
        };
      },
    },
  ),
);
