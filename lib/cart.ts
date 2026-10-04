export type CartItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  finalItemTotal: number;
};

export const MAX_QUANTITY = 999;
export const cartKey = (item: Pick<CartItem, "productId" | "size" | "color">) =>
  JSON.stringify([item.productId, item.size, item.color]);
export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
export const withQuantity = (item: CartItem, quantity: number): CartItem => ({
  ...item,
  quantity,
  finalItemTotal: Math.round(item.discountedPrice * quantity * 100) / 100,
});
export function mergeItem(items: CartItem[], incoming: CartItem): CartItem[] {
  const existing = items.find((item) => cartKey(item) === cartKey(incoming));
  const merged = withQuantity(
    incoming,
    Math.min(MAX_QUANTITY, incoming.quantity + (existing?.quantity ?? 0)),
  );
  return existing
    ? items.map((item) => (cartKey(item) === cartKey(incoming) ? merged : item))
    : [...items, merged];
}
export function cartTotals(items: CartItem[]) {
  const subtotal =
    Math.round(
      items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0) *
        100,
    ) / 100;
  const total =
    Math.round(
      items.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0,
      ) * 100,
    ) / 100;
  return {
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discount: Math.round((subtotal - total) * 100) / 100,
    total,
  };
}
