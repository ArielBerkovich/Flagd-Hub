package org.flagd.hub.config.server.repositories.changelog;

import org.springframework.data.repository.CrudRepository;

public interface ChangeLogRepository extends CrudRepository<ChangelogEvents, String> {
}
