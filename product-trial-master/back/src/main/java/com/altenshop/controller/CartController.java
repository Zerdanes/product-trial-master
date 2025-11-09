package com.altenshop.controller;

import com.altenshop.model.CartItem;
import com.altenshop.model.User;
import com.altenshop.repository.ProductRepository;
import com.altenshop.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private Optional<User> getUser(Authentication auth) {
        if (auth == null) return Optional.empty();
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email);
    }

    @GetMapping
    public ResponseEntity<?> getCart(Authentication auth) {
        var userOpt = getUser(auth);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        var user = userOpt.get();
        var cart = user.getCart();
        java.util.List<com.altenshop.model.CartEntry> view = new java.util.ArrayList<>();
        for (com.altenshop.model.CartItem ci : cart) {
            productRepository.findById(ci.getProductId()).ifPresent(p -> view.add(new com.altenshop.model.CartEntry(p, ci.getQuantity())));
        }
        return ResponseEntity.ok(view);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItem item, Authentication auth) {
        var userOpt = getUser(auth);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        var user = userOpt.get();
        // If product exists
        if (!productRepository.existsById(item.getProductId())) return ResponseEntity.badRequest().body("invalid productId");
        List<CartItem> cart = user.getCart();
        boolean found = false;
        for (CartItem ci : cart) {
            if (ci.getProductId().equals(item.getProductId())) {
                ci.setQuantity(ci.getQuantity() + item.getQuantity());
                found = true;
            }
        }
        if (!found) cart.add(item);
        user.setCart(cart);
        userRepository.save(user);
        // return enriched view
        java.util.List<com.altenshop.model.CartEntry> view = new java.util.ArrayList<>();
        for (com.altenshop.model.CartItem ci : user.getCart()) {
            productRepository.findById(ci.getProductId()).ifPresent(p -> view.add(new com.altenshop.model.CartEntry(p, ci.getQuantity())));
        }
        return ResponseEntity.ok(view);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, Authentication auth) {
        var userOpt = getUser(auth);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        var user = userOpt.get();
        user.getCart().removeIf(ci -> ci.getProductId().equals(productId));
        userRepository.save(user);
        java.util.List<com.altenshop.model.CartEntry> view = new java.util.ArrayList<>();
        for (com.altenshop.model.CartItem ci : user.getCart()) {
            productRepository.findById(ci.getProductId()).ifPresent(p -> view.add(new com.altenshop.model.CartEntry(p, ci.getQuantity())));
        }
        return ResponseEntity.ok(view);
    }
}
