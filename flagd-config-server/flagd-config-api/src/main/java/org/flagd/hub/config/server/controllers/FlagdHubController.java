package org.flagd.hub.config.server.controllers;

import lombok.extern.log4j.Log4j2;
import org.flagd.hub.rest.api.FlagsHubApi;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.List;

@Log4j2
@Controller
public class FlagdHubController implements FlagsHubApi {

    @Override
    public ResponseEntity<List<FeatureFlag>> getFlags() {
        log.info("example endpoint");
        return ResponseEntity.ok(List.of(new FeatureFlag().name("a")));
    }

    @Override
    public ResponseEntity<FeatureFlag> getFlag(String flagKey) {
        return null;
    }

    @Override
    public ResponseEntity<Void> createFlag(FeatureFlag featureFlag) {
        return null;
    }

    @Override
    public ResponseEntity<Void> updateFlagValue(String flagKey, String body) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteFlag(String flagKey) {
        return null;
    }

    @Override
    public ResponseEntity<Object> getFlagTargeting(String flagKey) {
        return null;
    }

    @Override
    public ResponseEntity<Void> addFlagTargeting(String flagKey, Object body) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteFlagTargeting(String flagKey) {
        return null;
    }
}
