package org.flagd.hub.config.server.repositories;

import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeatureFlagsRepository {
    Optional<FeatureFlag> getFlagByKey(String flagKey);
    List<FeatureFlag> getAll();
    void putFlag(String flagKey, FeatureFlag featureFlag);
    void deleteFlag(String flagKey);
    void updateFlagDefaultVariant(String flagKey, String defaultVariant);
    Optional<Object> getFlagTargeting(String flagKey);
    void setFlagTargeting(String flagKey, Object targeting);
    void deleteFlagTargeting(String flagKey);
}
