package org.flagd.hub.config.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.flagd.hub.config.server.AbstractIntegrationTest;
import org.flagd.hub.config.server.utils.AuthTestHelper;
import org.flagd.hub.rest.model.ChangeDefaultVariantRequest;
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

class FlagdHubControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authToken;

    @BeforeEach
    void setUp() throws Exception {
        authToken = AuthTestHelper.getAuthToken(mockMvc, objectMapper);
    }

    // ========== CRUD Operations ==========

    @Test
    @DisplayName("POST /flagd-hub/flags - Creates flag and returns 201")
    void createFlag_WithValidData_ReturnsCreated() throws Exception {
        FeatureFlag flag = createBooleanFlag("create-test-flag", "on");

        createFlag(mockMvc, objectMapper, authToken, flag)
                .andExpect(status().isCreated());

        getFlag(mockMvc, authToken, "create-test-flag")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").value("create-test-flag"));

        deleteFlag(mockMvc, authToken, "create-test-flag");
    }

    @Test
    @DisplayName("POST /flagd-hub/flags - Returns 400 when type is missing")
    void createFlag_WithoutType_ReturnsBadRequest() throws Exception {
        String flagWithoutType = """
                {
                    "key": "no-type-flag",
                    "defaultVariant": "on",
                    "variants": {
                        "on": "true",
                        "off": "false"
                    }
                }
                """;

        mockMvc.perform(post("/flagd-hub/flags")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(flagWithoutType))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /flagd-hub/flags/{flagKey} - Returns flag by key")
    void getFlag_WithExistingKey_ReturnsOkAndFlag() throws Exception {
        FeatureFlag flag = createStringFlag("get-test-flag", "enabled",
                Map.of("enabled", "true", "disabled", "false"));

        createFlag(mockMvc, objectMapper, authToken, flag);

        getFlag(mockMvc, authToken, "get-test-flag")
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.key").value("get-test-flag"))
                .andExpect(jsonPath("$.defaultVariant").value("enabled"))
                .andExpect(jsonPath("$.type").value("string"));

        deleteFlag(mockMvc, authToken, "get-test-flag");
    }

    @Test
    @DisplayName("GET /flagd-hub/flags/{flagKey} - Returns 404 for non-existent flag")
    void getFlag_WithNonExistentKey_ReturnsNotFound() throws Exception {
        getFlag(mockMvc, authToken, "non-existent-flag-key").andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /flagd-hub/flags - Returns all flags")
    void getAllFlags_WithAuthentication_ReturnsOkAndArray() throws Exception {
        getAllFlags(mockMvc, authToken)
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("PUT /flagd-hub/flags/{flagKey} - Updates default variant successfully")
    void updateFlag_WithValidVariant_ReturnsAcceptedAndUpdates() throws Exception {
        FeatureFlag flag = createStringFlag("update-test-flag", "v1",
                Map.of("v1", "version1", "v2", "version2"));

        createFlag(mockMvc, objectMapper, authToken, flag);

        updateFlag(mockMvc, objectMapper, authToken, "update-test-flag", "v2")
                .andExpect(status().isAccepted());

        getFlag(mockMvc, authToken, "update-test-flag")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.defaultVariant").value("v2"));

        deleteFlag(mockMvc, authToken, "update-test-flag");
    }

    @Test
    @DisplayName("PUT /flagd-hub/flags/{flagKey} - Returns 409 for invalid variant")
    void updateFlag_WithInvalidVariant_ReturnsConflict() throws Exception {
        FeatureFlag flag = createBooleanFlag("invalid-variant-test-flag", "on");

        createFlag(mockMvc, objectMapper, authToken, flag);

        updateFlag(mockMvc, objectMapper, authToken, "invalid-variant-test-flag", "invalid-variant-name")
                .andExpect(status().isConflict());

        deleteFlag(mockMvc, authToken, "invalid-variant-test-flag");
    }

    @Test
    @DisplayName("DELETE /flagd-hub/flags/{flagKey} - Deletes flag successfully")
    void deleteFlag_WithExistingFlag_ReturnsAcceptedAndDeletes() throws Exception {
        FeatureFlag flag = createStringFlag("delete-test-flag", "active",
                Map.of("active", "on", "inactive", "off"));

        createFlag(mockMvc, objectMapper, authToken, flag);

        mockMvc.perform(delete("/flagd-hub/flags/delete-test-flag")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isAccepted());

        getFlag(mockMvc, authToken, "delete-test-flag")
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /flagd-hub/flags/{flagKey} - Returns 404 for non-existent flag")
    void deleteFlag_WithNonExistentFlag_ReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/flagd-hub/flags/non-existent-delete-flag")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound());
    }

    // ========== Changelog Operations ==========

    @Test
    @DisplayName("GET /flagd-hub/flags/{flagKey}/changelog - Returns empty array when no changes made")
    void getChangelog_WhenNoChanges_ReturnsEmptyArray() throws Exception {
        FeatureFlag flag = createStringFlag("changelog-no-changes-flag", "v1",
                Map.of("v1", "version1", "v2", "version2"));

        createFlag(mockMvc, objectMapper, authToken, flag);

        getChangelog(mockMvc, authToken, "changelog-no-changes-flag")
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());

        deleteFlag(mockMvc, authToken, "changelog-no-changes-flag");
    }

    @Test
    @DisplayName("GET /flagd-hub/flags/changelogs - Returns all changelogs")
    void getAllChangelogs_WithAuthentication_ReturnsOk() throws Exception {
        getAllChangelogs(mockMvc, authToken)
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Changelog records variant change with previousVariant and updatedVariant")
    void changelog_AfterUpdatingVariant_RecordsChangeDetails() throws Exception {
        FeatureFlag flag = createStringFlag("changelog-update-test-flag", "v1",
                Map.of("v1", "version1", "v2", "version2"));

        createFlag(mockMvc, objectMapper, authToken, flag);

        updateFlag(mockMvc, objectMapper, authToken, "changelog-update-test-flag", "v2");

        getChangelog(mockMvc, authToken, "changelog-update-test-flag")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0]").exists())
                .andExpect(jsonPath("$[0].previousVariant").value("v1"))
                .andExpect(jsonPath("$[0].updatedVariant").value("v2"))
                .andExpect(jsonPath("$[0].timestamp").exists());

        deleteFlag(mockMvc, authToken, "changelog-update-test-flag");
    }

    // ========== Authentication & Authorization ==========

    @Test
    @DisplayName("GET /flagd-hub/flags - Returns 403 without authentication")
    void getAllFlags_WithoutAuth_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/flagd-hub/flags"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /flagd-hub/flags - Returns 403 without authentication")
    void createFlag_WithoutAuth_ReturnsForbidden() throws Exception {
        FeatureFlag flag = createBooleanFlag("unauthorized-flag", "on");

        mockMvc.perform(post("/flagd-hub/flags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(flag)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("PUT /flagd-hub/flags/{flagKey} - Returns 403 without authentication")
    void updateFlag_WithoutAuth_ReturnsForbidden() throws Exception {
        ChangeDefaultVariantRequest request = new ChangeDefaultVariantRequest()
                .defaultVariant("newvariant");

        mockMvc.perform(put("/flagd-hub/flags/some-flag")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /flagd-hub/flags/{flagKey} - Returns 403 without authentication")
    void deleteFlag_WithoutAuth_ReturnsForbidden() throws Exception {
        mockMvc.perform(delete("/flagd-hub/flags/some-flag"))
                .andExpect(status().isForbidden());
    }

    // ========== Edge Cases ==========

    @Test
    @DisplayName("POST /flagd-hub/flags - Returns 400 for empty variants")
    void createFlag_WithEmptyVariants_ReturnsBadRequest() throws Exception {
        FeatureFlag flag = new FeatureFlag()
                .key("empty-variants-flag")
                .defaultVariant("default")
                .type(FeatureFlag.TypeEnum.STRING)
                .variants(Map.of());

        createFlag(mockMvc, objectMapper, authToken, flag)
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /flagd-hub/flags - Returns 400 when default variant not in variants")
    void createFlag_WithInvalidDefaultVariant_ReturnsBadRequest() throws Exception {
        FeatureFlag flag = createStringFlag("invalid-default-flag", "nonexistent",
                Map.of("v1", "value1", "v2", "value2"));

        createFlag(mockMvc, objectMapper, authToken, flag)
                .andExpect(status().isBadRequest());
    }
}
