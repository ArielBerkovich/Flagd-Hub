package org.flagd.hub.example.services;

import dev.openfeature.sdk.Client;
import dev.openfeature.sdk.OpenFeatureAPI;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class ExampleService {
//    private final OpenFeatureAPI openFeatureAPI;
    private final Client client;

    public ExampleService(Client client) {
        this.client = client;
    }

    public String getTheme() {
        return client.getStringValue("theme", "no-theme");
    }

    public boolean runFeature() {
        log.info("Checking feature flag...");

        if (client.getBooleanValue("bool-flag", false)) {
            log.info("Running feature! flag is true");
            return true;
        }

        return false;
    }
}
