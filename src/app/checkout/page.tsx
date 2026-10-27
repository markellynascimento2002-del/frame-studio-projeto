import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return <Suspense fallback={<main className="checkout-page"><p>Carregando checkout...</p></main>}><CheckoutClient /></Suspense>;
}
