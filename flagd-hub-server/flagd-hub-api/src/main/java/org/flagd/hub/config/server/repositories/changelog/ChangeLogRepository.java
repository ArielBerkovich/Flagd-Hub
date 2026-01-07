package org.flagd.hub.config.server.repositories.changelog;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChangeLogRepository extends CrudRepository<ChangelogEvents, String> {
}
