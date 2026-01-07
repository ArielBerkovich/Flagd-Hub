package com.flagdhub.e2e.pages;

import com.microsoft.playwright.Page;

/**
 * Page Object for the Changelog Dialog/Page
 */
public class ChangelogPage {
    private final Page page;

    public ChangelogPage(Page page) {
        this.page = page;
    }

    /**
     * Check if changelog dialog/page is visible
     */
    public boolean isChangelogVisible() {
        return page.locator("[data-testid='changelogs-dialog']").isVisible();
    }

    /**
     * Get the latest changelog entry text
     */
    public String getLatestEntry() {
        return page.locator("[data-testid^='changelog-entry-']").first().textContent();
    }

    /**
     * Get all changelog entries
     */
    public int getChangelogCount() {
        return page.locator("[data-testid^='changelog-entry-']").count();
    }

    /**
     * Check if changelog contains specific text
     */
    public boolean changelogContains(String text) {
        String latestEntry = getLatestEntry();
        return latestEntry != null && latestEntry.contains(text);
    }

    /**
     * Click Close button
     */
    public void clickClose() {
        page.locator("[data-testid='changelogs-close-button']").click();
        page.waitForTimeout(300);
    }
}
