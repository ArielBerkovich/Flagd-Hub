package org.flagd.hub.config.server.repositories.featureflags;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureFlagRepository extends CrudRepository<FeatureFlagEntity, String> {
}
