package com.flagdhub.e2e.pages;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * Page Object for the Login page
 */
public class LoginPage {
    private final Page page;

    // Locators - using placeholder since inputs don't have name attributes
    private static final String USERNAME_INPUT = "input[placeholder='Username']";
    private static final String PASSWORD_INPUT = "input[placeholder='Password']";

    public LoginPage(Page page) {
        this.page = page;
    }

    /**
     * Navigate to the login page
     */
    public LoginPage navigate() {
        page.navigate("/login");
        return this;
    }

    /**
     * Fill in the username field
     */
    public LoginPage fillUsername(String username) {
        page.locator(USERNAME_INPUT).fill(username);
        return this;
    }

    /**
     * Fill in the password field
     */
    public LoginPage fillPassword(String password) {
        page.locator(PASSWORD_INPUT).fill(password);
        return this;
    }

    /**
     * Click the login button
     */
    public void clickLogin() {
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Login")).click();
    }

    /**
     * Perform complete login flow
     */
    public void login(String username, String password) {
        fillUsername(username);
        fillPassword(password);
        clickLogin();
    }

    /**
     * Get error message if login fails
     */
    public String getErrorMessage() {
        return page.locator(".error-message, [role='alert']").textContent();
    }

    /**
     * Check if error message is displayed
     */
    public boolean hasError() {
        // Check if error message exists and is not hidden
        return page.locator(".error-message").count() > 0 &&
               !page.locator(".error-message").getAttribute("class").contains("hidden");
    }
}
