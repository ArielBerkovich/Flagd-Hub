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
                        (ChangelogEvents changelogEvents) -> changelogEvents.getChangelogEventsList().get(0)));

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
        // Validate that all required fields are present
        if (featureFlag.getKey() == null || featureFlag.getKey().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (featureFlag.getType() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (featureFlag.getDefaultVariant() == null || featureFlag.getDefaultVariant().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validate that variants map is not empty
        if (featureFlag.getVariants() == null || featureFlag.getVariants().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validate that default variant exists in variants map
        if (!featureFlag.getVariants().containsKey(featureFlag.getDefaultVariant())) {
            return ResponseEntity.badRequest().build();
        }

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
        // Check if flag exists before attempting to delete
        if (featureFlagsService.getFlagByKey(flagKey).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        featureFlagsService.deleteFlag(flagKey);
        return ResponseEntity.accepted().build();
    }
}
