"use client";

import Image from "next/image";
import Link from "next/link";
import {
  cartKey,
  cartTotals,
  MAX_QUANTITY,
  money,
  type CartItem,
} from "@/lib/cart";
import { findProduct, variantStock } from "@/lib/products";
import { useCartStore } from "@/store/useCartStore";

export function CartItems() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateSize = useCartStore((state) => state.updateSize);
  const updateColor = useCartStore((state) => state.updateColor);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const closeCart = useCartStore((state) => state.closeCart);
  return (
    <ul className="cart-items">
      {items.map((item) => {
        const key = cartKey(item);
        return (
          <li className="cart-item" key={key}>
            <Link
              href={"/products/" + item.productId}
              onClick={closeCart}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={item.image}
                width={100}
                height={125}
                alt=""
                className="cart-image"
              />
            </Link>
            <div className="cart-item-details">
              <div className="item-heading">
                <Link href={"/products/" + item.productId} onClick={closeCart}>
                  {item.name}
                </Link>
                <button
                  className="remove"
                  aria-label={
                    "Remove " + item.name + ", " + item.size + ", " + item.color
                  }
                  onClick={() => removeFromCart(key)}
                >
                  Remove
                </button>
              </div>
              <label className="size-select">
                Color{" "}
                <select
                  aria-label={"Color for " + item.name + ", " + item.size}
                  value={item.color}
                  onChange={(event) => updateColor(key, event.target.value)}
                >
                  {findProduct(item.productId)?.colors.map((color) => (
                    <option key={color}>{color}</option>
                  ))}
                </select>
              </label>
              <label className="size-select">
                Size{" "}
                <select
                  aria-label={"Size for " + item.name + ", " + item.color}
                  value={item.size}
                  onChange={(event) => updateSize(key, event.target.value)}
                >
                  {findProduct(item.productId)?.sizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <div className="item-bottom">
                <div className="quantity-control">
                  <button
                    aria-label={"Decrease quantity of " + item.name}
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(key, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span aria-label="Quantity">{item.quantity}</span>
                  <button
                    aria-label={"Increase quantity of " + item.name}
                    disabled={
                      item.quantity >=
                      Math.min(
                        MAX_QUANTITY,
                        variantStock(
                          findProduct(item.productId)!,
                          item.size,
                          item.color,
                        ),
                      )
                    }
                    onClick={() => updateQuantity(key, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-prices">
                  <span>
                    {money(item.discountedPrice)}{" "}
                    <del>{money(item.originalPrice)}</del>
                  </span>
                  <strong>
                    {money(item.finalItemTotal)} <small>total</small>
                  </strong>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export function OrderTotals({ items }: { items: CartItem[] }) {
  const totals = cartTotals(items);
  return (
    <dl className="totals" aria-live="polite">
      <div>
        <dt>Subtotal</dt>
        <dd>{money(totals.subtotal)}</dd>
      </div>
      <div className="saving">
        <dt>Discount</dt>
        <dd>−{money(totals.discount)}</dd>
      </div>
      <div className="final-total">
        <dt>Final total</dt>
        <dd>{money(totals.total)}</dd>
      </div>
    </dl>
  );
}
