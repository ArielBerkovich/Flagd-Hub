package org.flagd.hub.config.server.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.flagd.hub.rest.model.LoginRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AuthTestHelper {

    public static String getAuthToken(MockMvc mockMvc, ObjectMapper objectMapper) throws Exception {
        LoginRequest loginRequest = new LoginRequest()
                .username("testadmin")
                .password("testpass");

        MvcResult result = mockMvc.perform(post("/flagd-hub/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        // Extract token from response JSON
        return objectMapper.readTree(responseBody).get("token").asText();
    }
}
