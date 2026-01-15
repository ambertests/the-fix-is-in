export const LoginErrors: Record<string, string> = {
    INVALID_CREDENTIALS:
        "Epic sadface: Username and password do not match any user in this service",
    MISSING_PASSWORD: "Epic sadface: Password is required",
    MISSING_USERNAME: "Epic sadface: Username is required",
    LOCKED_OUT_USER: "Epic sadface: Sorry, this user has been locked out.",
    NOT_LOGGED_IN:
        "Epic sadface: You can only access '{route}' when you are logged in."
};
export const CheckoutErrors: Record<string, string> = {
    MISSING_FIRST_NAME: "Error: First Name is required",
    MISSING_LAST_NAME: "Error: Last Name is required",
    MISSING_POSTAL_CODE: "Error: Postal Code is required"
};
export const Routes: Record<string, string> = {
    LOGIN: "/",
    INVENTORY: "/inventory.html",
    DETAIL: "/inventory-item.html",
    CART: "/cart.html",
    CHECKOUT: "/checkout-step-one.html",
    SUMMARY: "/checkout-step-two.html",
    COMPLETE: "/checkout-complete.html"
};
export const Usernames: Record<string, string> = {
    STANDARD: "standard_user",
    LOCKED_OUT: "locked_out_user",
    PROBLEM: "problem_user",
    PERFORMANCE_GLITCH: "performance_glitch_user",
    ERROR: "error_user",
    VISUAL: "visual_user"
};
export const USDollarRegex: RegExp = /\$(\d+\.\d{2})/;
export const SauceDemoItems: Record<string, string> = {
    BACKPACK: "Sauce Labs Backpack",
    BIKE_LIGHT: "Sauce Labs Bike Light",
    BOLT_T_SHIRT: "Sauce Labs Bolt T-Shirt",
    FLEECE_JACKET: "Sauce Labs Fleece Jacket",
    ONESIE: "Sauce Labs Onesie",
    TEST_ALL_THE_THINGS_T_SHIRT_RED: "Test.allTheThings() T-Shirt (Red)"
};
