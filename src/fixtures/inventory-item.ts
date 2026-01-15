import { expect, Locator, Page, TestFixture } from "@playwright/test";
import { USDollarRegex } from "../constants";

export interface SauceItem {
    name: string;
    price: string;
    priceNumber: number;
    description: string;
    quantity?: number;
    addButton: Locator;
    removeButton: Locator;
    itemImage: Locator;
    nameLink: Locator;
    imageLink: Locator;
}

export class InventoryItem {
    constructor(private readonly page: Page) {}
    items = (): Locator => this.page.getByTestId("inventory-item");
    itemNames = (): Locator => this.page.getByTestId("inventory-item-name");

    item = (name: string): Locator =>
        this.items().filter({
            has: this.page
                .getByTestId("inventory-item-name")
                .getByText(name, { exact: true })
        });

    getItemNames = async (): Promise<string[]> => {
        return (await this.itemNames().allTextContents()).filter(
            (name) => name !== ""
        );
    };

    getItem = async (name: string): Promise<SauceItem | null> => {
        const item = this.item(name);
        const count = await item.count();
        return count > 0 ? await this.extractItemData(item.first()) : null;
    };

    getAllItems = async (): Promise<SauceItem[]> => {
        const items = await this.items().all();
        return await Promise.all(
            items.map((item) => this.extractItemData(item))
        );
    };
    validateItem = async (item: SauceItem): Promise<void> => {
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.price).toMatch(USDollarRegex);
        expect(item.priceNumber).toBeGreaterThan(0);
        expect(item.itemImage).toBeDefined();
        await expect(item.itemImage!).toBeVisible();
        expect(item.addButton).toBeDefined();
        await expect(item.addButton!).toBeVisible();
    };

    private extractItemData = async (
        itemLocator: Locator
    ): Promise<SauceItem> => {
        const name = await itemLocator
            .getByTestId("inventory-item-name")
            .textContent();
        const price = await itemLocator
            .getByTestId("inventory-item-price")
            .textContent();
        const description = await itemLocator
            .getByTestId("inventory-item-desc")
            .textContent();

        const result: SauceItem = {
            name: name || "",
            price: price || "",
            priceNumber: price ? parseFloat(price.replace(/[^0-9.]/g, "")) : 0,
            description: description || "",
            addButton: itemLocator.getByRole("button", {
                name: "Add to cart"
            }),
            removeButton: itemLocator.getByRole("button", {
                name: "Remove"
            }),
            itemImage: itemLocator.getByRole("img"),
            nameLink: itemLocator.getByRole("link").filter({
                has: this.page.getByTestId("inventory-item-name")
            }),
            imageLink: itemLocator
                .locator(".inventory_item_img")
                .getByRole("link")
        };

        const quantityLocator = itemLocator.getByTestId("item-quantity");
        if (quantityLocator && (await quantityLocator.count()) > 0) {
            const quantityText = await quantityLocator.textContent();
            if (quantityText) result.quantity = parseInt(quantityText, 10);
        }

        return result;
    };
}

export const inventoryItem: TestFixture<InventoryItem, { page: Page }> = async (
    { page },
    use
) => await use(new InventoryItem(page));
