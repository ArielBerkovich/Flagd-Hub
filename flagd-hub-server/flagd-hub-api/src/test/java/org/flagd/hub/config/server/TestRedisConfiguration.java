package org.flagd.hub.config.server;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@TestConfiguration
@EnableRedisRepositories(basePackages = "org.flagd.hub.config.server.repositories")
public class TestRedisConfiguration {
}
