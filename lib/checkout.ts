import { cartTotals, money, type CartItem } from "./cart";
import { customerSchema } from "./customer-schema";

export type Customer = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  notes: string;
};
export type CustomerErrors = Partial<Record<keyof Customer, string>>;
export function validateCustomer(customer: Customer): CustomerErrors {
  const result = customerSchema.safeParse(customer);
  const errors: CustomerErrors = {};
  if (!result.success)
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof Customer;
      errors[field] ??= issue.message;
    }
  return errors;
}

export function buildOrderMessage(
  customer: Customer,
  items: CartItem[],
  reference = "VODE-DRAFT",
) {
  const clean = Object.fromEntries(
    Object.entries(customer).map(([key, value]) => [key, value.trim()]),
  ) as Customer;
  const totals = cartTotals(items);
  return [
    "Hello VODE,",
    "",
    "I would like to place an order.",
    "Order reference: " + reference,
    "",
    "Customer Details",
    "Name: " + clean.fullName,
    "Phone: " + clean.phone,
    "Email: " + (clean.email || "Not provided"),
    "Address: " +
      [clean.address, clean.addressLine2].filter(Boolean).join(", "),
    "City: " + clean.city,
    "State: " + clean.state,
    "Pincode: " + clean.pincode,
    "Landmark: " + (clean.landmark || "Not provided"),
    "",
    "Order Details",
    "",
    ...items.flatMap((item, index) => [
      index + 1 + ". " + item.name,
      "Size: " + item.size,
      "Color: " + item.color,
      "Quantity: " + item.quantity,
      "Original Price: " + money(item.originalPrice),
      "Price: " + money(item.discountedPrice),
      "Total: " + money(item.discountedPrice * item.quantity),
      "",
    ]),
    "Order Summary",
    "Subtotal: " + money(totals.subtotal),
    "Discount: " + money(totals.discount),
    "Shipping: To be confirmed on WhatsApp (not included)",
    "Final Total: " + money(totals.total),
    "",
    "Additional Notes:",
    clean.notes || "None",
    "",
    "Thank you.",
  ].join("\n");
}
export function buildWhatsAppUrl(
  number: string | undefined,
  customer: Customer,
  items: CartItem[],
  reference?: string,
) {
  const normalized = (number ?? "").replace(/[\s()+-]/g, "");
  if (!/^[1-9]\d{7,14}$/.test(normalized))
    throw new Error(
      "WhatsApp ordering is temporarily unavailable. Please try again later.",
    );
  if (items.length === 0)
    throw new Error("Add an item to your cart before placing an order.");
  if (Object.keys(validateCustomer(customer)).length)
    throw new Error("Please check your customer details.");
  return (
    "https://wa.me/" +
    normalized +
    "?text=" +
    encodeURIComponent(buildOrderMessage(customer, items, reference))
  );
}
