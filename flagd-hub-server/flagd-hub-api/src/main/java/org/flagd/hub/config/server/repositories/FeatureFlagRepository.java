package org.flagd.hub.config.server.repositories;

import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureFlagRepository extends CrudRepository<FeatureFlag, String> {
}
