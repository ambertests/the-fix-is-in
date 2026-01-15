import { Locator, Page, test as base, expect } from "@playwright/test";
import { LoginForm } from "../../src/fixtures/login-form";
import { Routes } from "../../src/constants";

type Item = {
    name: string;
    price: string;
    description: string;
};
class Items {
    constructor(private readonly page: Page) {}
    item = (): Locator => this.page.getByTestId("inventory-item");
    allItems = async (): Promise<Item[]> => {
        const items = (await this.item().all()) ?? [];
        return await Promise.all(
            items.map(async (item: Locator) => {
                return {
                    name:
                        (await item
                            .getByTestId("inventory-item-name")
                            .textContent()) ?? "",
                    price:
                        (await item
                            .getByTestId("inventory-item-price")
                            .textContent()) ?? "",
                    description:
                        (await item
                            .getByTestId("inventory-item-desc")
                            .textContent()) ?? ""
                };
            })
        );
    };
}

class InventoryPage {
    constructor(private readonly page: Page, private readonly items: Items) {}
    allItems = async (): Promise<Item[]> => {
        return await this.items.allItems();
    };
    sortDropdown = (): Locator =>
        this.page.getByTestId("product-sort-container");
    sortByPriceLowToHigh = async (): Promise<void> => {
        await this.sortDropdown().selectOption("lohi");
    };
    addItemToCart = async (name: string): Promise<void> => {
        const item = this.items.item().filter({ hasText: name });
        await item.getByRole("button", { name: "Add to cart" }).click();
    };
}

class CartPage {
    constructor(private readonly page: Page, private readonly items: Items) {}
    open = async (): Promise<void> => {
        await this.page.goto(Routes.CART);
    };
    contents = async (): Promise<Item[]> => {
        return await this.items.allItems();
    };
    checkoutButton = (): Locator => this.page.getByTestId("checkout");
    checkout = async (): Promise<void> => {
        await this.checkoutButton().click();
    };
}

export const test = base.extend<{
    loginForm: LoginForm;
    items: Items;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
}>({
    loginForm: async ({ page }, use) => {
        await page.goto(Routes.LOGIN);
        await use(new LoginForm(page));
    },
    items: async ({ page }, use) => {
        await use(new Items(page));
    },
    inventoryPage: async ({ page, items, loginForm }, use) => {
        await loginForm.login();
        await use(new InventoryPage(page, items));
    },
    cartPage: async ({ page, items }, use) => {
        await use(new CartPage(page, items));
    }
});

test.describe("show items in different pages", () => {
    test("should sort items by price low to high", async ({
        inventoryPage
    }) => {
        await inventoryPage.sortByPriceLowToHigh();
        const items = await inventoryPage.allItems();
        const prices = items.map((item) =>
            parseFloat(item.price.replace("$", ""))
        );
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });
    test("should display items in cart", async ({
        inventoryPage,
        cartPage
    }) => {
        const items = await inventoryPage.allItems();
        const targetItem = items[3];
        await inventoryPage.addItemToCart(targetItem.name);
        await cartPage.open();
        const cartItems = await cartPage.contents();
        expect(cartItems).toHaveLength(1);
        expect(cartItems[0]).toEqual(targetItem);
    });
});
