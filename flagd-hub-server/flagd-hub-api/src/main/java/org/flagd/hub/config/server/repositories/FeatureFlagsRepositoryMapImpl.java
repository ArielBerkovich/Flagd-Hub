package org.flagd.hub.config.server.repositories;

import lombok.RequiredArgsConstructor;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class FeatureFlagsRepositoryMapImpl implements FeatureFlagsRepository {
    private final Map<String, FeatureFlag> map;

    @Override
    public Optional<FeatureFlag> getFlagByKey(String flagKey) {
        return Optional.ofNullable(map.get(flagKey));
    }

    @Override
    public List<FeatureFlag> getAll() {
        return map.values().stream().toList();
    }

    @Override
    public void putFlag(String flagKey, FeatureFlag featureFlag) {
        map.put(flagKey, featureFlag);
    }

    @Override
    public void deleteFlag(String flagKey) {
        map.remove(flagKey);
    }

    @Override
    public void updateFlagDefaultVariant(String flagKey, String defaultVariant) {
        getFlagByKey(flagKey)
                .ifPresent((FeatureFlag featureFlag) -> featureFlag.setDefaultVariant(defaultVariant));
    }

    @Override
    public Optional<Object> getFlagTargeting(String flagKey) {
        return getFlagByKey(flagKey).map(FeatureFlag::getTargeting);
    }

    @Override
    public void setFlagTargeting(String flagKey, Object targeting) {
        getFlagByKey(flagKey)
                .ifPresent((FeatureFlag featureFlag) -> featureFlag.setTargeting(targeting));
    }

    @Override
    public void deleteFlagTargeting(String flagKey) {
        getFlagByKey(flagKey)
                .ifPresent((FeatureFlag featureFlag) -> featureFlag.setTargeting(null));
    }
}
