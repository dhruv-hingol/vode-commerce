"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { cartTotals } from "@/lib/cart";
import { BagIcon } from "./icons";
import { CartItems, OrderTotals } from "./cart-items";

export default function ShopShell({ children }: { children: React.ReactNode }) {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const ready = useCartStore((state) => state.hasHydrated);
  const storageError = useCartStore((state) => state.storageError);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const quantity = cartTotals(items).quantity;

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    useCartStore.getState().closeCart();
  }, [pathname]);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (isOpen) {
      const previousFocus = document.activeElement as HTMLElement | null;
      element.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        element.close();
        document.body.style.overflow = previousOverflow;
        previousFocus?.focus();
      };
    }
    element.close();
  }, [isOpen]);

  return (
    <>
      <div className="announcement">
        CONSIDERED ESSENTIALS. EVERYDAY EXPRESSION.
      </div>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="VODE home">
          VODE<span>®</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#collection">The collection</Link>
        </nav>
        <button
          className="bag-button"
          onClick={openCart}
          aria-label={"Open cart, " + quantity + " items"}
        >
          <BagIcon />
          <span className="bag-label">Your bag</span>
          <span className="cart-count" aria-live="polite">
            {quantity}
          </span>
        </button>
      </header>
      {storageError && (
        <p className="storage-notice" role="status">
          Your browser could not save or restore the cart. You can still shop,
          but changes may not survive a refresh.
        </p>
      )}
      {children}
      <footer className="site-footer">
        <Link href="/" className="wordmark">
          VODE<span>®</span>
        </Link>
        <p>Less noise. More you.</p>
        <span>Catalogue & WhatsApp ordering</span>
      </footer>
      <dialog
        ref={dialog}
        className="cart-drawer"
        aria-labelledby="cart-title"
        onCancel={closeCart}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              closeCart();
          }
        }}
      >
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h2 id="cart-title">
              Your bag <span>({quantity})</span>
            </h2>
          </div>
          <button
            autoFocus
            className="close-button"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        {!ready ? (
          <p className="empty-cart" role="status">
            Loading your bag…
          </p>
        ) : items.length ? (
          <>
            <div className="drawer-scroll">
              <CartItems />
            </div>
            <div className="drawer-bottom">
              <OrderTotals items={items} />
              <p className="small muted">
                Our team will confirm availability and delivery on WhatsApp.
              </p>
              <Link
                href="/checkout"
                className="button primary"
                onClick={closeCart}
              >
                PROCEED TO CHECKOUT <span>↗</span>
              </Link>
              <button className="text-button" onClick={closeCart}>
                CONTINUE SHOPPING
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <BagIcon width={44} height={44} />
            <h3>A little room for something good.</h3>
            <p>Your bag is empty. Find your next everyday essential.</p>
            <Link
              href="/#collection"
              className="button primary"
              onClick={closeCart}
            >
              EXPLORE THE COLLECTION ↗
            </Link>
          </div>
        )}
      </dialog>
    </>
  );
}
