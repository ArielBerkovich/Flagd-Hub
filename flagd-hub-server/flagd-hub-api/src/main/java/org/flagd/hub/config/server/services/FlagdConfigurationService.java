package org.flagd.hub.config.server.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.flagd.hub.config.server.FlagdConfigurationConverter;
import org.flagd.hub.config.server.repositories.FeatureFlagsRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlagdConfigurationService {
    private final FeatureFlagsRepository featureFlagsRepository;

    public ObjectNode getFlagdConfiguration() {
        List<FeatureFlag> allFlags = featureFlagsRepository.getAll();
        return FlagdConfigurationConverter.convertToFlagdFormat(allFlags);
    }
}
