package com.altenshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class WishlistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    private String createAndLogin(String email) throws Exception {
        String password = "pwd123";
        var userPayload = Map.of("email", email, "password", password);
        mockMvc.perform(post("/api/account").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(userPayload)))
            .andExpect(status().isOk());

        var tokenResp = mockMvc.perform(post("/api/token").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Map.of("email", email, "password", password))))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
        Map<?,?> parsed = mapper.readValue(tokenResp, Map.class);
        return (String) parsed.get("token");
    }

    @Test
    public void addAndRemoveWishlist_shouldWork() throws Exception {
        String email = "testuser+wl@example.com";
        String token = createAndLogin(email);

        // add productId 1
        var addBody = Map.of("productId", 1);
        var addResp = mockMvc.perform(post("/api/wishlist").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(addBody)).header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
        var list = mapper.readValue(addResp, java.util.List.class);
        assertThat(list).contains(1);

        // delete
        var delResp = mockMvc.perform(delete("/api/wishlist/1").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
        var list2 = mapper.readValue(delResp, java.util.List.class);
        assertThat(list2).doesNotContain(1);
    }
}
