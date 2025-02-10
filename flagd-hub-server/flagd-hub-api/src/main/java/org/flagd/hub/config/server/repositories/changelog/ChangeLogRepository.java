package org.flagd.hub.config.server.repositories.changelog;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
@ConditionalOnProperty(value = "USE_IN_MEMORY_DATABASE", havingValue = "false")
public interface ChangeLogRepository extends CrudRepository<ChangelogEvents, String> {
}
