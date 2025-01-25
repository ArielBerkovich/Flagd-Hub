package org.flagd.hub.config.server.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.flagd.hub.config.server.converters.FlagdConfigurationConverter;
import org.flagd.hub.config.server.repositories.featureflags.FeatureFlagRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlagdConfigurationService {
    @Autowired
    private final FeatureFlagRepository featureFlagsRepository;

    public ObjectNode getFlagdConfiguration() {
        var iterator = featureFlagsRepository.findAll().iterator();
        List<FeatureFlag> allFlags = new ArrayList<>();
        while (iterator.hasNext()) {
            allFlags.add(iterator.next().getValue());
        }

        return FlagdConfigurationConverter.convertToFlagdFormat(allFlags);
    }
}
