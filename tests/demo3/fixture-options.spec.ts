import { expect, TestInfo, WorkerInfo, test as base } from "@playwright/test";
import {
    SauceDemoItems,
    USDollarRegex,
    Usernames,
    Routes
} from "../../src/constants";
import { Cart } from "../../src/fixtures/cart";
import { InventoryItem } from "../../src/fixtures/inventory-item";
import { LoginForm } from "../../src/fixtures/login-form";
import { Sorter, SortOption } from "../../src/fixtures/sorter";

export const test = base.extend<
    {
        items: InventoryItem;
        cart: Cart;
        sorter: Sorter;
        loginForm: LoginForm;
        owner: string;
        ownerCheck: string;
    },
    {
        username: string;
    }
>({
    username: [
        async ({}, use, workerInfo: WorkerInfo) => {
            await use(Usernames.STANDARD);
            // const usernames = Object.values(Usernames);
            // const username =
            //     usernames[workerInfo.workerIndex % usernames.length];
            // await use(username);
        },
        { scope: "worker" }
    ],
    owner: "",
    ownerCheck: async ({ owner }, use, testInfo: TestInfo) => {
        if (owner.length === 0) {
            throw new Error("Owner is required");
        }

        testInfo.annotations.push({
            type: "owner",
            description: owner
        });
        await use(owner);
    },
    // loginForm: [
    //     async ({ page }, use) => {
    //         await page.goto(Routes.LOGIN);
    //         await use(new LoginForm(page));
    //     },
    //     { box: true }
    // ],
    // items: [
    //     async ({ page, loginForm, username }, use) => {
    //         await loginForm.login(username);
    //         await use(new InventoryItem(page));
    //     },
    //     { title: "log into inventory page", timeout: 1000 }
    // ],
    loginForm: async ({ page }, use) => {
        await page.goto(Routes.LOGIN);
        await use(new LoginForm(page));
    },
    items: async ({ page, loginForm, username }, use) => {
        await loginForm.login(username);
        await use(new InventoryItem(page));
    },
    cart: async ({ page }, use) => {
        await use(new Cart(page));
    },
    sorter: async ({ page }, use) => {
        await use(new Sorter(page));
    }
});
//test.use({ username: Usernames.PERFORMANCE_GLITCH });
test.describe("Inventory Page", () => {
    test.beforeEach(async ({ username, owner }, testInfo) => {
        testInfo.annotations.push({
            type: "username",
            description: username
        });
        if (owner.length > 0) {
            testInfo.annotations.push({
                type: "owner",
                description: owner
            });
        }
    });
    for (const itemName of Object.values(SauceDemoItems)) {
        test(`should display ${itemName} correctly`, async ({ items }) => {
            const item = await items.getItem(itemName);
            expect(item).not.toBeNull();
            expect(item!.name).toBe(itemName);
            expect(item!.description).toBeTruthy();
            expect(item!.price).toMatch(USDollarRegex);
            expect(item!.priceNumber).toBeGreaterThan(0);
            expect(item!.itemImage).toBeDefined();
            await expect(item!.itemImage!).toBeVisible();
            expect(item!.addButton).toBeDefined();
            await expect(item!.addButton!).toBeVisible();
        });
    }

    test("should sort items by name A-Z", async ({ items, sorter }) => {
        await sorter.sortBy(SortOption.AtoZ);
        const itemNames = await items.getItemNames();
        const sortedNames = [...itemNames].sort();
        expect(itemNames).toEqual(sortedNames);
    });

    test("should sort items by name Z-A", async ({ items, sorter }) => {
        await sorter.sortBy(SortOption.ZtoA);
        const itemNames = await items.getItemNames();
        const sortedNames = [...itemNames].sort().reverse();
        expect(itemNames).toEqual(sortedNames);
    });

    test("should sort items by price low to high", async ({
        items,
        sorter
    }) => {
        await sorter.sortBy(SortOption.PriceLowToHigh);
        const allItems = await items.getAllItems();
        const itemPrices = allItems.map((item) => item.priceNumber);
        const sortedPrices = [...itemPrices].sort((a, b) => a - b);
        expect(itemPrices).toEqual(sortedPrices);
    });

    test("should sort items by price high to low", async ({
        items,
        sorter
    }) => {
        await sorter.sortBy(SortOption.PriceHighToLow);
        const allItems = await items.getAllItems();
        const itemPrices = allItems.map((item) => item.priceNumber);
        const sortedPrices = [...itemPrices].sort((a, b) => b - a);
        expect(itemPrices).toEqual(sortedPrices);
    });
});
