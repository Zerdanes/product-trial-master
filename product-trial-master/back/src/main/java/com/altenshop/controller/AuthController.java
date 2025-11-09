package com.altenshop.controller;

import com.altenshop.model.User;
import com.altenshop.service.JwtService;
import com.altenshop.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/account")
    public ResponseEntity<?> createAccount(@RequestBody User body) {
        if (body.getEmail() == null || body.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and password required"));
        }
        userService.createUser(body);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PostMapping("/token")
    public ResponseEntity<?> token(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        var userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }
        var user = userOpt.get();
        if (!userService.checkPassword(user, password)) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }
        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
