import { Locator, Page, TestFixture } from "@playwright/test";

export class Cart {
    constructor(private readonly page: Page) {}
    cartIcon = (): Locator => this.page.getByTestId("shopping-cart-link");
    cartItemsCount = (): Locator =>
        this.page.getByTestId("shopping-cart-badge");
    open = async (): Promise<void> => {
        await this.cartIcon().click();
    };
    count = async (): Promise<number> => {
        const badgeCount = await this.cartItemsCount().count();
        if (badgeCount === 0) return 0;
        const count = await this.cartItemsCount().textContent();
        return count ? parseInt(count) : 0;
    };
}

export const cart: TestFixture<Cart, { page: Page }> = async ({ page }, use) =>
    await use(new Cart(page));
