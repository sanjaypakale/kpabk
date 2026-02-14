package com.kpabk.kpabk_connect.order.service;

import com.kpabk.kpabk_connect.order.dto.*;
import com.kpabk.kpabk_connect.order.exception.InvalidOrderStateException;
import com.kpabk.kpabk_connect.order.exception.OrderNotFoundException;
import com.kpabk.kpabk_connect.order.exception.OrderValidationException;
import com.kpabk.kpabk_connect.order.model.Order;
import com.kpabk.kpabk_connect.order.model.OrderItem;
import com.kpabk.kpabk_connect.order.model.OrderStatus;
import com.kpabk.kpabk_connect.order.model.PaymentStatus;
import com.kpabk.kpabk_connect.order.repository.OrderRepository;
import com.kpabk.kpabk_connect.product.dto.OutletProductResponse;
import com.kpabk.kpabk_connect.product.service.OutletProductService;
import com.kpabk.kpabk_connect.user.dto.OutletResponse;
import com.kpabk.kpabk_connect.user.exception.ResourceNotFoundException;
import com.kpabk.kpabk_connect.user.service.OutletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final int ORDER_NUMBER_MAX_ATTEMPTS = 5;

    private final OrderRepository orderRepository;
    private final OutletService outletService;
    private final OutletProductService outletProductService;
    private final InventoryDeductionPort inventoryDeductionPort;

    @Override
    @Transactional
    public OrderResponse placeOrder(CreateOrderRequest request) {
        // 1. Validate outlet exists and is active
        OutletResponse outlet;
        try {
            outlet = outletService.getById(request.getOutletId());
        } catch (ResourceNotFoundException e) {
            throw new OrderValidationException("Outlet not found: " + request.getOutletId());
        }
        if (Boolean.FALSE.equals(outlet.getIsActive())) {
            throw new OrderValidationException("Outlet is not active");
        }

        Long outletId = request.getOutletId();
        List<OrderItemRequest> itemRequests = request.getItems();

        // 2. Validate each product and build items with snapshot price/name
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        Map<UUID, Integer> productQuantities = new HashMap<>();

        for (OrderItemRequest req : itemRequests) {
            OutletProductResponse op;
            try {
                op = outletProductService.getOutletProduct(outletId, req.getProductId());
            } catch (Exception e) {
                throw new OrderValidationException("Product not available for this outlet: " + req.getProductId());
            }
            if (Boolean.FALSE.equals(op.getIsAvailable())) {
                throw new OrderValidationException("Product is not available: " + op.getProductName());
            }
            int minQty = op.getMinimumOrderQuantity() != null && op.getMinimumOrderQuantity() >= 1
                    ? op.getMinimumOrderQuantity() : 1;
            if (req.getQuantity() < minQty) {
                throw new OrderValidationException(
                        "Quantity for " + op.getProductName() + " must be at least " + minQty);
            }

            BigDecimal unitPrice = op.getOutletPrice() != null ? op.getOutletPrice() : op.getBasePrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(req.getQuantity())).setScale(2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(subtotal);

            productQuantities.put(req.getProductId(), req.getQuantity());

            OrderItem item = OrderItem.builder()
                    .productId(req.getProductId())
                    .productName(op.getProductName())
                    .quantity(req.getQuantity())
                    .priceAtOrderTime(unitPrice)
                    .subtotal(subtotal)
                    .build();
            orderItems.add(item);
        }

        // 3. Generate unique order number
        String orderNumber = generateUniqueOrderNumber();

        // 4. Create Order and OrderItems in single transaction
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .outletId(outletId)
                .customerId(request.getCustomerId())
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .paymentStatus(PaymentStatus.UNPAID)
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);
        order = orderRepository.save(order);

        // 5. Optionally trigger inventory deduction (no-op or event)
        inventoryDeductionPort.deductForOrder(order.getId(), outletId, productQuantities);

        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getByIdAndCustomerId(UUID id, Long customerId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        if (!Objects.equals(order.getCustomerId(), customerId)) {
            throw new OrderNotFoundException(id);
        }
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getByIdAndOutletId(UUID id, Long outletId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        if (!Objects.equals(order.getOutletId(), outletId)) {
            throw new OrderNotFoundException(id);
        }
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getMyOrders(Long customerId, Integer page, Integer size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = status != null
                ? orderRepository.findByCustomerIdAndStatus(customerId, status, pageable)
                : orderRepository.findByCustomerId(customerId, pageable);
        return toPageResponse(orderPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getOrdersByOutlet(Long outletId, Integer page, Integer size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = status != null
                ? orderRepository.findByOutletIdAndStatus(outletId, status, pageable)
                : orderRepository.findByOutletId(outletId, pageable);
        return toPageResponse(orderPage);
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(UUID id, Long outletId, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        if (!Objects.equals(order.getOutletId(), outletId)) {
            throw new OrderNotFoundException(id);
        }

        if (newStatus == OrderStatus.CANCELLED) {
            if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
                throw new InvalidOrderStateException(
                        "Only PENDING or CONFIRMED orders can be cancelled. Current: " + order.getStatus());
            }
        } else if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOrderStateException("Cannot change status of DELIVERED or CANCELLED order");
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateStatusByAdmin(UUID id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        if (newStatus == OrderStatus.CANCELLED) {
            if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
                throw new InvalidOrderStateException(
                        "Only PENDING or CONFIRMED orders can be cancelled. Current: " + order.getStatus());
            }
        } else if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOrderStateException("Cannot change status of DELIVERED or CANCELLED order");
        }
        order.setStatus(newStatus);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(Integer page, Integer size, OrderStatus status, Instant fromDate, Instant toDate) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage;
        if (fromDate != null && toDate != null) {
            orderPage = status != null
                    ? orderRepository.findByCreatedAtBetweenAndStatus(fromDate, toDate, status, pageable)
                    : orderRepository.findByCreatedAtBetween(fromDate, toDate, pageable);
        } else if (status != null) {
            orderPage = orderRepository.findByStatus(status, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }
        return toPageResponse(orderPage);
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueSummaryResponse getRevenueSummary(Instant fromDate, Instant toDate) {
        Instant from = fromDate != null ? fromDate : Instant.EPOCH;
        Instant to = toDate != null ? toDate : Instant.now();
        BigDecimal total = orderRepository.sumTotalAmountByStatusAndPaymentAndDateBetween(
                OrderStatus.DELIVERED, PaymentStatus.PAID, from, to);
        long count = orderRepository.countByStatusAndPaymentAndDateBetween(
                OrderStatus.DELIVERED, PaymentStatus.PAID, from, to);
        return RevenueSummaryResponse.builder()
                .fromDate(from)
                .toDate(to)
                .totalRevenue(total != null ? total : BigDecimal.ZERO)
                .orderCount(count)
                .build();
    }

    @Override
    @Transactional
    public void updatePaymentStatus(UUID orderId, PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        order.setPaymentStatus(paymentStatus);
        orderRepository.save(order);
    }

    private String generateUniqueOrderNumber() {
        for (int i = 0; i < ORDER_NUMBER_MAX_ATTEMPTS; i++) {
            String candidate = "ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
            if (!orderRepository.existsByOrderNumber(candidate)) {
                return candidate;
            }
        }
        throw new OrderValidationException("Could not generate unique order number");
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems() == null ? List.of() : order.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .outletId(order.getOutletId())
                .customerId(order.getCustomerId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .priceAtOrderTime(item.getPriceAtOrderTime())
                .subtotal(item.getSubtotal())
                .build();
    }

    private PageResponse<OrderResponse> toPageResponse(Page<Order> page) {
        return PageResponse.<OrderResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
