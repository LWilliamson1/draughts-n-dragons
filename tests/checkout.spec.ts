import { test, expect } from "@playwright/test";

test.describe("Checkout flow", () => {
  test("user lands on Home, adds two items to cart, and checks out", async ({ page }) => {
    // ── 1. Land on the Home Screen ────────────────────────────────────────
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/Draughts & Dragons/);
    await expect(page.getByRole("heading", { name: /Draughts/i }).first()).toBeVisible();

    // ── 2. Navigate to the Shop via nav link (client-side navigation) ─────
    await page.getByRole("link", { name: "Shop" }).first().click();

    await expect(page).toHaveURL("/shop");
    await expect(page.getByRole("main").getByRole("heading", { name: "Our Wares" })).toBeVisible();

    // ── 3. Add first item to cart ─────────────────────────────────────────
    // Buttons have aria-label="Add {product name} to cart" so filter by visible text
    const addToCartButtons = page.locator("button").filter({ hasText: "Add to Cart" });
    await expect(addToCartButtons.first()).toBeVisible({ timeout: 15000 });
    await addToCartButtons.first().click();

    // Cart badge should show 1
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    // ── 4. Add second item to cart ────────────────────────────────────────
    await addToCartButtons.nth(1).click();

    // Cart badge should show 2
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    // ── 5. Navigate to Cart ───────────────────────────────────────────────
    await page.getByRole("link", { name: /View cart/i }).click();

    await expect(page).toHaveURL("/cart");
    await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();

    // Two distinct cart items should be visible
    const cartItems = page.locator("[data-testid^='cart-item-']");
    await expect(cartItems).toHaveCount(2);

    // Total should be displayed
    await expect(page.getByTestId("cart-total")).toBeVisible();

    // ── 6. Proceed to Checkout ────────────────────────────────────────────
    await page.getByTestId("proceed-to-checkout").click();

    await expect(page).toHaveURL("/checkout");
    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();

    // Order summary should list items and show a total
    await expect(page.getByTestId("checkout-total")).toBeVisible();

    // ── 7. Fill in checkout form ──────────────────────────────────────────
    await page.getByLabel("Full Name").fill("Gandalf the Grey");
    await page.getByLabel("Email Address").fill("gandalf@middleearth.me");
    await page.getByLabel("Delivery Address").fill("The Prancing Pony, Bree, Eriador");

    // ── 8. Place the order ────────────────────────────────────────────────
    await page.getByTestId("place-order").click();

    // ── 9. Confirm order success ──────────────────────────────────────────
    await expect(page.getByTestId("order-confirmation")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Order Placed!" })).toBeVisible();

    // Cart badge should disappear now that the cart is cleared
    await expect(page.getByTestId("cart-count")).not.toBeVisible();
  });
});
