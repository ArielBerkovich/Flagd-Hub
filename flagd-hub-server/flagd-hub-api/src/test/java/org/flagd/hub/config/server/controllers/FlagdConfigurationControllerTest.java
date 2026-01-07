package org.flagd.hub.config.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.flagd.hub.config.server.AbstractIntegrationTest;
import org.flagd.hub.config.server.utils.AuthTestHelper;
import org.flagd.hub.rest.model.FeatureFlag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.flagd.hub.config.server.utils.FlagTestHelper.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class FlagdConfigurationControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authToken;

    @BeforeEach
    void setUp() throws Exception {
        authToken = AuthTestHelper.getAuthToken(mockMvc, objectMapper);
    }

    @Test
    @DisplayName("GET /flagd/flags - Returns empty flags object when no flags exist")
    void getFlagdConfiguration_WhenNoFlags_ReturnsEmptyFlagsObject() throws Exception {
        mockMvc.perform(get("/flagd/flags"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.flags").exists())
                .andExpect(jsonPath("$.flags").isEmpty());
    }

    @Test
    @DisplayName("GET /flagd/flags - Returns created flag in flagd configuration format")
    void getFlagdConfiguration_AfterCreatingFlag_ReturnsFlagInResponse() throws Exception {
        FeatureFlag flag = createBooleanFlag("test-flag-single", "on");

        createFlag(mockMvc, objectMapper, authToken, flag)
                .andExpect(status().isCreated());

        mockMvc.perform(get("/flagd/flags"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.flags['test-flag-single']").exists())
                .andExpect(jsonPath("$.flags['test-flag-single'].defaultVariant").value("on"))
                .andExpect(jsonPath("$.flags['test-flag-single'].variants.on").value(true))
                .andExpect(jsonPath("$.flags['test-flag-single'].variants.off").value(false));

        deleteFlag(mockMvc, authToken, "test-flag-single");
    }

    @Test
    @DisplayName("GET /flagd/flags - Does not return deleted flag")
    void getFlagdConfiguration_AfterDeletingFlag_FlagDoesNotAppear() throws Exception {
        FeatureFlag flag = createStringFlag("test-flag-to-delete", "on",
                Map.of("on", "active", "off", "inactive"));

        createFlag(mockMvc, objectMapper, authToken, flag)
                .andExpect(status().isCreated());

        mockMvc.perform(get("/flagd/flags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flags['test-flag-to-delete']").exists());

        mockMvc.perform(delete("/flagd-hub/flags/test-flag-to-delete")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().is2xxSuccessful());

        mockMvc.perform(get("/flagd/flags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flags['test-flag-to-delete']").doesNotExist());
    }

    @Test
    @DisplayName("GET /flagd/flags - Returns all created flags")
    void getFlagdConfiguration_WithMultipleFlags_ReturnsAllFlags() throws Exception {
        FeatureFlag flag1 = createStringFlag("multi-test-flag-1", "v1",
                Map.of("v1", "value1", "v2", "value2"));
        FeatureFlag flag2 = createBooleanFlag("multi-test-flag-2", "on");
        FeatureFlag flag3 = createIntegerFlag("multi-test-flag-3", "100",
                Map.of("100", "100", "200", "200", "300", "300"));

        createFlag(mockMvc, objectMapper, authToken, flag1)
                .andExpect(status().isCreated());
        createFlag(mockMvc, objectMapper, authToken, flag2)
                .andExpect(status().isCreated());
        createFlag(mockMvc, objectMapper, authToken, flag3)
                .andExpect(status().isCreated());

        mockMvc.perform(get("/flagd/flags"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.flags['multi-test-flag-1'].defaultVariant").value("v1"))
                .andExpect(jsonPath("$.flags['multi-test-flag-2'].defaultVariant").value("on"))
                .andExpect(jsonPath("$.flags['multi-test-flag-3'].defaultVariant").value("100"));

        deleteFlag(mockMvc, authToken, "multi-test-flag-1");
        deleteFlag(mockMvc, authToken, "multi-test-flag-2");
        deleteFlag(mockMvc, authToken, "multi-test-flag-3");
    }
}
