package org.flagd.hub.config.server.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.flagd.hub.rest.model.ChangeDefaultVariantRequest;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class FlagTestHelper {

    public static FeatureFlag createBooleanFlag(String key, String defaultVariant) {
        return new FeatureFlag()
                .key(key)
                .defaultVariant(defaultVariant)
                .type(FeatureFlag.TypeEnum.BOOLEAN)
                .variants(Map.of("on", "true", "off", "false"));
    }

    public static FeatureFlag createStringFlag(String key, String defaultVariant, Map<String, String> variants) {
        return new FeatureFlag()
                .key(key)
                .defaultVariant(defaultVariant)
                .type(FeatureFlag.TypeEnum.STRING)
                .variants(variants);
    }

    public static FeatureFlag createIntegerFlag(String key, String defaultVariant, Map<String, String> variants) {
        return new FeatureFlag()
                .key(key)
                .defaultVariant(defaultVariant)
                .type(FeatureFlag.TypeEnum.INTEGER)
                .variants(variants);
    }

    public static ResultActions createFlag(MockMvc mockMvc, ObjectMapper objectMapper, String authToken, FeatureFlag flag) throws Exception {
        return mockMvc.perform(post("/flagd-hub/flags")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(flag)));
    }

    public static ResultActions getFlag(MockMvc mockMvc, String authToken, String flagKey) throws Exception {
        return mockMvc.perform(get("/flagd-hub/flags/" + flagKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken));
    }

    public static ResultActions updateFlag(MockMvc mockMvc, ObjectMapper objectMapper, String authToken, String flagKey, String newVariant) throws Exception {
        ChangeDefaultVariantRequest request = new ChangeDefaultVariantRequest()
                .defaultVariant(newVariant);

        return mockMvc.perform(put("/flagd-hub/flags/" + flagKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
    }

    public static void deleteFlag(MockMvc mockMvc, String authToken, String flagKey) throws Exception {
        mockMvc.perform(delete("/flagd-hub/flags/" + flagKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken));
    }

    public static ResultActions getChangelog(MockMvc mockMvc, String authToken, String flagKey) throws Exception {
        return mockMvc.perform(get("/flagd-hub/flags/" + flagKey + "/changelog")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken));
    }

    public static ResultActions getAllChangelogs(MockMvc mockMvc, String authToken) throws Exception {
        return mockMvc.perform(get("/flagd-hub/flags/changelogs")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken));
    }

    public static ResultActions getAllFlags(MockMvc mockMvc, String authToken) throws Exception {
        return mockMvc.perform(get("/flagd-hub/flags")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authToken));
    }
}
