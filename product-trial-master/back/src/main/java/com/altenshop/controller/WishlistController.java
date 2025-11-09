package com.altenshop.controller;

import com.altenshop.model.User;
import com.altenshop.repository.ProductRepository;
import com.altenshop.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistController(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private Optional<User> getUser(Authentication auth) {
        if (auth == null) return Optional.empty();
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email);
    }

    @GetMapping
    public ResponseEntity<?> getWishlist(Authentication auth) {
        var userOpt = getUser(auth);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(userOpt.get().getWishlist());
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody java.util.Map<String, Long> payload, Authentication auth) {
        var userOpt = getUser(auth);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        Long productId = payload.get("productId");
        if (productId == null || !productRepository.existsById(productId)) return ResponseEntity.badRequest().body("invalid productId");
        var user = userOpt.get();
        if (!user.getWishlist().contains(productId)) {
            user.getWishlist().add(productId);
            userRepository.save(user);
        }
        return ResponseEntity.ok(user.getWishlist());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication auth) {
        var userOpt = getUser(auth);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        var user = userOpt.get();
        user.getWishlist().removeIf(id -> id.equals(productId));
        userRepository.save(user);
        return ResponseEntity.ok(user.getWishlist());
    }
}
