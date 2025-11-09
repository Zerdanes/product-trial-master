package com.altenshop.config;

import com.altenshop.model.Product;
import com.altenshop.model.User;
import com.altenshop.service.UserService;
import com.altenshop.repository.ProductRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner init(ProductRepository productRepository, UserService userService) {
        return args -> {
            if (productRepository.count() == 0) {
                ObjectMapper mapper = new ObjectMapper();
                TypeReference<List<Product>> typeRef = new TypeReference<>() {};
                InputStream is = DataLoader.class.getResourceAsStream("/data/products.json");
                if (is != null) {
                    try {
                        List<Product> products = mapper.readValue(is, typeRef);
                        for (Product p : products) {
                            p.setId(null);
                            productRepository.save(p);
                        }
                    } catch (Exception ex) {
                        System.out.println("failed to load seed: " + ex.getMessage());
                    }
                }
            }
            // Optionally ensure a dev admin user exists when env vars are provided.
            try {
                String devAdminEmail = "admin@admin.com"; //System.getenv("ALTENSHOP_DEV_ADMIN_EMAIL");
                String devAdminPassword = "adminpass"; //System.getenv("ALTENSHOP_DEV_ADMIN_PASSWORD");
                if (devAdminEmail != null && !devAdminEmail.isBlank() && devAdminPassword != null && !devAdminPassword.isBlank()) {
                    if (userService.findByEmail(devAdminEmail).isEmpty()) {
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setFirstname("Admin");
                        admin.setEmail(devAdminEmail);
                        admin.setPassword(devAdminPassword);
                        userService.createUser(admin);
                        System.out.println("Created admin user: " + devAdminEmail + " (password not logged)");
                    }
                } else {
                    // No dev admin credentials provided via env - skipping seeding of admin user to avoid leaking secrets.
                    // To seed an admin in dev, set ALTENSHOP_DEV_ADMIN_EMAIL and ALTENSHOP_DEV_ADMIN_PASSWORD environment variables.
                }
            } catch (Exception ex) {
                System.out.println("failed to ensure admin user: " + ex.getMessage());
            }
        };
    }
}
