package com.flagdhub.e2e.pages;

import com.microsoft.playwright.Page;

/**
 * Page Object for Flag Creation/Edit Form (modal or page)
 * Uses data-testid attributes for reliable element location
 */
public class FlagFormPage {
    private final Page page;

    public FlagFormPage(Page page) {
        this.page = page;
    }

    /**
     * Check if the form is visible (modal or page)
     */
    public boolean isFormVisible() {
        return page.locator("[data-testid='flag-key-input']").isVisible();
    }

    /**
     * Fill the flag key
     */
    public void fillFlagKey(String key) {
        page.locator("[data-testid='flag-key-input']").fill(key);
    }

    /**
     * Fill the flag name
     */
    public void fillFlagName(String name) {
        page.locator("[data-testid='flag-name-input']").fill(name);
    }

    /**
     * Fill the flag description
     */
    public void fillDescription(String description) {
        page.locator("[data-testid='flag-description-input']").fill(description);
    }

    /**
     * Fill the area/namespace
     */
    public void fillArea(String area) {
        page.locator("[data-testid='flag-area-input']").fill(area);
    }

    /**
     * Select flag type
     */
    public void selectFlagType(String type) {
        page.locator("[data-testid='flag-type-select']").selectOption(type);
    }

    /**
     * Select default variant by clicking the variant button
     */
    public void selectDefaultVariant(String variant) {
        // Click on the variant button (e.g., "on" or "off" for boolean)
        page.locator(String.format("[data-testid='variant-%s-button']", variant)).click();
        page.waitForTimeout(300);
    }

    /**
     * Fill variant keys for string/custom flags (comma-separated)
     */
    public void fillVariantKeys(String variantKeys) {
        page.locator("input[placeholder*='LOW,MEDIUM,HIGH']").fill(variantKeys);
        page.waitForTimeout(500); // Wait for UI to generate variant value inputs
    }

    /**
     * Fill variant value for a specific variant key
     */
    public void fillVariantValue(String variantKey, String value) {
        page.locator(String.format("[data-testid='variant-%s-value']", variantKey)).fill(value);
    }

    /**
     * Click Save/Create button
     */
    public void clickSave() {
        page.locator("[data-testid='flag-save-button']").click();
        page.waitForTimeout(500);
    }

    /**
     * Click Cancel button
     */
    public void clickCancel() {
        page.locator("[data-testid='flag-cancel-button']").click();
        page.waitForTimeout(300);
    }

    /**
     * Create a boolean flag with given parameters
     */
    public void createBooleanFlag(String key, String name, String description, String area, String defaultVariant) {
        fillFlagKey(key);
        fillFlagName(name);
        if (description != null && !description.isEmpty()) {
            fillDescription(description);
        }
        if (area != null && !area.isEmpty()) {
            fillArea(area);
        }
        // Type is already "boolean" by default
        selectDefaultVariant(defaultVariant);

        // Wait for form validation to enable the save button
        page.waitForTimeout(800);

        // Wait for the save button to be enabled (not disabled)
        page.waitForFunction("() => !document.querySelector('[data-testid=\"flag-save-button\"]').disabled");

        clickSave();
    }

    /**
     * Check if form has an error message
     */
    public boolean hasError() {
        return page.locator(".error, .error-message, [role='alert']").isVisible();
    }

    /**
     * Get error message text
     */
    public String getErrorMessage() {
        return page.locator(".error, .error-message, [role='alert']").first().textContent();
    }

    /**
     * Check if save button is enabled
     */
    public boolean isSaveButtonEnabled() {
        return !page.locator("[data-testid='flag-save-button']").isDisabled();
    }
}
