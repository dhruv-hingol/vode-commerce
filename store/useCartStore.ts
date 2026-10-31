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
import { findProduct, variantStock } from "@/lib/products";

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
  updateColor: (key: string, color: string) => void;
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
    if (!variantStock(product, raw.size, raw.color)) return items;
    return limitToStock(
      mergeItem(
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
      ),
    );
  }, []);
}

function limitToStock(items: CartItem[]): CartItem[] {
  return items.flatMap((item) => {
    const product = findProduct(item.productId);
    const stock = product ? variantStock(product, item.size, item.color) : 0;
    return stock > 0
      ? [withQuantity(item, Math.min(item.quantity, stock))]
      : [];
  });
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
          variantStock(product, size, color) < 1 ||
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
        set((state) => ({
          items: limitToStock(mergeItem(state.items, item)),
          isOpen: true,
        }));
      },
      removeFromCart: (key) =>
        set((state) => ({
          items: state.items.filter((item) => cartKey(item) !== key),
        })),
      updateQuantity: (key, quantity) => {
        const item = get().items.find((entry) => cartKey(entry) === key);
        const product = item && findProduct(item.productId);
        if (
          !item ||
          !product ||
          quantity > variantStock(product, item.size, item.color) ||
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
          !findProduct(item.productId)?.sizes.includes(size) ||
          !variantStock(findProduct(item.productId)!, size, item.color)
        )
          return;
        set((state) => ({
          items: limitToStock(
            mergeItem(
              state.items.filter((entry) => cartKey(entry) !== key),
              { ...item, size },
            ),
          ),
        }));
      },
      updateColor: (key, color) => {
        const item = get().items.find((entry) => cartKey(entry) === key);
        const product = item && findProduct(item.productId);
        if (!item || !product || !variantStock(product, item.size, color))
          return;
        set((state) => ({
          items: limitToStock(
            mergeItem(
              state.items.filter((entry) => cartKey(entry) !== key),
              { ...item, color },
            ),
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
