import Checkout from "@/components/checkout";
import { pageMetadata } from "@/lib/seo";
import { connection } from "next/server";

export const metadata = pageMetadata(
  "Checkout",
  "Review your VODE bag and prepare your WhatsApp order.",
  "/checkout",
  true,
);
export default async function CheckoutPage() {
  await connection();
  const whatsappNumber =
    process.env.WHATSAPP_NUMBER ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return <Checkout whatsappNumber={whatsappNumber} />;
}
