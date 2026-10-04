import { cartTotals, money, type CartItem } from "./cart";

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
  const errors: CustomerErrors = {};
  const required: (keyof Customer)[] = [
    "fullName",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ];
  for (const field of required)
    if (!customer[field].trim()) errors[field] = "This field is required.";
  if (customer.fullName.trim() && customer.fullName.trim().length < 2)
    errors.fullName = "Enter your full name.";
  if (
    customer.phone.trim() &&
    !/^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(
      customer.phone.trim().replace(/[\s()-]/g, ""),
    )
  )
    errors.phone =
      "Enter a valid 10-digit Indian mobile number, optionally with +91.";
  if (
    customer.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
  )
    errors.email = "Enter a valid email address.";
  if (customer.pincode.trim() && !/^[1-9]\d{5}$/.test(customer.pincode.trim()))
    errors.pincode = "Enter a valid 6-digit Indian pincode.";
  for (const field of Object.keys(customer) as (keyof Customer)[]) {
    if (customer[field].length > (field === "notes" ? 1000 : 250))
      errors[field] = "Please shorten this field.";
  }
  return errors;
}

export function buildOrderMessage(customer: Customer, items: CartItem[]) {
  const clean = Object.fromEntries(
    Object.entries(customer).map(([key, value]) => [key, value.trim()]),
  ) as Customer;
  const totals = cartTotals(items);
  return [
    "Hello VODE,",
    "",
    "I would like to place an order.",
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
    encodeURIComponent(buildOrderMessage(customer, items))
  );
}
