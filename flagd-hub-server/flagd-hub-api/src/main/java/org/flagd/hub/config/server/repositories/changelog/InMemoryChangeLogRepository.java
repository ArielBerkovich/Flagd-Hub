package org.flagd.hub.config.server.repositories.changelog;

import org.flagd.hub.config.server.repositories.AbstractInMemoryRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;


@Repository
@ConditionalOnProperty(value = "USE_IN_MEMORY_DATABASE", havingValue = "true")
public class InMemoryChangeLogRepository extends AbstractInMemoryRepository<ChangelogEvents, String> {
    @Override
    public <S extends ChangelogEvents> S save(S entity) {
        return super.save(entity,entity.getFlagKey());
    }

    @Override
    public <S extends ChangelogEvents> Iterable<S> saveAll(Iterable<S> entities) {
        for (S entity : entities) {
            super.save(entity,entity.getFlagKey());
        }
        return null;
    }
}
