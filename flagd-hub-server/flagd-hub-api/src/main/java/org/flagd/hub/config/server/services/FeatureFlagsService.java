package org.flagd.hub.config.server.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.FeatureFlagsRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log4j2
@RequiredArgsConstructor
@Service
public class FeatureFlagsService {
    private final FeatureFlagsRepository featureFlagsRepository;

    public List<FeatureFlag> getAllFlags() {
        List<FeatureFlag> allFlags = featureFlagsRepository.getAll();
        log.debug("return all flags: {}", allFlags);

        return allFlags;
    }

    public Optional<FeatureFlag> getFlagByKey(String flagKey) {
        return featureFlagsRepository.getFlagByKey(flagKey);
    }

    public void createFlag(FeatureFlag featureFlag) {
        featureFlagsRepository.putFlag(featureFlag.getKey(), featureFlag);
    }

    public void updateFlagDefaultVariant(String flagKey, String newDefaultVariant) {
        featureFlagsRepository.updateFlagDefaultVariant(flagKey, newDefaultVariant);
    }

    public void deleteFlag(String flagKey) {
        featureFlagsRepository.deleteFlag(flagKey);
    }

    public void updateFlagTargeting(String flagKey, Object targeting) {
        featureFlagsRepository.setFlagTargeting(flagKey, targeting);
    }

    public Optional<Object> getFlagTargeting(String flagKey) {
        return featureFlagsRepository.getFlagTargeting(flagKey);
    }

    public void deleteFlagTargeting(String flagKey) {
        featureFlagsRepository.deleteFlagTargeting(flagKey);
    }
}
