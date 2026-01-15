import { chromium, expect, test, Locator, Page } from "@playwright/test";
import { Routes, Usernames } from "../../src/constants";

test.describe("No Fixtures", () => {
    test("log into sauce demo with standard user", async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        console.log(`launching ${browser.browserType().name()}`);
        await page.goto(Routes.LOGIN);
        await page
            .getByRole("textbox", { name: "Username" })
            .fill(Usernames.STANDARD);
        await page
            .getByRole("textbox", { name: "Password" })
            .fill("secret_sauce");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).toHaveURL(new RegExp(Routes.INVENTORY));
    });
});

test.describe("Default Fixtures", () => {
    test("log into sauce demo with standard user", async ({
        page,
        browserName
    }) => {
        console.log(`launching ${browserName}`);
        await page.goto(Routes.LOGIN);
        await page
            .getByRole("textbox", { name: "Username" })
            .fill(Usernames.STANDARD);
        await page
            .getByRole("textbox", { name: "Password" })
            .fill("secret_sauce");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).toHaveURL(new RegExp(Routes.INVENTORY));
    });
});

export class LoginForm {
    constructor(private readonly page: Page) {}
    usernameInput = (): Locator =>
        this.page.getByRole("textbox", { name: "Username" });
    passwordInput = (): Locator =>
        this.page.getByRole("textbox", { name: "Password" });
    loginButton = (): Locator =>
        this.page.getByRole("button", { name: "Login" });

    async login(username: string, password: string) {
        await this.usernameInput().fill(username);
        await this.passwordInput().fill(password);
        await this.loginButton().click();
    }
}

const loginTest = test.extend<{ loginForm: LoginForm }>({
    loginForm: async ({ page, browserName }, use) => {
        console.log(`launching ${browserName}`);
        await page.goto(Routes.LOGIN);
        await use(new LoginForm(page));
    }
});

loginTest.describe("Custom Fixtures", () => {
    loginTest(
        "log into sauce demo with standard user",
        async ({ loginForm, page }) => {
            await loginForm.login("standard_user", "secret_sauce");
            await expect(page).toHaveURL(new RegExp(Routes.INVENTORY));
        }
    );
});
