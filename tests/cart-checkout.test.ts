import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { useCartStore } from "../store/useCartStore";
import { cartKey, cartTotals, MAX_QUANTITY } from "../lib/cart";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  validateCustomer,
  type Customer,
} from "../lib/checkout";

let saved: Map<string, string>;
beforeEach(async () => {
  saved = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => {
        saved.set(key, value);
      },
      removeItem: (key: string) => {
        saved.delete(key);
      },
    },
  });
  useCartStore.setState({
    items: [],
    isOpen: false,
    hasHydrated: false,
    storageError: false,
  });
  await useCartStore.persist.rehydrate();
});
const cart = () => useCartStore.getState();
const add = (size = "M", color = "Ink", quantity = 1) =>
  cart().addToCart("everyday-tee", size, color, quantity);
const customer: Customer = {
  fullName: "Asha Shah",
  phone: "+91 9876543210",
  email: "asha@example.com",
  address: "12 River Road",
  addressLine2: "Flat 4",
  city: "Ahmedabad",
  state: "Gujarat",
  pincode: "380001",
  landmark: "Near the park",
  notes: "Call first & ring once. नमस्ते",
};

test("same variation merges while sizes and colors remain separate", () => {
  add();
  add();
  add("L");
  add("M", "Chalk");
  assert.equal(cart().items.length, 3);
  assert.equal(cart().items[0].quantity, 2);
  assert.equal(cart().getCartTotal().quantity, 4);
});
test("quantity edits recalculate item and summary totals", () => {
  add();
  cart().updateQuantity(cartKey(cart().items[0]), 3);
  assert.equal(cart().items[0].finalItemTotal, 2997);
  assert.deepEqual(cart().getCartTotal(), {
    quantity: 3,
    subtotal: 4497,
    discount: 1500,
    total: 2997,
  });
  cart().updateQuantity(cartKey(cart().items[0]), 1);
  assert.equal(cart().items[0].finalItemTotal, 999);
});
test("invalid quantities and invalid product variations cannot enter the cart", () => {
  add();
  const key = cartKey(cart().items[0]);
  for (const quantity of [0, -1, 1.5, NaN, Infinity, MAX_QUANTITY + 1])
    cart().updateQuantity(key, quantity);
  add("XXL");
  add("M", "missing");
  add("M", "Ink", -1);
  cart().addToCart("missing", "M", "Ink");
  assert.equal(cart().items.length, 1);
  assert.equal(cart().items[0].quantity, 1);
});
test("changing size merges a matching line without losing units", () => {
  add("M", "Ink", 2);
  add("L", "Ink", 3);
  cart().updateSize(cartKey(cart().items[0]), "L");
  assert.equal(cart().items.length, 1);
  assert.equal(cart().items[0].size, "L");
  assert.equal(cart().items[0].quantity, 5);
  assert.equal(cart().items[0].finalItemTotal, 4995);
  cart().updateSize(cartKey(cart().items[0]), "invalid");
  assert.equal(cart().items[0].size, "L");
});
test("remove and clear persist, while transient UI state is not saved", () => {
  add();
  add("L");
  cart().removeFromCart(cartKey(cart().items[0]));
  assert.equal(cart().items.length, 1);
  const persisted = JSON.parse(saved.get("vode-cart")!);
  assert.deepEqual(Object.keys(persisted.state), ["items"]);
  cart().clearCart();
  assert.deepEqual(JSON.parse(saved.get("vode-cart")!).state.items, []);
});
test("hydration restores cart, validates variations and replaces tampered prices", async () => {
  add("M", "Ink", 2);
  const item = {
    ...cart().items[0],
    name: "tampered",
    discountedPrice: 1,
    finalItemTotal: 1,
  };
  useCartStore.setState({ items: [], hasHydrated: false });
  saved.set(
    "vode-cart",
    JSON.stringify({
      version: 1,
      state: {
        items: [
          item,
          item,
          { ...item, productId: "unknown" },
          { ...item, quantity: -5 },
          { ...item, size: "XXL" },
        ],
      },
    }),
  );
  await useCartStore.persist.rehydrate();
  assert.equal(cart().hasHydrated, true);
  assert.equal(cart().items.length, 1);
  assert.equal(cart().items[0].name, "The Everyday Tee");
  assert.equal(cart().items[0].quantity, 4);
  assert.equal(cart().items[0].discountedPrice, 999);
  assert.equal(cart().items[0].finalItemTotal, 3996);
  assert.deepEqual(useCartStore.getInitialState().items, []);
});
test("corrupt storage recovers without blocking shopping", async () => {
  saved.set("vode-cart", "{invalid");
  await useCartStore.persist.rehydrate();
  assert.equal(cart().hasHydrated, true);
  assert.equal(cart().storageError, true);
  add();
  assert.equal(cart().items.length, 1);
});
test("blocked localStorage retains an in-memory cart and reports persistence failure", async () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => {
      throw new Error("blocked");
    },
  });
  await useCartStore.persist.rehydrate();
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  add();
  assert.equal(cart().storageError, true);
  assert.equal(cart().items.length, 1);
});
test("adding is blocked until hydration completes", () => {
  useCartStore.setState({ hasHydrated: false });
  add();
  assert.equal(cart().items.length, 0);
});
test("validation requires all six mandatory fields but permits optional fields to be empty", () => {
  const empty = Object.fromEntries(
    Object.keys(customer).map((key) => [key, "   "]),
  ) as Customer;
  assert.deepEqual(Object.keys(validateCustomer(empty)).sort(), [
    "address",
    "city",
    "fullName",
    "phone",
    "pincode",
    "state",
  ]);
  assert.deepEqual(
    validateCustomer({
      ...customer,
      email: "",
      addressLine2: "",
      landmark: "",
      notes: "",
    }),
    {},
  );
});
test("validation rejects malformed phone, email and pincode", () => {
  const errors = validateCustomer({
    ...customer,
    phone: "123",
    email: "no-at-sign",
    pincode: "000000",
  });
  assert.ok(errors.phone && errors.email && errors.pincode);
  assert.deepEqual(validateCustomer(customer), {});
});
test("WhatsApp encodes complete details and recalculated totals without clearing the cart", () => {
  add("M", "Ink", 2);
  const before = JSON.stringify(cart().items);
  const url = new URL(
    buildWhatsAppUrl("+91 9876543210", customer, cart().items),
  );
  assert.equal(url.origin + url.pathname, "https://wa.me/919876543210");
  const message = url.searchParams.get("text")!;
  for (const value of [
    "Hello VODE,",
    "Name: Asha Shah",
    "12 River Road, Flat 4",
    "City: Ahmedabad",
    "State: Gujarat",
    "Pincode: 380001",
    "Email: asha@example.com",
    "Landmark: Near the park",
    "1. The Everyday Tee",
    "Size: M",
    "Color: Ink",
    "Quantity: 2",
    "Price: ₹999.00",
    "Total: ₹1,998.00",
    "Subtotal: ₹2,998.00",
    "Discount: ₹1,000.00",
    "Final Total: ₹1,998.00",
    customer.notes,
  ])
    assert.ok(message.includes(value), value);
  assert.equal(message, buildOrderMessage(customer, cart().items));
  assert.equal(JSON.stringify(cart().items), before);
  assert.equal(cartTotals(cart().items).quantity, 2);
});
test("missing recipient, invalid customer, and empty cart cannot produce an order URL", () => {
  add();
  assert.throws(() => buildWhatsAppUrl(undefined, customer, cart().items));
  assert.throws(() => buildWhatsAppUrl("abc", customer, cart().items));
  assert.throws(() =>
    buildWhatsAppUrl(
      "919876543210",
      { ...customer, fullName: "" },
      cart().items,
    ),
  );
  assert.throws(() => buildWhatsAppUrl("919876543210", customer, []));
});
