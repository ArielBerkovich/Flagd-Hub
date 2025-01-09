package org.flagd.hub.config.server.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.services.FlagdConfigurationService;
import org.flagd.hub.rest.api.FlagdConfigurationApi;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Log4j2
@Controller
@RequiredArgsConstructor
public class FlagdConfigurationController implements FlagdConfigurationApi {
    private final FlagdConfigurationService flagdConfigurationService;
    @Override
    public ResponseEntity<Object> getFlagdConfiguration() {
        log.info("get flagd configuration");
        return ResponseEntity.ok(flagdConfigurationService.getFlagdConfiguration());
    }
}
