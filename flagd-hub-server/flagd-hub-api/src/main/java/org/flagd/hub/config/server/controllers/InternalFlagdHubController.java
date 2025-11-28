package org.flagd.hub.config.server.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.services.FeatureFlagsService;
import org.flagd.hub.rest.api.InternalFlagsApi;
import org.flagd.hub.rest.model.ChangeDefaultVariantRequest;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.List;

@Log4j2
@Controller
@RequiredArgsConstructor
public class InternalFlagdHubController implements InternalFlagsApi {
    private final FeatureFlagsService featureFlagsService;

    @Override
    public ResponseEntity<List<FeatureFlag>> getFlagsInternal() {
        return ResponseEntity.ok(featureFlagsService.getAllFlags());
    }

    @Override
    public ResponseEntity<FeatureFlag> getFlagInternal(String flagKey) {
        return featureFlagsService.getFlagByKey(flagKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> createFlagInternal(FeatureFlag featureFlag) {
        featureFlagsService.createFlag(featureFlag);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> updateFlagValueInternal(String flagKey, ChangeDefaultVariantRequest request) {
        boolean isSuccess = featureFlagsService.updateFlagDefaultVariant(flagKey, request.getDefaultVariant());

        if (isSuccess) {
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @Override
    public ResponseEntity<Void> deleteFlagInternal(String flagKey) {
        featureFlagsService.deleteFlag(flagKey);
        return ResponseEntity.accepted().build();
    }

    @Override
    public ResponseEntity<Object> getFlagTargetingInternal(String flagKey) {
        return featureFlagsService.getFlagTargeting(flagKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> addFlagTargetingInternal(String flagKey, Object body) {
        featureFlagsService.updateFlagTargeting(flagKey, body);
        return ResponseEntity.accepted().build();
    }

    @Override
    public ResponseEntity<Void> deleteFlagTargetingInternal(String flagKey) {
        featureFlagsService.deleteFlagTargeting(flagKey);
        return ResponseEntity.accepted().build();
    }
}
