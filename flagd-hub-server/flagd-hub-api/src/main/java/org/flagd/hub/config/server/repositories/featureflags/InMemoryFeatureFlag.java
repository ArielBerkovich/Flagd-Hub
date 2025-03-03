package org.flagd.hub.config.server.repositories.featureflags;

import org.flagd.hub.config.server.repositories.AbstractInMemoryRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(value = "USE_IN_MEMORY_DATABASE", havingValue = "true")
public class InMemoryFeatureFlag extends AbstractInMemoryRepository<FeatureFlagEntity, String> {

    @Override
    public <S extends FeatureFlagEntity> S save(S entity) {
        return super.save(entity, entity.getId());
    }

    @Override
    public <S extends FeatureFlagEntity> Iterable<S> saveAll(Iterable<S> entities) {
        entities.forEach(entity->super.save(entity, entity.getId()));
        return null;
    }
}

