package org.flagd.hub.config.server.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.flagd.hub.config.server.AbstractIntegrationTest;
import org.flagd.hub.rest.model.LoginRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /flagd-hub/login - Success with valid credentials")
    void loginWithValidCredentials_ReturnsTokenAndOkStatus() throws Exception {
        LoginRequest loginRequest = new LoginRequest()
                .username("testadmin")
                .password("testpass");

        mockMvc.perform(post("/flagd-hub/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    @DisplayName("POST /flagd-hub/login - Fails with invalid password")
    void loginWithInvalidPassword_ReturnsUnauthorized() throws Exception {
        LoginRequest loginRequest = new LoginRequest()
                .username("testadmin")
                .password("wrongpassword");

        mockMvc.perform(post("/flagd-hub/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /flagd-hub/login - Fails with invalid username")
    void loginWithInvalidUsername_ReturnsUnauthorized() throws Exception {
        LoginRequest loginRequest = new LoginRequest()
                .username("wronguser")
                .password("testpass");

        mockMvc.perform(post("/flagd-hub/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
