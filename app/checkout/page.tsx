"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-dungeon-dark text-parchment flex flex-col items-center justify-center gap-6 px-4">
        <span className="text-6xl">🛒</span>
        <h1 className="font-cinzel text-2xl text-gold-rune">Nothing to Checkout</h1>
        <p className="font-im-fell text-parchment-dark opacity-60 italic">
          Your cart is empty. Add some items first.
        </p>
        <Link
          href="/shop"
          className="font-cinzel text-sm tracking-wider uppercase px-8 py-3 rounded border border-gold-rune text-gold-rune hover:bg-gold-rune hover:text-dungeon-dark transition-all duration-300"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        data-testid="order-confirmation"
        className="min-h-screen bg-dungeon-dark text-parchment flex flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <span className="text-6xl">🎉</span>
        <h1 className="font-cinzel text-3xl text-gold-rune">Order Placed!</h1>
        <p className="font-im-fell text-parchment-dark opacity-70 text-lg italic max-w-md">
          Your order has been received, adventurer. We will prepare your wares and send word by raven.
        </p>
        <Link
          href="/shop"
          className="font-cinzel text-sm tracking-wider uppercase px-8 py-3 rounded border border-gold-rune text-gold-rune hover:bg-gold-rune hover:text-dungeon-dark transition-all duration-300"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-dungeon-dark text-parchment">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-cinzel text-3xl text-gold-rune mb-2">Checkout</h1>
        <p className="font-im-fell text-parchment-dark opacity-50 italic mb-8">
          Complete your order, brave adventurer.
        </p>

        {/* Order summary */}
        <div className="bg-dungeon-mid border border-dungeon-purple rounded-xl p-5 mb-8">
          <h2 className="font-cinzel text-parchment text-sm tracking-widest uppercase mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="font-im-fell text-parchment-dark opacity-70">
                  {item.icon} {item.name}
                  {item.quantity > 1 && <span className="opacity-60"> × {item.quantity}</span>}
                </span>
                <span className="font-cinzel text-parchment">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-dungeon-purple pt-3 flex justify-between">
            <span className="font-cinzel text-gold-rune">Total</span>
            <span data-testid="checkout-total" className="font-cinzel text-gold-rune font-bold">
              £{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="font-cinzel text-xs tracking-widest uppercase text-parchment-dark block mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aragorn Strider"
              className="w-full bg-dungeon-mid border border-dungeon-purple rounded-lg px-4 py-3 font-im-fell text-parchment placeholder-parchment-dark placeholder-opacity-30 focus:outline-none focus:border-arcane-violet transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="font-cinzel text-xs tracking-widest uppercase text-parchment-dark block mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ranger@gondor.me"
              className="w-full bg-dungeon-mid border border-dungeon-purple rounded-lg px-4 py-3 font-im-fell text-parchment placeholder-parchment-dark placeholder-opacity-30 focus:outline-none focus:border-arcane-violet transition-colors"
            />
          </div>

          <div>
            <label htmlFor="address" className="font-cinzel text-xs tracking-widest uppercase text-parchment-dark block mb-1.5">
              Delivery Address
            </label>
            <textarea
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="1 Bag End, Hobbiton, The Shire"
              rows={3}
              className="w-full bg-dungeon-mid border border-dungeon-purple rounded-lg px-4 py-3 font-im-fell text-parchment placeholder-parchment-dark placeholder-opacity-30 focus:outline-none focus:border-arcane-violet transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            data-testid="place-order"
            className="w-full font-cinzel text-sm tracking-wider uppercase py-4 rounded-lg bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
