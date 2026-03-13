"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { items, removeItem, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dungeon-dark text-parchment flex flex-col items-center justify-center gap-6 px-4">
        <span className="text-6xl">🛒</span>
        <h1 className="font-cinzel text-2xl text-gold-rune">Your Cart is Empty</h1>
        <p className="font-im-fell text-parchment-dark opacity-60 italic">
          The adventurer's pack lies empty. Head to the shop to fill it.
        </p>
        <Link
          href="/shop"
          className="font-cinzel text-sm tracking-wider uppercase px-8 py-3 rounded border border-gold-rune text-gold-rune hover:bg-gold-rune hover:text-dungeon-dark transition-all duration-300"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dungeon-dark text-parchment">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-cinzel text-3xl text-gold-rune mb-2">Your Cart</h1>
        <p className="font-im-fell text-parchment-dark opacity-50 italic mb-8">
          {totalItems} item{totalItems !== 1 ? "s" : ""} in your pack
        </p>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              data-testid={`cart-item-${item.id}`}
              className="bg-dungeon-mid border border-dungeon-purple rounded-xl p-4 flex items-center gap-4"
            >
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-cinzel text-parchment text-sm font-bold">{item.name}</div>
                <div className="font-im-fell text-parchment-dark opacity-50 text-xs italic">{item.brand}</div>
              </div>
              <div className="text-right">
                <div className="font-cinzel text-gold-rune font-bold">
                  £{(item.price * item.quantity).toFixed(2)}
                </div>
                {item.quantity > 1 && (
                  <div className="font-im-fell text-parchment-dark opacity-40 text-xs">
                    {item.quantity} × £{item.price.toFixed(2)}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
                className="text-parchment-dark opacity-40 hover:opacity-100 hover:text-dragon-red transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="border-t border-dungeon-purple pt-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-im-fell text-parchment-dark opacity-60">Subtotal</span>
            <span className="font-cinzel text-parchment">£{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-cinzel text-gold-rune text-lg">Total</span>
            <span data-testid="cart-total" className="font-cinzel text-gold-rune text-xl font-bold">
              £{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 text-center font-cinzel text-sm tracking-wider uppercase px-6 py-3 rounded border border-dungeon-purple text-parchment-dark hover:border-arcane-violet hover:text-parchment transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            data-testid="proceed-to-checkout"
            className="flex-1 text-center font-cinzel text-sm tracking-wider uppercase px-6 py-3 rounded bg-gold-rune text-dungeon-dark font-bold hover:bg-gold-bright transition-all duration-300"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
