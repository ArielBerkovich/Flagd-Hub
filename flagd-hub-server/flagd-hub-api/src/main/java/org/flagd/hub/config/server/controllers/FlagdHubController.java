package org.flagd.hub.config.server.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.changelog.ChangelogEvents;
import org.flagd.hub.config.server.services.FeatureFlagsService;
import org.flagd.hub.rest.api.FlagsHubApi;
import org.flagd.hub.rest.model.ChangeDefaultVariantRequest;
import org.flagd.hub.rest.model.ChangelogEvent;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@Controller
@RequiredArgsConstructor
public class FlagdHubController implements FlagsHubApi {
    private final FeatureFlagsService featureFlagsService;

    @Override
    public ResponseEntity<List<FeatureFlag>> getFlags() {
        return ResponseEntity.ok(featureFlagsService.getAllFlags());
    }

    @Override
    public ResponseEntity<Map<String, ChangelogEvent>> getFlagsChangelogs() {
        Map<String, ChangelogEvent> changeLogs = featureFlagsService.getChangeLogs().stream()
                .collect(Collectors.toMap(ChangelogEvents::getFlagKey,
                        (ChangelogEvents changelogEvents) -> changelogEvents.getChangelogEventsList().getFirst()));

        return ResponseEntity.ok(changeLogs);
    }

    @Override
    public ResponseEntity<FeatureFlag> getFlag(String flagKey) {
        return featureFlagsService.getFlagByKey(flagKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<ChangelogEvent>> getFlagChangelog(String flagKey) {
        return ResponseEntity.ok(featureFlagsService.getEvents(flagKey));
    }

    @Override
    public ResponseEntity<Void> createFlag(FeatureFlag featureFlag) {
        featureFlagsService.createFlag(featureFlag);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> updateFlagValue(String flagKey, ChangeDefaultVariantRequest request) {
        boolean isSuccess = featureFlagsService.updateFlagDefaultVariant(flagKey, request.getDefaultVariant());

        if (isSuccess) {
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @Override
    public ResponseEntity<Void> deleteFlag(String flagKey) {
        featureFlagsService.deleteFlag(flagKey);

        return ResponseEntity.accepted().build();
    }

    @Override
    public ResponseEntity<Object> getFlagTargeting(String flagKey) {
        return featureFlagsService.getFlagTargeting(flagKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> addFlagTargeting(String flagKey, Object body) {
        featureFlagsService.updateFlagTargeting(flagKey, body);

        return ResponseEntity.accepted().build();
    }

    @Override
    public ResponseEntity<Void> deleteFlagTargeting(String flagKey) {
        featureFlagsService.deleteFlagTargeting(flagKey);

        return ResponseEntity.accepted().build();
    }
}
