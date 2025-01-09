package org.flagd.hub.config.server.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.FeatureFlagsRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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
        log.info("creating new flag: {}", featureFlag);
        featureFlagsRepository.putFlag(featureFlag.getKey(), featureFlag);
    }

    public boolean updateFlagDefaultVariant(String flagKey, String newDefaultVariant) {
        log.info("update flag '{}' value to: {}", flagKey, newDefaultVariant);

        boolean isVariantExist = featureFlagsRepository.getFlagByKey(flagKey)
                .map(FeatureFlag::getVariants)
                .filter((Map<String, String> variants) -> variants.containsKey(newDefaultVariant))
                .isPresent();

        if (isVariantExist) {
            featureFlagsRepository.updateFlagDefaultVariant(flagKey, newDefaultVariant);
        } else {
            log.warn("{} is not a variant of flag {}", newDefaultVariant, flagKey);
        }

        return isVariantExist;
    }

    public void deleteFlag(String flagKey) {
        featureFlagsRepository.deleteFlag(flagKey);
        log.info("flag {} deleted", flagKey);
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
