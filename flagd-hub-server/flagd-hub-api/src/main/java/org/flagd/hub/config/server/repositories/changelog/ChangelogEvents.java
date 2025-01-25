package org.flagd.hub.config.server.repositories.changelog;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.flagd.hub.rest.model.ChangelogEvent;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@RedisHash("featureFlagChangelog")
@NoArgsConstructor
@Data
public class ChangelogEvents implements Serializable {
    @Id
    private String flagKey;
    private List<ChangelogEvent> changelogEventsList;

    public ChangelogEvents(String flagKey){
        this.flagKey = flagKey;
        this.changelogEventsList = new ArrayList<>();
    }
}
