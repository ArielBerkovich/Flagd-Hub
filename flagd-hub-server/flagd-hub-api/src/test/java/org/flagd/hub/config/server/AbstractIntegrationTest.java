package org.flagd.hub.config.server;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {Application.class, TestRedisConfiguration.class})
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    // Singleton Redis container that survives context recreation
    private static final GenericContainer<?> redis;

    static {
        redis = new GenericContainer<>(DockerImageName.parse("redis:7-alpine"))
                .withExposedPorts(6379)
                .withCommand("redis-server", "--requirepass", "testpassword")
                .withReuse(true);
        redis.start();
    }

    @DynamicPropertySource
    static void configureRedis(DynamicPropertyRegistry registry) {
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", redis::getFirstMappedPort);
        registry.add("spring.redis.password", () -> "testpassword");
    }

    @BeforeAll
    static void setup() {
        // Set test environment variables for authentication
        System.setProperty("ADMIN_USERNAME", "testadmin");
        System.setProperty("ADMIN_PASSWORD", "testpass");
        System.setProperty("SECRET_KEY", "testsecretkeyforjwttokengeneration1234567890");
        System.setProperty("TOKEN_EXPIRATION_IN_HOURS", "24");
    }
}
