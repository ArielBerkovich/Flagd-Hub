package com.flagdhub.e2e.pages;

import com.microsoft.playwright.Page;

/**
 * Page Object for the Export Dialog
 * Uses data-testid attributes for reliable element location
 */
public class ExportDialogPage {
    private final Page page;

    public ExportDialogPage(Page page) {
        this.page = page;
    }

    /**
     * Check if export dialog is visible
     */
    public boolean isDialogVisible() {
        return page.locator("[data-testid='export-json-content']").isVisible();
    }

    /**
     * Get the exported JSON content
     */
    public String getExportedContent() {
        return page.locator("[data-testid='export-json-content']").textContent();
    }

    /**
     * Click Copy button
     */
    public void clickCopy() {
        page.locator("[data-testid='export-copy-button']").click();
        page.waitForTimeout(300);
    }

    /**
     * Click Close button
     */
    public void clickClose() {
        page.locator("[data-testid='export-close-button']").click();
        page.waitForTimeout(300);
    }

    /**
     * Verify flag exists in export
     */
    public boolean exportContainsFlag(String flagName) {
        String content = getExportedContent();
        return content != null && content.contains(flagName);
    }
}
