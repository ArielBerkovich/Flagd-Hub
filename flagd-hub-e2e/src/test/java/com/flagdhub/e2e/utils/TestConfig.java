package com.flagdhub.e2e.utils;

public class TestConfig {
    public static final String BASE_URL = System.getProperty("base.url", "http://localhost:3000");
    public static final String API_URL = System.getProperty("api.url", "http://localhost:8090");
    public static final boolean HEADLESS = Boolean.parseBoolean(System.getProperty("playwright.headless", "true"));
    public static final int SLOW_MO = Integer.parseInt(System.getProperty("playwright.slowMo", "0"));

    // Default test user credentials
    public static final String DEFAULT_USERNAME = "admin";
    public static final String DEFAULT_PASSWORD = "admin";

    // Timeouts
    public static final int DEFAULT_TIMEOUT = 30000; // 30 seconds
    public static final int SHORT_TIMEOUT = 5000;    // 5 seconds
    public static final int LONG_TIMEOUT = 60000;    // 60 seconds
}
