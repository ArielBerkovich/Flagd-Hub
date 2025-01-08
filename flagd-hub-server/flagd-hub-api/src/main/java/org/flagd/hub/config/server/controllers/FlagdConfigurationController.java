package org.flagd.hub.config.server.controllers;

import lombok.RequiredArgsConstructor;
import org.flagd.hub.config.server.services.FlagdConfigurationService;
import org.flagd.hub.rest.api.FlagdConfigurationApi;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class FlagdConfigurationController implements FlagdConfigurationApi {
    private final FlagdConfigurationService flagdConfigurationService;
    @Override
    public ResponseEntity<Object> getFlagdConfiguration() {
        return ResponseEntity.ok(flagdConfigurationService.getFlagdConfiguration());
    }
}
