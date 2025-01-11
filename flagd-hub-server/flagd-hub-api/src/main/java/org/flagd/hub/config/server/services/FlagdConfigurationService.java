package org.flagd.hub.config.server.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.flagd.hub.config.server.FlagdConfigurationConverter;
import org.flagd.hub.config.server.repositories.FeatureFlagRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

//@Service
//@RequiredArgsConstructor
//public class FlagdConfigurationService {
//    @Autowired
//    private final FeatureFlagRepository featureFlagRepository;
//
//    public ObjectNode getFlagdConfiguration() {
//        List<FeatureFlag> allFeatureFlags = new ArrayList<>();
//        featureFlagRepository.findAll().forEach(allFeatureFlags::add);
//        return FlagdConfigurationConverter.convertToFlagdFormat(allFeatureFlags);
//    }
//}
