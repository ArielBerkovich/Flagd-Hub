package org.flagd.hub.config.server.converters;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.experimental.UtilityClass;
import org.flagd.hub.rest.model.FeatureFlag;

import java.io.IOException;
import java.util.List;

@UtilityClass
public class FlagdConfigurationConverter {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String FLAGS_FIELD = "flags";
    private static final String STATE_FIELD = "state";
    private static final String DEFAULT_VARIANT_FIELD = "defaultVariant";
    private static final String VARIANTS_FIELD = "variants";
    private static final String TARGETING_FIELD = "targeting";

    public static ObjectNode convertToFlagdFormat(List<FeatureFlag> flags) {
        ObjectNode configuration = OBJECT_MAPPER.createObjectNode();
        ObjectNode flagsNode = OBJECT_MAPPER.createObjectNode();

        flags.forEach((FeatureFlag featureFlag) ->
                flagsNode.set(featureFlag.getKey(), convertFlagToFlagdFormat(featureFlag)));

        configuration.set(FLAGS_FIELD, flagsNode);

        return configuration;
    }

    private static ObjectNode convertFlagToFlagdFormat(FeatureFlag featureFlag) {
        ObjectNode flagdFlag = OBJECT_MAPPER.createObjectNode();

        flagdFlag.put(STATE_FIELD, "ENABLED");
        flagdFlag.put(DEFAULT_VARIANT_FIELD, featureFlag.getDefaultVariant());
        flagdFlag.set(VARIANTS_FIELD, getVariantsNode(featureFlag));

        if (featureFlag.getTargeting() != null) {
            ObjectNode targetingNode = OBJECT_MAPPER.valueToTree(featureFlag.getTargeting());
            flagdFlag.set(TARGETING_FIELD, targetingNode);
        }

        return flagdFlag;
    }

    private static ObjectNode getVariantsNode(FeatureFlag featureFlag) {
        ObjectNode variantsNode = OBJECT_MAPPER.createObjectNode();

        switch (featureFlag.getType()) {
            case BOOLEAN -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.put(key, Boolean.parseBoolean(value)));
            case STRING -> featureFlag.getVariants().forEach(variantsNode::put);
            case INTEGER -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.put(key, Integer.parseInt(value)));
            case FLOAT -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.put(key, Float.parseFloat(value)));
            case OBJECT -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.set(key, getObjectValue(value)));
        }

        return variantsNode;
    }

    private static JsonNode getObjectValue(String value) {
        try {
            return OBJECT_MAPPER.readTree(value);
        } catch (IOException e) {
            return OBJECT_MAPPER.createObjectNode();
        }
    }
}
