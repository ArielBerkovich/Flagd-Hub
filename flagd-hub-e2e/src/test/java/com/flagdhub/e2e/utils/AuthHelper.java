package com.flagdhub.e2e.utils;

import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

import java.nio.file.Paths;

/**
 * Helper class for authentication-related operations
 */
public class AuthHelper {
    private static final String AUTH_STATE_FILE = "build/.auth/state.json";

    /**
     * Log in to the application using the UI
     */
    public static void login(Page page, String username, String password) {
        page.navigate(TestConfig.BASE_URL + "/login");

        // Fill in login form (inputs use placeholder, not labels)
        page.locator("input[placeholder='Username']").fill(username);
        page.locator("input[placeholder='Password']").fill(password);

        // Click login button
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Login")).click();

        // Wait for navigation after login
        page.waitForURL(TestConfig.BASE_URL + "/**", new Page.WaitForURLOptions().setTimeout(10000));
    }

    /**
     * Log in with default credentials
     */
    public static void loginWithDefaultCredentials(Page page) {
        login(page, TestConfig.DEFAULT_USERNAME, TestConfig.DEFAULT_PASSWORD);
    }

    /**
     * Save authentication state to file for reuse
     */
    public static void saveAuthState(BrowserContext context) {
        context.storageState(new BrowserContext.StorageStateOptions()
                .setPath(Paths.get(AUTH_STATE_FILE))
        );
    }

    /**
     * Check if user is logged in by checking for logout button or user menu
     */
    public static boolean isLoggedIn(Page page) {
        try {
            // Adjust this selector based on your app's UI
            return page.locator("[data-testid='user-menu']").isVisible() ||
                   page.locator("text=Logout").isVisible();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Log out from the application
     */
    public static void logout(Page page) {
        // Adjust these selectors based on your app's UI
        if (page.locator("[data-testid='user-menu']").isVisible()) {
            page.locator("[data-testid='user-menu']").click();
            page.locator("text=Logout").click();
        }
    }
}
