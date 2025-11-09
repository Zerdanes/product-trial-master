package com.altenshop.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;

    @Column(length = 2000)
    private String description;

    private String image;
    private String category;
    private Double price;
    private Integer quantity;
    private String internalReference;
    private Integer shellId;
    private String inventoryStatus;
    private Double rating;
    private Long createdAt;
    private Long updatedAt;
}
