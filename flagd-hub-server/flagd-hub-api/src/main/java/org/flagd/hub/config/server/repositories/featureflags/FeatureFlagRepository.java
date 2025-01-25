package org.flagd.hub.config.server.repositories.featureflags;

import org.springframework.data.repository.CrudRepository;

public interface FeatureFlagRepository extends CrudRepository<FeatureFlagEntity, String> {
}
