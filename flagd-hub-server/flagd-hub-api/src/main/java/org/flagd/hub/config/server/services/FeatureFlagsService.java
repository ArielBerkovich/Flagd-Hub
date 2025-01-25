package org.flagd.hub.config.server.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.FeatureFlagEntity;
import org.flagd.hub.config.server.repositories.FeatureFlagRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Log4j2
@RequiredArgsConstructor
@Service
public class FeatureFlagsService {
    @Autowired
    private final FeatureFlagRepository featureFlagsRepository;

    public List<FeatureFlag> getAllFlags() {
        var iterator = featureFlagsRepository.findAll().iterator();
        List<FeatureFlag> allFlags = new ArrayList<>();
        while (iterator.hasNext()) {
            allFlags.add(iterator.next().getValue());
        }

        log.debug("return all flags: {}", allFlags);

        return allFlags;
    }

    public Optional<FeatureFlag> getFlagByKey(String flagKey) {
        return featureFlagsRepository.findById(flagKey).map(FeatureFlagEntity::getValue);
    }

    public void createFlag(FeatureFlag featureFlag) {
        log.info("creating new flag: {}", featureFlag);
        featureFlagsRepository.save(new FeatureFlagEntity(featureFlag.getKey(), featureFlag));
    }

    public boolean updateFlagDefaultVariant(String flagKey, String newDefaultVariant) {
        log.info("update flag '{}' value to: {}", flagKey, newDefaultVariant);
        Optional<FeatureFlagEntity> featureFlagEntity = featureFlagsRepository.findById(flagKey);
        boolean isVariantExist = featureFlagEntity
                .map(FeatureFlagEntity::getValue)
                .map(FeatureFlag::getVariants)
                .filter((Map<String, String> variants) -> variants.containsKey(newDefaultVariant))
                .isPresent();

        if (isVariantExist) {
            featureFlagEntity.get().getValue().setDefaultVariant(newDefaultVariant);
            featureFlagsRepository.save(featureFlagEntity.get());
        } else {
            log.warn("{} is not a variant of flag {}", newDefaultVariant, flagKey);
        }

        return isVariantExist;
    }

    public void deleteFlag(String flagKey) {
        featureFlagsRepository.deleteById(flagKey);
        log.info("flag {} deleted", flagKey);
    }

    public void updateFlagTargeting(String flagKey, Object targeting) {
        featureFlagsRepository.findById(flagKey).ifPresent(featureFlagEntity -> {
            featureFlagEntity.getValue().setTargeting(targeting);
            featureFlagsRepository.save(featureFlagEntity);
        });
    }

    public Optional<Object> getFlagTargeting(String flagKey) {
        return featureFlagsRepository.findById(flagKey)
                .map(FeatureFlagEntity::getValue)
                .map(FeatureFlag::getTargeting);
    }

    public void deleteFlagTargeting(String flagKey) {
        featureFlagsRepository.findById(flagKey).ifPresent(featureFlagEntity -> {
            featureFlagEntity.getValue().setTargeting(null);
            featureFlagsRepository.save(featureFlagEntity);
        });
    }
}
