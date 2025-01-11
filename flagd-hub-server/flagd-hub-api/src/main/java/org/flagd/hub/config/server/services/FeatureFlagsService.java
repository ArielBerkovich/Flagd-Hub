package org.flagd.hub.config.server.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.FeatureFlagRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Log4j2
@RequiredArgsConstructor
@Service
public class FeatureFlagsService {
    @Autowired
    private final FeatureFlagRepository featureFlagRepository;

    public List<FeatureFlag> getAllFlags() {
        List<FeatureFlag> allFlags = new ArrayList<>();
        featureFlagRepository.findAll().forEach(allFlags::add);
        log.debug("return all flags: {}", allFlags);

        return allFlags;
    }

    public Optional<FeatureFlag> getFlagByKey(String flagKey) {
        return featureFlagRepository.findById(flagKey);
    }

    public void createFlag(FeatureFlag featureFlag) {
        log.info("creating new flag: {}", featureFlag);
        featureFlagRepository.save(featureFlag);
    }

    public boolean updateFlagDefaultVariant(String flagKey, String newDefaultVariant) {
        log.info("update flag '{}' value to: {}", flagKey, newDefaultVariant);

        boolean isVariantExist = featureFlagRepository.findById(flagKey)
                .map(FeatureFlag::getVariants)
                .filter((Map<String, String> variants) -> variants.containsKey(newDefaultVariant))
                .isPresent();

        if (isVariantExist) {
//            featureFlagRepository.updateFlagDefaultVariant(flagKey, newDefaultVariant);
        } else {
            log.warn("{} is not a variant of flag {}", newDefaultVariant, flagKey);
        }

        return isVariantExist;
    }

    public void deleteFlag(String flagKey) {
        featureFlagRepository.deleteById(flagKey);
        log.info("flag {} deleted", flagKey);
    }

    public void updateFlagTargeting(String flagKey, Object targeting) {
        // TODO: fixme
//        featureFlagsRepository.setFlagTargeting(flagKey, targeting);
    }

    public Optional<Object> getFlagTargeting(String flagKey) {
        // TODO: fixme
//        return featureFlagsRepository.getFlagTargeting(flagKey);
        return Optional.empty();
    }

    public void deleteFlagTargeting(String flagKey) {
        // TODO: fixme
//        featureFlagsRepository.deleteFlagTargeting(flagKey);
    }
}
