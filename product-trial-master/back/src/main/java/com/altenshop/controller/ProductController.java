package com.altenshop.controller;

import com.altenshop.model.Product;
import com.altenshop.repository.ProductRepository;
import com.altenshop.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final JwtService jwtService;

    public ProductController(ProductRepository productRepository, JwtService jwtService) {
        this.productRepository = productRepository;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String q,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(required = false) String category) {
        List<Product> all = productRepository.findAll();
        // simple in-memory filtering
        java.util.stream.Stream<Product> stream = all.stream();
        if (q != null && !q.isBlank()) {
            String qq = q.toLowerCase();
            stream = stream.filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(qq))
                    || (p.getDescription() != null && p.getDescription().toLowerCase().contains(qq))
                    || (p.getCode() != null && p.getCode().toLowerCase().contains(qq)));
        }
        if (category != null && !category.isBlank()) {
            String cat = category.toLowerCase();
            stream = stream.filter(p -> p.getCategory() != null && p.getCategory().toLowerCase().equals(cat));
        }
        List<Product> filtered = stream.toList();
        int total = filtered.size();
        int from = Math.max(0, Math.min(total, page * size));
        int to = Math.max(0, Math.min(total, from + size));
        List<Product> pageItems = filtered.subList(from, to);
        return ResponseEntity.ok(java.util.Map.of(
                "items", pageItems,
                "total", total,
                "page", page,
                "size", size
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        Optional<Product> p = productRepository.findById(id);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null) return false;
        Object principal = auth.getPrincipal();
        if (principal instanceof String) {
            return "admin@admin.com".equals(principal);
        }
        return false;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Product p, Authentication auth) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("forbidden");
        p.setCreatedAt(System.currentTimeMillis());
        p.setUpdatedAt(System.currentTimeMillis());
        Product saved = productRepository.save(p);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product p, Authentication auth) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("forbidden");
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        Product ex = existing.get();
        // simple merge
        if (p.getName() != null) ex.setName(p.getName());
        if (p.getPrice() != null) ex.setPrice(p.getPrice());
        ex.setUpdatedAt(System.currentTimeMillis());
        productRepository.save(ex);
        return ResponseEntity.ok(ex);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("forbidden");
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
