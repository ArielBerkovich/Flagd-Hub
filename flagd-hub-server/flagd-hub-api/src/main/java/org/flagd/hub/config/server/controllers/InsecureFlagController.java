package org.flagd.hub.config.server.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.services.FeatureFlagsService;
import org.flagd.hub.rest.model.ChangeDefaultVariantRequest;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping("/insecure")
@RequiredArgsConstructor
public class InsecureFlagController {
    private final FeatureFlagsService featureFlagsService;

    /**
     * Get a specific flag by key
     * @param flagKey the flag key
     * @return the feature flag
     */
    @GetMapping("/flags/{flagKey}")
    public ResponseEntity<FeatureFlag> getFlag(@PathVariable String flagKey) {
        log.debug("Insecure endpoint: Getting flag with key: {}", flagKey);
        return featureFlagsService.getFlagByKey(flagKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update a flag's default variant
     * @param flagKey the flag key
     * @param request the change default variant request
     * @return response entity
     */
    @PutMapping("/flags/{flagKey}")
    public ResponseEntity<Void> updateFlagValue(
            @PathVariable String flagKey,
            @RequestBody ChangeDefaultVariantRequest request) {
        log.debug("Insecure endpoint: Updating flag {} with default variant: {}",
                  flagKey, request.getDefaultVariant());

        boolean isSuccess = featureFlagsService.updateFlagDefaultVariant(flagKey, request.getDefaultVariant());

        if (isSuccess) {
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}
