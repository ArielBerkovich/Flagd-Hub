package org.flagd.hub.config.server.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.changelog.ChangelogEvents;
import org.flagd.hub.config.server.repositories.featureflags.FeatureFlagEntity;
import org.flagd.hub.rest.model.ChangelogEvent;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Log4j2
@RequiredArgsConstructor
@Service
public class FeatureFlagsService {
    @Autowired
    private final CrudRepository<FeatureFlagEntity, String> featureFlagsRepository;
    @Autowired
    private final CrudRepository<ChangelogEvents, String> changelogEventsRepositories;

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
        Optional<FeatureFlagEntity> optionalFeatureFlagEntity = featureFlagsRepository.findById(flagKey);
        if (optionalFeatureFlagEntity.isEmpty()) {
            log.warn("flag '{}' not found", flagKey);
            return false;
        }
        FeatureFlagEntity featureFlagEntity = optionalFeatureFlagEntity.get();
        if(!isVariantExist(newDefaultVariant, featureFlagEntity)){
            log.warn("variant '{}' does not exist in flag '{}'", newDefaultVariant, flagKey);
            return false;
        }

        long nowTime = Instant.now().toEpochMilli();
        ChangelogEvents changelogEvents = getChangelog(flagKey);
        FeatureFlag featureFlag = featureFlagEntity.getValue();
        changelogEvents.getChangelogEventsList().add(
                new ChangelogEvent().previousVariant(featureFlag.getDefaultVariant())
                        .updatedVariant(newDefaultVariant)
                        .timestamp(nowTime));

        featureFlag.setDefaultVariant(newDefaultVariant);
        featureFlag.wasChanged(true);
        featureFlagsRepository.save(featureFlagEntity);
        changelogEventsRepositories.save(changelogEvents);
        return true;
    }

    public List<ChangelogEvents> getChangeLogs(){
        return StreamSupport.stream(changelogEventsRepositories.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public List<ChangelogEvent> getEvents(String flagKey) {
        return getChangelog(flagKey).getChangelogEventsList();
    }

    private static boolean isVariantExist(String newDefaultVariant,FeatureFlagEntity featureFlagEntity) {
        return featureFlagEntity.getValue()
                .getVariants()
                .containsKey(newDefaultVariant);
    }

    public void deleteFlag(String flagKey) {
        featureFlagsRepository.deleteById(flagKey);
        changelogEventsRepositories.deleteById(flagKey);
        log.info("flag {} deleted", flagKey);
    }

    public void updateFlagTargeting(String flagKey, Object targeting) {
        featureFlagsRepository.findById(flagKey).ifPresent(featureFlagEntity -> {
            featureFlagEntity.getValue().setTargeting(targeting);
            featureFlagsRepository.save(featureFlagEntity);
        });
    }

    private ChangelogEvents getChangelog(String flagKey) {
        return changelogEventsRepositories.findById(flagKey).orElseGet(() -> new ChangelogEvents(flagKey));
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
