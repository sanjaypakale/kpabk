package com.kpabk.kpabk_connect.cart.service;

import com.kpabk.kpabk_connect.cart.dto.AddToCartRequest;
import com.kpabk.kpabk_connect.cart.dto.CartItemResponse;
import com.kpabk.kpabk_connect.cart.dto.UpdateCartRequest;
import com.kpabk.kpabk_connect.cart.model.CartItem;
import com.kpabk.kpabk_connect.auth.model.User;
import com.kpabk.kpabk_connect.auth.repository.UserRepository;
import com.kpabk.kpabk_connect.cart.repository.CartItemRepository;
import com.kpabk.kpabk_connect.product.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.product.model.Product;
import com.kpabk.kpabk_connect.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Add a product to the user's cart. If the product is already in the cart, quantity is increased.
     * Validates that the product exists before adding.
     */
    @Transactional
    public CartItemResponse addToCart(Long userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        CartItem item = cartItemRepository
                .findByUser_IdAndProduct_Id(userId, request.getProductId())
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item = cartItemRepository.save(item);
        } else {
            User user = userRepository.getReferenceById(userId);
            item = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            item = cartItemRepository.save(item);
        }

        return mapToResponse(item);
    }

    /**
     * Get all cart items for the given user, ordered by most recently added first.
     */
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(Long userId) {
        List<CartItem> items = cartItemRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        return items.stream().map(this::mapToResponse).toList();
    }

    /**
     * Update quantity for an existing cart item. Min quantity 1. Fails if item not in user's cart.
     */
    @Transactional
    public CartItemResponse updateQuantity(Long userId, UpdateCartRequest request) {
        CartItem item = cartItemRepository
                .findByUser_IdAndProduct_Id(userId, request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item for product", request.getProductId()));
        item.setQuantity(request.getQuantity());
        item = cartItemRepository.save(item);
        return mapToResponse(item);
    }

    /**
     * Remove a cart item. Only the owner can remove it; otherwise throws ResourceNotFoundException.
     */
    @Transactional
    public void removeItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findByIdAndUser_Id(cartItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));
        cartItemRepository.delete(item);
    }

    private CartItemResponse mapToResponse(CartItem item) {
        Product p = item.getProduct();
        return CartItemResponse.builder()
                .id(item.getId())
                .userId(item.getUser().getId())
                .productId(p.getId())
                .productName(p.getName())
                .basePrice(p.getBasePrice())
                .productType(p.getProductType())
                .unit(p.getUnit())
                .quantity(item.getQuantity())
                .addedAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
