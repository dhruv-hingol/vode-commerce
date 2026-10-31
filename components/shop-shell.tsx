"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Search, Heart, Menu, X, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cartTotals } from "@/lib/cart";
import { brand } from "@/lib/config";
import { BagIcon } from "./icons";
import { CartItems, OrderTotals } from "./cart-items";
import Modal from "./modal";
const links = [
  { href: "/collections/men", label: "Men", soldOut: false },
  { href: "/collections/t-shirts", label: "T-shirts", soldOut: true },
];
export default function ShopShell({ children }: { children: React.ReactNode }) {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const ready = useCartStore((s) => s.hasHydrated);
  const storageError = useCartStore((s) => s.storageError);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const wishCount = useWishlistStore((s) => s.ids.length);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const quantity = cartTotals(items).quantity;
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 32);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
    const timer = setInterval(
      () =>
        setAnnouncement((value) => (value + 1) % brand.announcements.length),
      5500,
    );
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    useCartStore.getState().closeCart();
  }, [pathname]);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (isOpen) {
      const active = document.activeElement as HTMLElement | null;
      element.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        element.close();
        document.body.style.overflow = overflow;
        active?.focus();
      };
    }
    element.close();
  }, [isOpen]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <span key={announcement}>{brand.announcements[announcement]}</span>
        <span className="announcement-right">
          A NEW PERSPECTIVE ON EVERYDAY
        </span>
      </div>
      <header className={`site-header ${pathname === "/" ? "site-header--home" : ""} ${scrolled ? "is-scrolled" : ""}`}>
        <button
          className="icon-button mobile-menu-button"
          aria-label="Open navigation"
          onClick={() => setMenu(true)}
        >
          <Menu size={22} />
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              key={link.href}
            >
              {link.label}
              {link.soldOut && <small className="nav-status">Sold out</small>}
            </Link>
          ))}
        </nav>
        <Link href="/" className="vode-wordmark" aria-label="VODE home">
          <span className="header-wordmark-text">VODE<sup>®</sup></span>
          <span className="header-wordmark-caption">COTTON & EXPRESSION</span>
        </Link>
        <div className="header-actions">
          <form action="/shop" role="search" className="header-search">
            <label className="sr-only" htmlFor="header-search">
              Search products
            </label>
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search the edit"
              aria-label="Search products"
            />
            <button
              className="icon-button"
              type="submit"
              aria-label="Submit search"
            >
              <Search size={18} strokeWidth={1.4} />
            </button>
          </form>
          <button
            className="icon-button mobile-search-button"
            aria-label="Search products"
            onClick={() => setSearch(true)}
          >
            <Search size={20} strokeWidth={1.4} />
          </button>
          <Link
            href="/wishlist"
            className="icon-button header-wishlist"
            aria-label={`Wishlist, ${wishCount} items`}
          >
            <Heart size={20} strokeWidth={1.4} />
            {wishCount > 0 && (
              <small className="wishlist-count" aria-live="polite">
                {wishCount}
              </small>
            )}
          </Link>
          <button
            className="bag-button"
            onClick={openCart}
            aria-label={`Open cart, ${quantity} items`}
          >
            <BagIcon width={20} height={20} />
            <span className="bag-label">BAG</span>
            <span className="cart-count">{quantity}</span>
          </button>
          <button
            className="icon-button desktop-menu-button"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={20} strokeWidth={1.4} />
          </button>
        </div>
      </header>
      {storageError && (
        <p className="storage-notice" role="status">
          Your browser could not save or restore the cart. You can still shop,
          but changes may not survive a refresh.
        </p>
      )}
      {children}
      {menu && (
        <Modal
          title="Navigation"
          className="mobile-nav-modal"
          onClose={() => setMenu(false)}
        >
          <Link
            href="/"
            className="vode-wordmark"
            onClick={() => setMenu(false)}
          >
            VODE
          </Link>
          <nav aria-label="Mobile navigation">
            {[
              { href: "/", label: "Home" },
              ...links,
              { href: "/wishlist", label: "Wishlist" },
              { href: "/contact", label: "Contact" },
            ].map((link, i) => (
              <Link
                href={link.href}
                onClick={() => setMenu(false)}
                key={link.href}
              >
                <span>0{i + 1}</span>
                {link.label}
                {"soldOut" in link && link.soldOut && (
                  <small className="nav-status">Sold out</small>
                )}
                <ArrowUpRight size={22} />
              </Link>
            ))}
          </nav>
          <p className="eyebrow">RULE THE STREET WITH VODE</p>
        </Modal>
      )}
      {search && (
        <Modal
          title="Search"
          className="search-modal"
          onClose={() => setSearch(false)}
        >
          <p className="eyebrow">FIND YOUR NEXT EXPRESSION</p>
          <h2>What speaks to you?</h2>
          <form action="/shop" onSubmit={() => setSearch(false)}>
            <label htmlFor="site-search">Search the collection</label>
            <div className="search-field">
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="11:11, Que Sera, cotton…"
                required
                autoFocus
              />
              <button
                className="icon-button"
                type="submit"
                aria-label="Submit search"
              >
                <Search size={22} />
              </button>
            </div>
          </form>
          <p className="muted">Explore our two signature pure cotton shirts.</p>
        </Modal>
      )}
      <dialog
        ref={dialog}
        className="cart-drawer"
        aria-labelledby="cart-title"
        onCancel={closeCart}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right) closeCart();
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
            <X size={22} />
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
                PROCEED TO CHECKOUT <ArrowUpRight size={18} />
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
            <p>Your bag is empty. Find your next considered essential.</p>
            <Link href="/shop" className="button primary" onClick={closeCart}>
              EXPLORE THE COLLECTION <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </dialog>
    </>
  );
}
