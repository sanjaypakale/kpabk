package com.kpabk.kpabk_connect.product.config;

import com.kpabk.kpabk_connect.product.model.Category;
import com.kpabk.kpabk_connect.product.model.Product;
import com.kpabk.kpabk_connect.product.model.ProductType;
import com.kpabk.kpabk_connect.product.model.ProductUnit;
import com.kpabk.kpabk_connect.product.repository.CategoryRepository;
import com.kpabk.kpabk_connect.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds test categories and products for development.
 * Only creates if not already present. Disable in production via profile or remove this bean.
 */
@Configuration
@RequiredArgsConstructor
public class TestProductDataInitializer {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Bean
    @Order(4) // after RoleDataInitializer (1), OutletDataInitializer (2), TestUserDataInitializer (3)
    public ApplicationRunner initTestProducts() {
        return args -> {
            Category groceries = getOrCreateCategory("Groceries", "Staples and daily groceries");
            Category beverages = getOrCreateCategory("Beverages", "Drinks and refreshments");
            Category snacks = getOrCreateCategory("Snacks", "Chips, biscuits and quick bites");
            Category dairy = getOrCreateCategory("Dairy", "Milk, cheese and dairy products");
            Category bakery = getOrCreateCategory("Bakery", "Bread and baked goods");
            Category frozen = getOrCreateCategory("Frozen", "Frozen food and ice cream");

            List<ProductDef> products = List.of(
                // Groceries – mixed units and types
                new ProductDef("Basmati Rice", "Long-grain basmati rice, 1 kg pack", "99.00", ProductType.VEG, ProductUnit.KGS, groceries),
                new ProductDef("Toor Dal", "Split pigeon pea lentils, 500g packet", "85.00", ProductType.VEG, ProductUnit.PAC, groceries),
                new ProductDef("Sunflower Oil", "Refined sunflower oil, 1L bottle", "185.00", ProductType.VEG, ProductUnit.PAC, groceries),
                new ProductDef("Wheat Flour", "Premium atta, 1 kg pack", "55.00", ProductType.VEG, ProductUnit.KGS, groceries),
                new ProductDef("Sugar", "White crystal sugar, 1 kg", "52.00", ProductType.VEG, ProductUnit.KGS, groceries),
                // Beverages
                new ProductDef("Mineral Water", "1L packaged drinking water", "20.00", ProductType.BEVERAGE, ProductUnit.PAC, beverages),
                new ProductDef("Orange Juice", "Fresh taste orange juice, 1L", "120.00", ProductType.BEVERAGE, ProductUnit.PAC, beverages),
                new ProductDef("Tea Bags", "Assam tea bags, pack of 25", "75.00", ProductType.BEVERAGE, ProductUnit.PAC, beverages),
                new ProductDef("Instant Coffee", "100g jar", "220.00", ProductType.BEVERAGE, ProductUnit.PAC, beverages),
                new ProductDef("Soft Drink", "Cold drink 600ml bottle", "40.00", ProductType.BEVERAGE, ProductUnit.PCS, beverages),
                // Snacks
                new ProductDef("Potato Chips", "Classic salted, 50g pack", "20.00", ProductType.SNACKS, ProductUnit.PAC, snacks),
                new ProductDef("Biscuits", "Marie biscuits, 300g pack", "35.00", ProductType.SNACKS, ProductUnit.PAC, snacks),
                new ProductDef("Chocolate Bar", "Milk chocolate 50g", "45.00", ProductType.SNACKS, ProductUnit.PCS, snacks),
                new ProductDef("Namkeen Mix", "Spiced mix 200g packet", "60.00", ProductType.SNACKS, ProductUnit.PAC, snacks),
                new ProductDef("Peanuts", "Roasted salted peanuts, 250g", "90.00", ProductType.SNACKS, ProductUnit.KGS, snacks),
                // Dairy
                new ProductDef("Full Cream Milk", "1L tetra pack", "60.00", ProductType.VEG, ProductUnit.PAC, dairy),
                new ProductDef("Paneer", "Fresh paneer 200g block", "80.00", ProductType.VEG, ProductUnit.KGS, dairy),
                new ProductDef("Butter", "Salted butter 100g", "55.00", ProductType.VEG, ProductUnit.PAC, dairy),
                new ProductDef("Curd", "Plain dahi 400g cup", "35.00", ProductType.VEG, ProductUnit.PAC, dairy),
                new ProductDef("Cheese Slices", "Processed cheese, 6 slices", "75.00", ProductType.VEG, ProductUnit.PAC, dairy),
                // Bakery
                new ProductDef("White Bread", "Sliced loaf 400g", "40.00", ProductType.VEG, ProductUnit.PAC, bakery),
                new ProductDef("Whole Wheat Bread", "Brown bread 400g", "50.00", ProductType.VEG, ProductUnit.PAC, bakery),
                new ProductDef("Croissant", "Butter croissant, pack of 2", "65.00", ProductType.VEG, ProductUnit.SET, bakery),
                new ProductDef("Muffin", "Chocolate muffin per piece", "45.00", ProductType.DESSERT, ProductUnit.PCS, bakery),
                new ProductDef("Rusk", "Toast rusk 200g pack", "45.00", ProductType.SNACKS, ProductUnit.PAC, bakery),
                // Frozen & other
                new ProductDef("Frozen Peas", "Green peas 500g pack", "80.00", ProductType.VEG, ProductUnit.KGS, frozen),
                new ProductDef("Ice Cream", "Vanilla 500ml tub", "150.00", ProductType.DESSERT, ProductUnit.PAC, frozen),
                new ProductDef("Chicken Nuggets", "Frozen 300g pack", "180.00", ProductType.NON_VEG, ProductUnit.PAC, frozen),
                new ProductDef("Veg Spring Rolls", "Frozen 6 pcs pack", "120.00", ProductType.VEG, ProductUnit.SET, frozen),
                new ProductDef("Tissue Box", "2-ply tissues, 100 sheets", "30.00", ProductType.OTHER, ProductUnit.PCS, groceries)
            );

            for (ProductDef def : products) {
                createProductIfMissing(def);
            }
        };
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .description(description)
                        .isActive(true)
                        .build()));
    }

    private void createProductIfMissing(ProductDef def) {
        if (!productRepository.existsByName(def.name)) {
            productRepository.save(Product.builder()
                    .name(def.name)
                    .description(def.description)
                    .basePrice(new BigDecimal(def.basePrice))
                    .productType(def.productType)
                    .unit(def.unit)
                    .category(def.category)
                    .isActive(true)
                    .build());
        }
    }

    private record ProductDef(String name, String description, String basePrice,
                              ProductType productType, ProductUnit unit, Category category) {}
}
