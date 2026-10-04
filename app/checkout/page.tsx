import Checkout from "@/components/checkout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Checkout",
  "Review your VODE bag and prepare your WhatsApp order.",
  "/checkout",
  true,
);
export default function CheckoutPage() {
  return <Checkout />;
}
