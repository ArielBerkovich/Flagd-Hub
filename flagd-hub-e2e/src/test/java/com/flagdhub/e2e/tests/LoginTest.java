package com.flagdhub.e2e.tests;

import com.flagdhub.e2e.fixtures.BaseTest;
import com.flagdhub.e2e.pages.DashboardPage;
import com.flagdhub.e2e.pages.LoginPage;
import com.flagdhub.e2e.utils.TestConfig;
import org.junit.jupiter.api.*;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Login Test
 */
@DisplayName("Login Test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class LoginTest extends BaseTest {

    @Test
    @Order(1)
    @DisplayName("Login with correct credentials should work")
    void loginWithCorrectCredentialsShouldWork() {
        LoginPage loginPage = new LoginPage(page);
        DashboardPage dashboardPage = new DashboardPage(page);

        // Navigate to login page
        loginPage.navigate();

        // Login with correct credentials
        loginPage.login(TestConfig.DEFAULT_USERNAME, TestConfig.DEFAULT_PASSWORD);

        // Wait for dashboard to load
        page.waitForTimeout(2000);

        // Verify we're on the dashboard
        assertThat(dashboardPage.isOnDashboard())
                .as("After successful login, user should be on the dashboard")
                .isTrue();

        assertThat(dashboardPage.isLogoutButtonVisible())
                .as("Logout button should be visible when logged in")
                .isTrue();
    }

    @Test
    @Order(2)
    @DisplayName("Logout should return to login screen")
    void logoutShouldReturnToLoginScreen() {
        LoginPage loginPage = new LoginPage(page);
        DashboardPage dashboardPage = new DashboardPage(page);

        // First, ensure we're logged in
        loginPage.navigate();
        loginPage.login(TestConfig.DEFAULT_USERNAME, TestConfig.DEFAULT_PASSWORD);
        page.waitForTimeout(2000);

        // Verify we're on dashboard
        assertThat(dashboardPage.isOnDashboard())
                .as("Should be logged in before logout test")
                .isTrue();

        // Click logout
        dashboardPage.logout();

        // Wait for redirect
        page.waitForTimeout(1000);

        // Verify we're back on login page
        boolean hasLoginForm = page.locator("input[placeholder='Username']").isVisible();
        boolean onLoginUrl = page.url().contains("/login") || page.url().equals(TestConfig.BASE_URL + "/");

        assertThat(hasLoginForm || onLoginUrl)
                .as("After logout, user should see login form")
                .isTrue();
    }
}
