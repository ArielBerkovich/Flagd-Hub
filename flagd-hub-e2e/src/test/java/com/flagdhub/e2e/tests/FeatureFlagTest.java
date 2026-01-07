package com.flagdhub.e2e.tests;

import com.flagdhub.e2e.fixtures.BaseTest;
import com.flagdhub.e2e.pages.ChangelogPage;
import com.flagdhub.e2e.pages.DashboardPage;
import com.flagdhub.e2e.pages.ExportDialogPage;
import com.flagdhub.e2e.pages.FlagFormPage;
import com.flagdhub.e2e.pages.LoginPage;
import com.flagdhub.e2e.utils.TestConfig;
import org.junit.jupiter.api.*;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Feature Flag Tests
 */
@DisplayName("Feature Flag Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class FeatureFlagTest extends BaseTest {

    private static final String TEST_FLAG_KEY = "test-flag-1";
    private static final String TEST_FLAG_NAME = "Test Flag 1";
    private static final String TEST_FLAG_DESCRIPTION = "This is a test flag";
    private static final String TEST_FLAG_AREA = "test-area";

    private static final String TEST_FLAG_KEY_2 = "test-flag-2";
    private static final String TEST_FLAG_NAME_2 = "Test Flag 2";
    private static final String TEST_FLAG_DESCRIPTION_2 = "This is another test flag";
    private static final String TEST_FLAG_AREA_2 = "test-area";

    private static final String TEST_STRING_FLAG_KEY = "test-string-flag";
    private static final String TEST_STRING_FLAG_NAME = "Test String Flag";
    private static final String TEST_STRING_FLAG_DESCRIPTION = "This is a string type flag";
    private static final String TEST_STRING_FLAG_AREA = "test-area";

    private static final String TEST_FLAG_KEY_3 = "test-flag-3";
    private static final String TEST_FLAG_NAME_3 = "Test Flag 3";
    private static final String TEST_FLAG_DESCRIPTION_3 = "This is a flag in area-1";
    private static final String TEST_FLAG_AREA_3 = "area-1";

    private static final String TEST_FLAG_KEY_4 = "test-flag-4";
    private static final String TEST_FLAG_NAME_4 = "Test Flag 4";
    private static final String TEST_FLAG_DESCRIPTION_4 = "This is a flag in area-2";
    private static final String TEST_FLAG_AREA_4 = "area-2";

    @BeforeEach
    void loginBeforeEachTest() {
        LoginPage loginPage = new LoginPage(page);
        loginPage.navigate();
        loginPage.login(TestConfig.DEFAULT_USERNAME, TestConfig.DEFAULT_PASSWORD);
        page.waitForTimeout(2000);
    }

    @AfterEach
    void cleanupAfterEachTest() {
        DashboardPage dashboardPage = new DashboardPage(page);

        // Reset any area filters to show all flags
        dashboardPage.showAllAreas();
        page.waitForTimeout(500);

        // Delete test flags if they exist
        String[] testFlags = {TEST_FLAG_KEY, TEST_FLAG_KEY_2, TEST_STRING_FLAG_KEY, TEST_FLAG_KEY_3, TEST_FLAG_KEY_4};
        for (String flagKey : testFlags) {
            if (dashboardPage.flagExists(flagKey)) {
                dashboardPage.deleteFlag(flagKey);
                page.waitForTimeout(500);

                // Confirm deletion in the confirmation dialog
                if (page.locator("button:has-text('Confirm'), button:has-text('Yes'), button:has-text('Delete')").count() > 0) {
                    page.locator("button:has-text('Confirm'), button:has-text('Yes'), button:has-text('Delete')").first().click();
                    page.waitForTimeout(1000);
                }
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("Create a boolean feature flag")
    void createBooleanFeatureFlag() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);

        // Click create flag button
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);

        // Verify form is visible
        assertThat(flagFormPage.isFormVisible())
                .as("Flag creation form should be visible")
                .isTrue();

        // Fill in flag details
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY,
                TEST_FLAG_NAME,
                TEST_FLAG_DESCRIPTION,
                TEST_FLAG_AREA,
                "on"
        );

        // Wait for flag to be created
        page.waitForTimeout(1500);

        // Verify flag appears in the dashboard
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("Created flag should appear in the dashboard")
                .isTrue();
    }

    @Test
    @Order(2)
    @DisplayName("Change feature flag value by toggling")
    void changeFeatureFlagValue() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);

        // First create a flag with default value "on"
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);

        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY,
                TEST_FLAG_NAME,
                TEST_FLAG_DESCRIPTION,
                TEST_FLAG_AREA,
                "on"
        );
        page.waitForTimeout(2000);

        // Wait for the flag card to be visible
        page.locator(String.format("[data-testid='flag-card-%s']", TEST_FLAG_KEY)).waitFor();
        page.waitForTimeout(500);

        // Get the initial state of the toggle (should be checked/on)
        boolean initialState = page.locator(String.format("[data-testid='flag-toggle-%s']", TEST_FLAG_KEY)).isChecked();
        assertThat(initialState)
                .as("Flag should initially be 'on' (checked)")
                .isTrue();

        // Toggle the flag value (from "on" to "off")
        dashboardPage.toggleFlag(TEST_FLAG_KEY);
        page.waitForTimeout(1000);

        // Verify the toggle state changed
        boolean newState = page.locator(String.format("[data-testid='flag-toggle-%s']", TEST_FLAG_KEY)).isChecked();
        assertThat(newState)
                .as("Flag should be 'off' (unchecked) after toggle")
                .isFalse();
    }

    @Test
    @Order(3)
    @DisplayName("Search for a specific feature flag")
    void searchForFeatureFlag() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);

        // Create first flag
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY,
                TEST_FLAG_NAME,
                TEST_FLAG_DESCRIPTION,
                TEST_FLAG_AREA,
                "on"
        );
        page.waitForTimeout(1500);

        // Create second flag
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY_2,
                TEST_FLAG_NAME_2,
                TEST_FLAG_DESCRIPTION_2,
                TEST_FLAG_AREA_2,
                "off"
        );
        page.waitForTimeout(1500);

        // Verify both flags exist before search
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("First flag should exist before search")
                .isTrue();
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_2))
                .as("Second flag should exist before search")
                .isTrue();

        // Search for the first flag by name
        dashboardPage.searchFeatureFlags(TEST_FLAG_NAME);
        page.waitForTimeout(1000);

        // Verify first flag is still visible
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("Searched flag should be visible after search")
                .isTrue();

        // Clear search to show all flags again
        dashboardPage.searchFeatureFlags("");
        page.waitForTimeout(1000);

        // Verify both flags are visible again
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("First flag should be visible after clearing search")
                .isTrue();
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_2))
                .as("Second flag should be visible after clearing search")
                .isTrue();
    }

    @Test
    @Order(4)
    @DisplayName("Edit a feature flag")
    void editFeatureFlag() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);

        // Create a flag first
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY,
                TEST_FLAG_NAME,
                TEST_FLAG_DESCRIPTION,
                TEST_FLAG_AREA,
                "on"
        );
        page.waitForTimeout(1500);

        // Verify flag was created
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("Flag should be created before editing")
                .isTrue();

        // Click edit button to open the edit form
        dashboardPage.clickFlag(TEST_FLAG_KEY);
        page.waitForTimeout(1000);

        // Verify form is visible
        assertThat(flagFormPage.isFormVisible())
                .as("Flag edit form should be visible")
                .isTrue();

        // Update the flag name and description
        String newName = "Updated Test Flag";
        String newDescription = "This flag has been updated";

        flagFormPage.fillFlagName(newName);
        flagFormPage.fillDescription(newDescription);

        // Change the default variant from "on" to "off"
        flagFormPage.selectDefaultVariant("off");

        // Save the changes
        flagFormPage.clickSave();
        page.waitForTimeout(1500);

        // Verify the flag still exists after edit
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("Flag should still exist after editing")
                .isTrue();

        // Verify the toggle state changed to "off"
        boolean toggleState = page.locator(String.format("[data-testid='flag-toggle-%s']", TEST_FLAG_KEY)).isChecked();
        assertThat(toggleState)
                .as("Flag should be 'off' (unchecked) after edit")
                .isFalse();
    }

    @Test
    @Order(5)
    @DisplayName("Export feature flags")
    void exportFeatureFlags() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);
        ExportDialogPage exportDialog = new ExportDialogPage(page);

        // Create first flag
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY,
                TEST_FLAG_NAME,
                TEST_FLAG_DESCRIPTION,
                TEST_FLAG_AREA,
                "on"
        );
        page.waitForTimeout(1500);

        // Create second flag
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY_2,
                TEST_FLAG_NAME_2,
                TEST_FLAG_DESCRIPTION_2,
                TEST_FLAG_AREA_2,
                "off"
        );
        page.waitForTimeout(1500);

        // Click Export button
        dashboardPage.clickExport();
        page.waitForTimeout(1000);

        // Verify export dialog is visible
        assertThat(exportDialog.isDialogVisible())
                .as("Export dialog should be visible")
                .isTrue();

        // Get the exported content
        String exportedContent = exportDialog.getExportedContent();

        // Verify the exported content contains both flags
        assertThat(exportedContent)
                .as("Exported content should not be null")
                .isNotNull();

        assertThat(exportDialog.exportContainsFlag(TEST_FLAG_KEY))
                .as("Export should contain first flag")
                .isTrue();

        assertThat(exportDialog.exportContainsFlag(TEST_FLAG_KEY_2))
                .as("Export should contain second flag")
                .isTrue();

        // Close the export dialog
        exportDialog.clickClose();
        page.waitForTimeout(500);

        // Verify dialog is closed
        assertThat(exportDialog.isDialogVisible())
                .as("Export dialog should be closed")
                .isFalse();
    }

    @Test
    @Order(6)
    @DisplayName("View changelog after flag changes")
    void viewChangelogAfterFlagChanges() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);
        ChangelogPage changelogPage = new ChangelogPage(page);

        // Create a boolean flag with default value "on"
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY,
                TEST_FLAG_NAME,
                TEST_FLAG_DESCRIPTION,
                TEST_FLAG_AREA,
                "on"
        );
        page.waitForTimeout(1500);

        // Verify flag was created
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY))
                .as("Flag should be created before changing value")
                .isTrue();

        // Toggle the flag value (from "on" to "off")
        dashboardPage.toggleFlag(TEST_FLAG_KEY);
        page.waitForTimeout(1000);

        // Click Changelogs button
        dashboardPage.clickChangelogs();
        page.waitForTimeout(1000);

        // Verify changelog dialog is visible
        assertThat(changelogPage.isChangelogVisible())
                .as("Changelog dialog should be visible")
                .isTrue();

        // Verify changelog contains at least one entry
        assertThat(changelogPage.getChangelogCount())
                .as("Changelog should contain at least one entry")
                .isGreaterThan(0);

        // Verify the latest changelog entry contains the flag key
        assertThat(changelogPage.changelogContains(TEST_FLAG_KEY))
                .as("Changelog should contain the flag key that was changed")
                .isTrue();

        // Close the changelog dialog
        changelogPage.clickClose();
        page.waitForTimeout(500);

        // Verify dialog is closed
        assertThat(changelogPage.isChangelogVisible())
                .as("Changelog dialog should be closed")
                .isFalse();
    }

    @Test
    @Order(7)
    @DisplayName("Create string flag and change variant")
    void createStringFlagAndChangeVariant() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);

        // Create a string type flag
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);

        // Verify form is visible
        assertThat(flagFormPage.isFormVisible())
                .as("Flag creation form should be visible")
                .isTrue();

        // Fill in basic flag details
        flagFormPage.fillFlagKey(TEST_STRING_FLAG_KEY);
        flagFormPage.fillFlagName(TEST_STRING_FLAG_NAME);
        flagFormPage.fillDescription(TEST_STRING_FLAG_DESCRIPTION);
        flagFormPage.fillArea(TEST_STRING_FLAG_AREA);

        // Select string type (not boolean)
        flagFormPage.selectFlagType("string");
        page.waitForTimeout(500);

        // Define variants: LOW, MEDIUM, HIGH
        flagFormPage.fillVariantKeys("LOW,MEDIUM,HIGH");

        // Set variant values: A, B, C
        flagFormPage.fillVariantValue("LOW", "A");
        flagFormPage.fillVariantValue("MEDIUM", "B");
        flagFormPage.fillVariantValue("HIGH", "C");

        // Set default variant to LOW
        flagFormPage.selectDefaultVariant("LOW");

        // Save the flag
        flagFormPage.clickSave();
        page.waitForTimeout(1500);

        // Verify the string flag was created
        assertThat(dashboardPage.flagExists(TEST_STRING_FLAG_KEY))
                .as("String flag should be created")
                .isTrue();

        // Now change the variant from LOW to MEDIUM
        // For string flags, the dashboard should show radio buttons for variants
        // Click on the MEDIUM variant label (the input is hidden, so we click the label)
        page.locator(String.format("[data-testid='flag-card-%s'] label:has-text('MEDIUM')", TEST_STRING_FLAG_KEY)).click();
        page.waitForTimeout(1000);

        // Verify the variant changed by checking which radio button is selected
        boolean mediumSelected = page.locator(String.format("[data-testid='flag-card-%s'] input[value='MEDIUM']", TEST_STRING_FLAG_KEY)).isChecked();
        assertThat(mediumSelected)
                .as("MEDIUM variant should be selected after change")
                .isTrue();

        // Verify LOW is no longer selected
        boolean lowSelected = page.locator(String.format("[data-testid='flag-card-%s'] input[value='LOW']", TEST_STRING_FLAG_KEY)).isChecked();
        assertThat(lowSelected)
                .as("LOW variant should not be selected after change")
                .isFalse();
    }

    @Test
    @Order(8)
    @DisplayName("Filter feature flags by area")
    void filterFeatureFlagsByArea() {
        DashboardPage dashboardPage = new DashboardPage(page);
        FlagFormPage flagFormPage = new FlagFormPage(page);

        // Create first flag in area-1
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY_3,
                TEST_FLAG_NAME_3,
                TEST_FLAG_DESCRIPTION_3,
                TEST_FLAG_AREA_3,
                "on"
        );
        page.waitForTimeout(1500);

        // Create second flag in area-2
        dashboardPage.clickCreateFlag();
        page.waitForTimeout(1000);
        flagFormPage.createBooleanFlag(
                TEST_FLAG_KEY_4,
                TEST_FLAG_NAME_4,
                TEST_FLAG_DESCRIPTION_4,
                TEST_FLAG_AREA_4,
                "off"
        );
        page.waitForTimeout(1500);

        // Verify both flags exist before filtering
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_3))
                .as("Flag in area-1 should exist before filtering")
                .isTrue();
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_4))
                .as("Flag in area-2 should exist before filtering")
                .isTrue();

        // Click on area-1 in the sidebar to filter
        dashboardPage.clickArea(TEST_FLAG_AREA_3);
        page.waitForTimeout(1000);

        // Verify only the flag from area-1 is visible
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_3))
                .as("Flag from area-1 should be visible after filtering by area-1")
                .isTrue();

        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_4))
                .as("Flag from area-2 should NOT be visible after filtering by area-1")
                .isFalse();

        // Click on area-2 to filter by that area
        dashboardPage.clickArea(TEST_FLAG_AREA_4);
        page.waitForTimeout(1000);

        // Verify only the flag from area-2 is visible
        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_4))
                .as("Flag from area-2 should be visible after filtering by area-2")
                .isTrue();

        assertThat(dashboardPage.flagExists(TEST_FLAG_KEY_3))
                .as("Flag from area-1 should NOT be visible after filtering by area-2")
                .isFalse();
    }
}
