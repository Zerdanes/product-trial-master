package com.altenshop.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
    final String securitySchemeName = "bearerAuth";
    return new OpenAPI()
        .components(new Components().addSecuritySchemes(securitySchemeName,
            new SecurityScheme()
                .name("Authorization")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
        ))
        .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
        .info(new Info()
            .title("AltenShop - Product Trial API")
            .version("1.0")
            .description("API documentation for the product trial application (products, auth, cart, wishlist). Use the Authorize button to add a Bearer token for protected endpoints."));
    }
}
