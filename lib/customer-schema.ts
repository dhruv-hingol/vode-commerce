import { z } from "zod";

const text = z.string().trim().max(250, "Please shorten this field.");
export const customerSchema = z.object({
  fullName: text.min(2, "Enter your full name."),
  phone: text.refine(
    (value) => /^(?:\+?91)?[6-9]\d{9}$/.test(value.replace(/[\s()-]/g, "")),
    "Enter a valid 10-digit Indian mobile number, optionally with +91.",
  ),
  email: text.refine(
    (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Enter a valid email address.",
  ),
  address: text.min(1, "This field is required."),
  addressLine2: text,
  city: text.min(1, "This field is required."),
  state: text.min(1, "This field is required."),
  pincode: text.regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit Indian pincode."),
  landmark: text,
  notes: z.string().trim().max(1000, "Please shorten this field."),
});
