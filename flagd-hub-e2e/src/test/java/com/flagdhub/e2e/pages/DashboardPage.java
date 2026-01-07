package com.flagdhub.e2e.pages;

import com.microsoft.playwright.Page;

/**
 * Page Object for the Dashboard/Home page (main feature flags page)
 * Uses data-testid attributes for reliable element location
 */
public class DashboardPage {
    private final Page page;

    public DashboardPage(Page page) {
        this.page = page;
    }

    /**
     * Check if we're on the dashboard (logged in successfully)
     */
    public boolean isOnDashboard() {
        // After login, user should see the sidebar and main area
        return page.locator(".sidebar").isVisible() &&
               page.locator(".mainArea").isVisible();
    }

    /**
     * Get the page title
     */
    public String getTitle() {
        return page.title();
    }

    /**
     * Click the logout button
     */
    public void logout() {
        page.locator(".logout-button").click();
        page.waitForTimeout(500);
    }

    /**
     * Check if logout button is visible (indicates logged in state)
     */
    public boolean isLogoutButtonVisible() {
        return page.locator(".logout-button").isVisible();
    }

    /**
     * Click the "Create flag" button
     */
    public void clickCreateFlag() {
        page.locator("[data-testid='create-flag-button']").click();
        page.waitForTimeout(500);
    }

    /**
     * Click the "Export" button
     */
    public void clickExport() {
        page.locator("[data-testid='export-button']").click();
        page.waitForTimeout(500);
    }

    /**
     * Click the "Changelogs" button
     */
    public void clickChangelogs() {
        page.locator("[data-testid='changelogs-button']").click();
        page.waitForTimeout(500);
    }

    /**
     * Search for feature flags
     */
    public void searchFeatureFlags(String searchTerm) {
        page.locator("[data-testid='search-flags-input']").fill(searchTerm);
        page.waitForTimeout(300);
    }

    /**
     * Search for areas in the sidebar
     */
    public void searchAreas(String searchTerm) {
        page.locator("input[placeholder='Search areas...']").fill(searchTerm);
        page.waitForTimeout(300);
    }

    /**
     * Click on an area in the sidebar
     */
    public void clickArea(String areaName) {
        page.locator(String.format(".feature-flags-areas-container li:has-text('%s')", areaName)).click();
        page.waitForTimeout(300);
    }

    /**
     * Reset area filter to show all flags (click "All Areas" or similar)
     */
    public void showAllAreas() {
        // Try to click "All" or "All Areas" to reset the filter
        if (page.locator(".feature-flags-areas-container li:has-text('All')").count() > 0) {
            page.locator(".feature-flags-areas-container li:has-text('All')").first().click();
        } else {
            // If no "All" option, navigate to the base URL to reset filters
            page.navigate(page.url().split("\\?")[0]);
        }
        page.waitForTimeout(500);
    }

    /**
     * Get count of visible feature flags
     */
    public int getFeatureFlagCount() {
        return page.locator(".feature-flag-item, .flag-card, [data-testid='flag-item']").count();
    }

    /**
     * Check if a flag with given key exists
     */
    public boolean flagExists(String flagKey) {
        return page.locator(String.format("[data-testid='flag-card-%s']", flagKey)).count() > 0;
    }

    /**
     * Click on a flag's edit button
     */
    public void clickFlag(String flagKey) {
        page.locator(String.format("[data-testid='flag-edit-button-%s']", flagKey)).click();
        page.waitForTimeout(500);
    }

    /**
     * Toggle a flag's value (for boolean flags)
     */
    public void toggleFlag(String flagKey) {
        // The checkbox input is hidden, so click the parent label which contains the visible slider
        page.locator(String.format("[data-testid='flag-card-%s'] .toggle-switch", flagKey)).click();
        page.waitForTimeout(500);
    }

    /**
     * Delete a flag
     */
    public void deleteFlag(String flagKey) {
        page.locator(String.format("[data-testid='flag-delete-button-%s']", flagKey)).click();
        page.waitForTimeout(500);
    }
}
