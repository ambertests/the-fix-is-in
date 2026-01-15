import { Locator, Page, TestFixture } from "@playwright/test";
import { Routes, Usernames } from "../constants";

export class LoginForm {
    constructor(private readonly page: Page) {}
    usernameInput = (): Locator =>
        this.page.getByRole("textbox", { name: "Username" });
    passwordInput = (): Locator =>
        this.page.getByRole("textbox", { name: "Password" });
    loginButton = (): Locator =>
        this.page.getByRole("button", { name: "Login" });
    passwordContainer = (): Locator =>
        this.page.locator('[data-test="login-password"]');

    async getUniversalPassword(): Promise<string> {
        // Text is "Password for all users:secret_sauce" - grab what's after the colon
        const text = (await this.passwordContainer().textContent()) ?? "";
        return text.split(":").pop()?.trim() ?? "";
    }
    async login(username?: string, password?: string) {
        username = username ?? Usernames.STANDARD;
        password = password ?? (await this.getUniversalPassword());
        await this.usernameInput().fill(username);
        await this.passwordInput().fill(password);
        await this.loginButton().click();
    }
    isLoggedIn(): boolean {
        const url = new URL(this.page.url());
        return url.pathname !== Routes.LOGIN;
    }
}

export const loginForm: TestFixture<
    LoginForm,
    { page: Page; baseURL?: string }
> = async ({ page, baseURL }, use) => {
    if (!baseURL) {
        throw new Error("Base URL is required");
    }
    await page.goto(baseURL);
    await use(new LoginForm(page));
};
