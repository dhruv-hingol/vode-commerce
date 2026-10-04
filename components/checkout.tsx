"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCartStore } from "@/store/useCartStore";
import { cartTotals } from "@/lib/cart";
import {
  buildWhatsAppUrl,
  validateCustomer,
  type Customer,
  type CustomerErrors,
} from "@/lib/checkout";
import { CartItems, OrderTotals } from "./cart-items";
import { WhatsAppIcon } from "./icons";

const initialCustomer: Customer = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  notes: "",
};
const fields: {
  name: keyof Customer;
  label: string;
  required?: boolean;
  autoComplete?: string;
  type?: string;
  wide?: boolean;
  placeholder?: string;
}[] = [
  {
    name: "fullName",
    label: "Full name",
    required: true,
    autoComplete: "name",
    placeholder: "Your full name",
  },
  {
    name: "phone",
    label: "Phone number",
    required: true,
    type: "tel",
    autoComplete: "tel",
    placeholder: "10-digit mobile number",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    autoComplete: "email",
    wide: true,
    placeholder: "you@example.com",
  },
  {
    name: "address",
    label: "Address",
    required: true,
    autoComplete: "address-line1",
    wide: true,
    placeholder: "House number and street",
  },
  {
    name: "addressLine2",
    label: "Address line 2",
    autoComplete: "address-line2",
    wide: true,
    placeholder: "Apartment, area, etc.",
  },
  {
    name: "city",
    label: "City",
    required: true,
    autoComplete: "address-level2",
  },
  {
    name: "state",
    label: "State",
    required: true,
    autoComplete: "address-level1",
  },
  {
    name: "pincode",
    label: "Pincode",
    required: true,
    autoComplete: "postal-code",
    placeholder: "6-digit pincode",
  },
  { name: "landmark", label: "Landmark", placeholder: "A nearby place" },
];
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const ready = useCartStore((state) => state.hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);
  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [notice, setNotice] = useState("");
  const [preparedOrder, setPreparedOrder] = useState<{
    url: string;
    items: string;
  } | null>(null);
  const orderUrl =
    preparedOrder?.items === JSON.stringify(items) ? preparedOrder.url : "";
  const quantity = cartTotals(items).quantity;

  function update(field: keyof Customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPreparedOrder(null);
    setNotice("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setPreparedOrder(null);
    const nextErrors = validateCustomer(customer);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }
    try {
      const currentItems = useCartStore.getState().items;
      const url = buildWhatsAppUrl(whatsappNumber, customer, currentItems);
      // Open within the user gesture. Opening a message never clears the cart.
      window.open(url, "_blank", "noopener,noreferrer");
      setPreparedOrder({ url, items: JSON.stringify(currentItems) });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not prepare your order. Please try again.",
      );
    }
  }

  if (!ready)
    return (
      <main className="page-wrap checkout-page">
        <p role="status">Loading your bag…</p>
      </main>
    );
  if (!items.length)
    return (
      <main className="page-wrap checkout-page empty-checkout">
        <p className="eyebrow">A FRESH START</p>
        <h1>Your bag is empty.</h1>
        <p>Explore the collection and find something that feels like you.</p>
        <Link href="/#collection" className="button primary">
          CONTINUE SHOPPING ↗
        </Link>
      </main>
    );
  return (
    <main className="page-wrap checkout-page">
      <Link href="/#collection" className="back-link">
        ← Continue shopping
      </Link>
      <p className="eyebrow">ONE STEP CLOSER</p>
      <h1>Make it yours.</h1>
      <p className="checkout-intro">
        Your picks. Your details. A conversation away.
      </p>
      <div className="checkout-grid">
        <section className="customer-section">
          <div className="form-heading">
            <h2>Delivery details</h2>
            <span className="small muted">* Required</span>
          </div>
          <p className="small muted">
            Delivery within India. Your details are shared with VODE when you
            send the WhatsApp message.
          </p>
          <form noValidate onSubmit={submit} className="checkout-form">
            {fields.map((field) => (
              <div
                className={"form-field " + (field.wide ? "wide" : "")}
                key={field.name}
              >
                <label htmlFor={field.name}>
                  {field.label}{" "}
                  {field.required ? (
                    <span>*</span>
                  ) : (
                    <span className="optional">(optional)</span>
                  )}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  value={customer[field.name]}
                  placeholder={field.placeholder}
                  maxLength={250}
                  inputMode={field.name === "pincode" ? "numeric" : undefined}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name] ? field.name + "-error" : undefined
                  }
                  onChange={(event) => update(field.name, event.target.value)}
                />
                {errors[field.name] && (
                  <p className="field-error" id={field.name + "-error"}>
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
            <div className="form-field wide">
              <label htmlFor="notes">
                Additional notes <span className="optional">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={customer.notes}
                rows={3}
                maxLength={1000}
                placeholder="Anything you’d like us to know?"
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={errors.notes ? "notes-error" : undefined}
                onChange={(event) => update("notes", event.target.value)}
              />
              {errors.notes && (
                <p id="notes-error" className="field-error">
                  {errors.notes}
                </p>
              )}
            </div>
            <div className="checkout-action wide">
              <p className="small muted">
                We’ll prepare your order in WhatsApp. Review and send it there;
                our team will confirm availability, delivery charges and payment
                arrangements.
              </p>
              {notice && (
                <p className="field-error" role="alert">
                  {notice}
                </p>
              )}
              <button type="submit" className="button whatsapp">
                <WhatsAppIcon />
                ORDER ON WHATSAPP <span>↗</span>
              </button>
              <p className="checkout-reassurance">
                Your bag stays saved until you clear it.
              </p>
            </div>
          </form>
          {orderUrl && (
            <div className="order-followup" role="status">
              <h3>Your message is ready.</h3>
              <p>
                Complete the send in WhatsApp. Opening WhatsApp does not confirm
                an order.
              </p>
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                WhatsApp didn’t open? Open your prepared message ↗
              </a>
              <button
                type="button"
                className="button secondary"
                onClick={clearCart}
              >
                ORDER SENT — CLEAR CART
              </button>
            </div>
          )}
        </section>
        <aside className="order-summary">
          <div className="form-heading">
            <h2>Your selection</h2>
            <span className="small">
              {quantity} {quantity === 1 ? "item" : "items"}
            </span>
          </div>
          <CartItems />
          <OrderTotals items={items} />
          <p className="small muted">
            Final total above is for the products. Any delivery charges will be
            confirmed by our team before you pay.
          </p>
          <button className="text-button" onClick={clearCart}>
            CLEAR CART
          </button>
        </aside>
      </div>
    </main>
  );
}
