"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import {
  cartKey,
  cartTotals,
  MAX_QUANTITY,
  mergeItem,
  withQuantity,
  type CartItem,
} from "@/lib/cart";
import { findProduct } from "@/lib/products";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  storageError: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    productId: string,
    size: string,
    color: string,
    quantity?: number,
  ) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  updateSize: (key: string, size: string) => void;
  clearCart: () => void;
  getCartTotal: () => ReturnType<typeof cartTotals>;
};

function restoreItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartItem[]>((items, raw) => {
    if (!raw || typeof raw !== "object") return items;
    const product = findProduct(raw.productId);
    if (
      !product ||
      !product.sizes.includes(raw.size) ||
      !product.colors.includes(raw.color) ||
      !Number.isSafeInteger(raw.quantity) ||
      raw.quantity < 1
    )
      return items;
    return mergeItem(
      items,
      withQuantity(
        {
          productId: product.id,
          name: product.name,
          image: product.image,
          size: raw.size,
          color: raw.color,
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice,
          quantity: 1,
          finalItemTotal: 0,
        },
        Math.min(raw.quantity, MAX_QUANTITY),
      ),
    );
  }, []);
}

function reportStorageError() {
  queueMicrotask(() => {
    if (!useCartStore.getState().storageError)
      useCartStore.setState({ storageError: true });
  });
}
const storage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      reportStorageError();
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      reportStorageError();
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      reportStorageError();
    }
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      storageError: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addToCart: (productId, size, color, quantity = 1) => {
        const product = findProduct(productId);
        if (
          !get().hasHydrated ||
          !product ||
          !product.sizes.includes(size) ||
          !product.colors.includes(color) ||
          !Number.isSafeInteger(quantity) ||
          quantity < 1
        )
          return;
        const item = withQuantity(
          {
            productId,
            name: product.name,
            image: product.image,
            size,
            color,
            quantity,
            originalPrice: product.originalPrice,
            discountedPrice: product.discountedPrice,
            finalItemTotal: 0,
          },
          Math.min(quantity, MAX_QUANTITY),
        );
        set((state) => ({ items: mergeItem(state.items, item), isOpen: true }));
      },
      removeFromCart: (key) =>
        set((state) => ({
          items: state.items.filter((item) => cartKey(item) !== key),
        })),
      updateQuantity: (key, quantity) => {
        if (
          !Number.isSafeInteger(quantity) ||
          quantity < 1 ||
          quantity > MAX_QUANTITY
        )
          return;
        set((state) => ({
          items: state.items.map((item) =>
            cartKey(item) === key ? withQuantity(item, quantity) : item,
          ),
        }));
      },
      updateSize: (key, size) => {
        const item = get().items.find((entry) => cartKey(entry) === key);
        if (
          !item ||
          item.size === size ||
          !findProduct(item.productId)?.sizes.includes(size)
        )
          return;
        set((state) => ({
          items: mergeItem(
            state.items.filter((entry) => cartKey(entry) !== key),
            { ...item, size },
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => cartTotals(get().items),
    }),
    {
      name: "vode-cart",
      version: 1,
      storage: createJSONStorage(() => storage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => ({
        ...current,
        items: restoreItems(
          persisted && typeof persisted === "object" && "items" in persisted
            ? persisted.items
            : [],
        ),
      }),
      onRehydrateStorage: () => (_state, error) => {
        useCartStore.setState({
          hasHydrated: true,
          ...(error ? { storageError: true } : {}),
        });
      },
    },
  ),
);
