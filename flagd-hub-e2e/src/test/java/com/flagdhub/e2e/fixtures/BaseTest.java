package com.flagdhub.e2e.fixtures;

import com.flagdhub.e2e.utils.TestConfig;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import java.nio.file.Paths;

/**
 * Base test class that sets up Playwright browser and context for each test.
 */
public abstract class BaseTest {
    protected static Playwright playwright;
    protected static Browser browser;
    protected BrowserContext context;
    protected Page page;

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions()
                        .setHeadless(TestConfig.HEADLESS)
                        .setSlowMo(TestConfig.SLOW_MO)
        );
    }

    @AfterAll
    static void closeBrowser() {
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }

    @BeforeEach
    void createContextAndPage() {
        context = browser.newContext(
                new Browser.NewContextOptions()
                        .setBaseURL(TestConfig.BASE_URL)
                        .setViewportSize(1920, 1080)
        );

        // Enable tracing for debugging
        context.tracing().start(new Tracing.StartOptions()
                .setScreenshots(true)
                .setSnapshots(true)
                .setSources(true)
        );

        page = context.newPage();
        page.setDefaultTimeout(TestConfig.DEFAULT_TIMEOUT);
    }

    @AfterEach
    void closeContext() {
        if (context != null) {
            // Save trace on failure
            String testName = getClass().getSimpleName();
            context.tracing().stop(new Tracing.StopOptions()
                    .setPath(Paths.get("build/traces/" + testName + "-trace.zip"))
            );
            context.close();
        }
    }

    /**
     * Navigate to a path relative to BASE_URL
     */
    protected void navigateTo(String path) {
        page.navigate(TestConfig.BASE_URL + path);
    }

    /**
     * Wait for network to be idle
     */
    protected void waitForNetworkIdle() {
        page.waitForLoadState(LoadState.NETWORKIDLE);
    }
}
