# Flagd Hub E2E Tests

End-to-end tests for Flagd Hub using Playwright for Java.

## Prerequisites

- Java 17 or higher
- Gradle (wrapper included)
- Flagd Hub application running locally (default: http://localhost:3000)

## Project Structure

```
flagd-hub-e2e/
├── src/test/java/com/flagdhub/e2e/
│   ├── tests/              # Test classes
│   │   ├── LoginTest.java
│   │   ├── FeatureFlagTest.java
│   │   └── SmokeTest.java
│   ├── pages/              # Page Object Model classes
│   │   ├── LoginPage.java
│   │   ├── DashboardPage.java
│   │   └── FeatureFlagsPage.java
│   ├── fixtures/           # Test fixtures and base classes
│   │   └── BaseTest.java
│   └── utils/              # Utilities and helpers
│       ├── TestConfig.java
│       └── AuthHelper.java
└── build.gradle            # Gradle build configuration
```

## Running Tests

### Run all tests (headless mode)
```bash
./gradlew test
```

### Run tests in headed mode (see browser)
```bash
./gradlew testHeaded
```

### Run tests with debug mode (slower execution)
```bash
./gradlew testDebug
```

### Run specific test class
```bash
./gradlew test --tests "com.flagdhub.e2e.tests.LoginTest"
```

### Run with custom configuration
```bash
./gradlew test -Dbase.url=http://localhost:3000 -Dapi.url=http://localhost:8090
```

## Configuration

Tests can be configured using system properties:

| Property | Default | Description |
|----------|---------|-------------|
| `base.url` | `http://localhost:3000` | Base URL of the UI application |
| `api.url` | `http://localhost:8090` | Base URL of the API |
| `playwright.headless` | `true` | Run browser in headless mode |
| `playwright.slowMo` | `0` | Slow down operations by N milliseconds |

## Test Credentials

Default credentials (configured in `TestConfig.java`):
- Username: `admin`
- Password: `admin`

## Writing Tests

### Basic Test Structure

```java
@DisplayName("My Feature Tests")
class MyFeatureTest extends BaseTest {

    @Test
    @DisplayName("Should do something")
    void shouldDoSomething() {
        // Arrange
        LoginPage loginPage = new LoginPage(page);

        // Act
        loginPage.navigate();
        loginPage.login("admin", "admin");

        // Assert
        assertThat(page.url()).contains("/dashboard");
    }
}
```

### Using Page Objects

```java
LoginPage loginPage = new LoginPage(page);
loginPage.navigate()
         .fillUsername("admin")
         .fillPassword("admin")
         .clickLogin();
```

### Using Helpers

```java
// Login with default credentials
AuthHelper.loginWithDefaultCredentials(page);

// Check if logged in
boolean loggedIn = AuthHelper.isLoggedIn(page);
```

## Test Reports

After running tests, reports are available in:
- HTML Report: `build/reports/tests/test/index.html`
- JUnit XML: `build/test-results/test/`
- Traces: `build/traces/` (for debugging failures)

## Debugging Tests

### View traces for failed tests
```bash
npx playwright show-trace build/traces/LoginTest-trace.zip
```

### Run single test in debug mode
```bash
./gradlew test --tests "LoginTest.shouldLoginWithValidCredentials" -Dplaywright.headless=false -Dplaywright.slowMo=500
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run E2E Tests
  run: ./gradlew test
  working-directory: flagd-hub-e2e
```

## Best Practices

1. **Use Page Objects** - Encapsulate page interactions in Page Object classes
2. **Use BaseTest** - Extend `BaseTest` for automatic browser setup/teardown
3. **Use Meaningful Names** - Test methods and display names should be descriptive
4. **Wait for Elements** - Use built-in waiting mechanisms, avoid `Thread.sleep()`
5. **Independent Tests** - Each test should be independent and able to run in any order
6. **Clean Up** - `BaseTest` handles browser cleanup automatically
7. **Use Assertions** - Use AssertJ for fluent, readable assertions

## Troubleshooting

### Tests fail with timeout
- Increase timeout in `TestConfig.java`
- Check if application is running
- Run with `playwright.headless=false` to see what's happening

### Browser not found
```bash
npx playwright install chromium
```

### Connection refused
- Ensure Flagd Hub is running at the configured URLs
- Check `docker-compose` status: `docker compose ps`

## Additional Resources

- [Playwright Java Documentation](https://playwright.dev/java/)
- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [AssertJ Documentation](https://assertj.github.io/doc/)
