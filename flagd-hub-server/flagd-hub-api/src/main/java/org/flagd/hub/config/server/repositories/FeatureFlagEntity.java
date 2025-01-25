package org.flagd.hub.config.server.repositories;

import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@RedisHash("featureFlag")
public class FeatureFlagEntity implements Serializable {
    @Id
    private String id;
    private FeatureFlag value;

    public FeatureFlagEntity(String id, FeatureFlag value) {
        this.id = id;
        this.value = value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public FeatureFlag getValue() {
        return value;
    }

    public void setValue(FeatureFlag value) {
        this.value = value;
    }
}
