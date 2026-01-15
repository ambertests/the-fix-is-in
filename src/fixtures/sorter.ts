import { Locator, Page, TestFixture } from "@playwright/test";

export enum SortOption {
    AtoZ = "az",
    ZtoA = "za",
    PriceLowToHigh = "lohi",
    PriceHighToLow = "hilo"
}
export class Sorter {
    constructor(private readonly page: Page) {}

    sortDropdown = (): Locator =>
        this.page.getByTestId("product-sort-container");
    /**
     * Select a sort option from the dropdown
     * @param option - Sort option: "az" (Name A-Z), "za" (Name Z-A), "lohi" (Price low-high), "hilo" (Price high-low)
     */
    sortBy = async (option: SortOption): Promise<void> => {
        await this.sortDropdown().selectOption(option.toString());
    };

    /**
     * Get the currently selected sort option
     * @returns Current sort option value
     */
    getCurrentSortOption = async (): Promise<string> => {
        return await this.sortDropdown().inputValue();
    };

    /**
     * Get the currently displayed sort text (e.g., "Name (A to Z)")
     * @returns Current sort option display text
     */
    getCurrentSortText = async (): Promise<string> => {
        const activeOption = this.page.getByTestId("active-option");
        return (await activeOption.textContent()) || "";
    };
}

export const sorter: TestFixture<
    Sorter,
    {
        page: Page;
    }
> = async ({ page }, use) => {
    const sorter = new Sorter(page);
    await use(sorter);
};
