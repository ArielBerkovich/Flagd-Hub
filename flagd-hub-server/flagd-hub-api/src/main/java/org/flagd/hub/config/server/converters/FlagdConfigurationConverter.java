package org.flagd.hub.config.server.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.experimental.UtilityClass;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;

@Log4j2
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

        flags.forEach((FeatureFlag featureFlag) ->{
                try{
                    flagsNode.set(featureFlag.getKey(), convertFlagToFlagdFormat(featureFlag));
                }
                catch (Exception e){
                    log.error("Error converting feature flag: {} - {}", featureFlag.getKey(), e.getMessage(), e);
                }
                });

        configuration.set(FLAGS_FIELD, flagsNode);

        return configuration;
    }

    private static ObjectNode convertFlagToFlagdFormat(FeatureFlag featureFlag) throws JsonProcessingException {
        ObjectNode flagdFlag = OBJECT_MAPPER.createObjectNode();

        flagdFlag.put(STATE_FIELD, "ENABLED");
        flagdFlag.put(DEFAULT_VARIANT_FIELD, featureFlag.getDefaultVariant());
        flagdFlag.set(VARIANTS_FIELD, getVariantsNode(featureFlag));

        if (StringUtils.hasText((String) featureFlag.getTargeting())) {
                ObjectNode targetingNode = getTargetingNode(featureFlag);
                flagdFlag.set(TARGETING_FIELD, targetingNode);
        }

        return flagdFlag;
    }

    private static ObjectNode getTargetingNode(FeatureFlag featureFlag) throws JsonProcessingException {
        String targetingJson = ((String) featureFlag.getTargeting()).replaceAll("\n", "");

        return (ObjectNode) OBJECT_MAPPER.readTree(targetingJson);
    }

    private static ObjectNode getVariantsNode(FeatureFlag featureFlag) {
        ObjectNode variantsNode = OBJECT_MAPPER.createObjectNode();

        switch (featureFlag.getType()) {
            case BOOLEAN -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.put(key, Boolean.parseBoolean(value)));
            case STRING -> featureFlag.getVariants().forEach(variantsNode::put);
            case INTEGER -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.put(key, Integer.parseInt(value)));
            case DOUBLE -> featureFlag.getVariants().forEach((String key, String value) ->
                    variantsNode.put(key, Double.parseDouble(value)));
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
