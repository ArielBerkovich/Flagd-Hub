package org.flagd.hub.example.config;

import dev.openfeature.contrib.providers.flagd.FlagdProvider;
import dev.openfeature.sdk.Client;
import dev.openfeature.sdk.OpenFeatureAPI;
import dev.openfeature.sdk.exceptions.OpenFeatureError;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {
    @Bean
    public OpenFeatureAPI OpenFeatureAPI() {
        final OpenFeatureAPI openFeatureAPI = OpenFeatureAPI.getInstance();

        // Use flagd as the OpenFeature provider and use default configurations
        try {
            openFeatureAPI.setProvider(new FlagdProvider());
        } catch (OpenFeatureError e) {
            throw new RuntimeException("Failed to set OpenFeature provider", e);
        }

        return openFeatureAPI;
    }

    @Bean
    public Client getClient(OpenFeatureAPI openFeatureAPI) {
        return openFeatureAPI.getClient();
    }
}
