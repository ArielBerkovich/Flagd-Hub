package org.flagd.hub.config.server.repositories;

import org.springframework.data.repository.CrudRepository;

public interface FeatureFlagRepository extends CrudRepository<FeatureFlagEntity, String> {
}
