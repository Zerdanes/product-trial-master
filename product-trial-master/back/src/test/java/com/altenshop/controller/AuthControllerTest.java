package com.altenshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void createAccount_and_token_shouldWork() throws Exception {
        String email = "testuser+auth@example.com";
        String password = "secret";

        // create account
        var userPayload = Map.of("email", email, "password", password);
        mockMvc.perform(post("/api/account").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userPayload)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true));

        // request token
        var creds = Map.of("email", email, "password", password);
        mockMvc.perform(post("/api/token").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(creds)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").isString());
    }
}
