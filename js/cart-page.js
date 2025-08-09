// Cart page specific functionality

class CartPage {
    constructor() {
        this.init();
    }

    init() {
        this.renderCartItems();
        this.bindEvents();
        this.updateCartSummary();
    }

    bindEvents() {
        // Quantity change events
        $(document).on('click', '.quantity-decrease', this.handleQuantityDecrease.bind(this));
        $(document).on('click', '.quantity-increase', this.handleQuantityIncrease.bind(this));
        $(document).on('change', '.quantity-input', this.handleQuantityChange.bind(this));
        
        // Remove item events
        $(document).on('click', '.remove-item', this.handleRemoveItem.bind(this));
        
        // Move to wishlist
        $(document).on('click', '.move-to-wishlist', this.handleMoveToWishlist.bind(this));
        
        // Continue shopping
        $(document).on('click', '.continue-shopping-btn', () => {
            window.location.href = 'catalog.html';
        });
        
        // Proceed to checkout
        $(document).on('click', '.proceed-checkout', () => {
            if (window.cart && window.cart.items.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                window.cart.showToast('Your cart is empty', 'error');
            }
        });
    }

    renderCartItems() {
        const cartContent = $('#cart-content');
        const cartItems = window.cart ? window.cart.items : [];
        
        if (cartItems.length === 0) {
            this.renderEmptyCart(cartContent);
            return;
        }

        let html = `
            <div class="row">
                <div class="col-lg-8">
                    <div class="cart-items-section">
                        <h4 class="mb-4">Cart Items</h4>
        `;

        cartItems.forEach(item => {
            html += this.renderCartItem(item);
        });

        html += `
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="cart-summary">
                        <h4 class="mb-4">Order Summary</h4>
                        ${this.renderOrderSummary(cartItems)}
                    </div>
                </div>
            </div>
        `;

        cartContent.html(html);
        this.updateCartItemsCount();
    }

    renderEmptyCart(container) {
        container.html(`
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
                <h3 class="text-muted">Your cart is empty</h3>
                <p class="text-muted mb-4">Looks like you haven't added any manhwa to your cart yet.</p>
                <a href="catalog.html" class="btn btn-primary btn-lg">
                    <i class="fas fa-book"></i> Browse Manhwa
                </a>
            </div>
            <div class="continue-shopping">
                <h5>Recommended for you</h5>
                <p class="text-muted">Check out these popular manhwa titles</p>
                <div class="row">
                    ${this.renderRecommendedItems()}
                </div>
            </div>
        `);
        this.updateCartItemsCount();
    }

    renderCartItem(item) {
        return `
            <div class="cart-item-row" data-item-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2 col-sm-3">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    </div>
                    <div class="col-md-4 col-sm-9">
                        <h6 class="mb-1">
                            <a href="details.html?id=${item.id}" class="text-dark">${item.title}</a>
                        </h6>
                        <p class="text-muted small mb-2">Digital Manhwa</p>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary move-to-wishlist" data-item-id="${item.id}">
                                <i class="fas fa-heart"></i> Move to Wishlist
                            </button>
                            <button class="btn btn-sm btn-outline-danger ml-2 remove-item" data-item-id="${item.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="quantity-controls">
                            <button class="quantity-decrease" data-item-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-item-id="${item.id}">
                            <button class="quantity-increase" data-item-id="${item.id}" ${item.quantity >= 10 ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-3 text-right">
                        <p class="mb-1">
                            <span class="text-muted">$${item.price.toFixed(2)} each</span>
                        </p>
                        <h6 class="text-success font-weight-bold item-total">
                            $${(item.price * item.quantity).toFixed(2)}
                        </h6>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrderSummary(cartItems) {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 4.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return `
            <div class="order-summary-details">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal (${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span class="${shipping === 0 ? 'text-success' : ''}">
                        ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}
                    </span>
                </div>
                ${shipping > 0 ? `
                    <div class="alert alert-info small p-2 mb-3">
                        <i class="fas fa-info-circle"></i> Free shipping on orders over $50
                    </div>
                ` : ''}
                <div class="d-flex justify-content-between mb-2">
                    <span>Estimated Tax</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-4">
                    <h5>Total</h5>
                    <h5 class="text-success">$${total.toFixed(2)}</h5>
                </div>
                <button class="btn btn-success btn-lg btn-block proceed-checkout mb-3">
                    <i class="fas fa-lock"></i> Proceed to Checkout
                </button>
                <button class="btn btn-outline-primary btn-block continue-shopping-btn">
                    <i class="fas fa-arrow-left"></i> Continue Shopping
                </button>
            </div>
            
            <div class="mt-4 pt-4 border-top">
                <h6>Secure Payment</h6>
                <div class="payment-icons">
                    <i class="fab fa-cc-visa fa-2x text-muted mr-2"></i>
                    <i class="fab fa-cc-mastercard fa-2x text-muted mr-2"></i>
                    <i class="fab fa-cc-paypal fa-2x text-muted mr-2"></i>
                    <i class="fab fa-cc-stripe fa-2x text-muted"></i>
                </div>
            </div>
            
            <div class="mt-4 pt-4 border-top">
                <h6>Support</h6>
                <ul class="list-unstyled small">
                    <li><i class="fas fa-phone"></i> 24/7 Customer Support</li>
                    <li><i class="fas fa-shield-alt"></i> 30-day Money Back Guarantee</li>
                    <li><i class="fas fa-sync"></i> Easy Returns & Exchanges</li>
                </ul>
            </div>
        `;
    }

    renderRecommendedItems() {
        const recommendedItems = [
            { id: 1, title: 'Solo Leveling', price: 15.99, image: 'img/cover1.jpg' },
            { id: 2, title: 'Tower of God', price: 19.99, image: 'img/cover2.jpg' },
            { id: 5, title: 'True Beauty', price: 14.99, image: 'img/cover5.jpg' }
        ];

        return recommendedItems.map(item => `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body p-3">
                        <h6 class="card-title">${item.title}</h6>
                        <p class="card-text text-success font-weight-bold">$${item.price}</p>
                        <button class="btn btn-primary btn-sm add-to-cart" 
                            data-id="${item.id}" data-title="${item.title}" 
                            data-price="${item.price}" data-image="${item.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleQuantityDecrease(e) {
        const itemId = $(e.currentTarget).data('item-id');
        const currentQuantity = parseInt($(`.cart-item-row[data-item-id="${itemId}"] .quantity-input`).val());
        
        if (currentQuantity > 1) {
            this.updateItemQuantity(itemId, currentQuantity - 1);
        }
    }

    handleQuantityIncrease(e) {
        const itemId = $(e.currentTarget).data('item-id');
        const currentQuantity = parseInt($(`.cart-item-row[data-item-id="${itemId}"] .quantity-input`).val());
        
        if (currentQuantity < 10) {
            this.updateItemQuantity(itemId, currentQuantity + 1);
        }
    }

    handleQuantityChange(e) {
        const itemId = $(e.currentTarget).data('item-id');
        const newQuantity = parseInt($(e.currentTarget).val());
        
        if (newQuantity >= 1 && newQuantity <= 10) {
            this.updateItemQuantity(itemId, newQuantity);
        } else {
            // Reset to valid value
            const cartItem = window.cart.items.find(item => item.id == itemId);
            if (cartItem) {
                $(e.currentTarget).val(cartItem.quantity);
            }
        }
    }

    updateItemQuantity(itemId, newQuantity) {
        if (!window.cart) return;
        
        const itemIndex = window.cart.items.findIndex(item => item.id == itemId);
        if (itemIndex > -1) {
            window.cart.items[itemIndex].quantity = newQuantity;
            window.cart.saveCart();
            
            // Update UI
            const itemRow = $(`.cart-item-row[data-item-id="${itemId}"]`);
            const pricePerItem = window.cart.items[itemIndex].price;
            const newTotal = pricePerItem * newQuantity;
            
            itemRow.find('.quantity-input').val(newQuantity);
            itemRow.find('.item-total').text(`$${newTotal.toFixed(2)}`);
            
            // Update quantity buttons
            itemRow.find('.quantity-decrease').prop('disabled', newQuantity <= 1);
            itemRow.find('.quantity-increase').prop('disabled', newQuantity >= 10);
            
            // Update global cart
            window.cart.updateCartCount();
            window.cart.updateCartDropdown();
            
            // Update order summary
            this.updateOrderSummary();
            this.updateCartItemsCount();
            
            window.cart.showToast('Quantity updated', 'success');
        }
    }

    handleRemoveItem(e) {
        const itemId = $(e.currentTarget).data('item-id');
        
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            window.cart.removeFromCart(itemId);
            
            // Remove from UI with animation
            const itemRow = $(`.cart-item-row[data-item-id="${itemId}"]`);
            itemRow.fadeOut(300, () => {
                itemRow.remove();
                
                // Check if cart is now empty
                if (window.cart.items.length === 0) {
                    this.renderCartItems();
                } else {
                    this.updateOrderSummary();
                    this.updateCartItemsCount();
                }
            });
        }
    }

    handleMoveToWishlist(e) {
        const itemId = $(e.currentTarget).data('item-id');
        const cartItem = window.cart.items.find(item => item.id == itemId);
        
        if (cartItem) {
            // Add to wishlist
            window.cart.toggleWishlist(cartItem);
            
            // Remove from cart
            this.handleRemoveItem(e);
        }
    }

    updateOrderSummary() {
        const cartItems = window.cart ? window.cart.items : [];
        $('.order-summary-details').html(this.renderOrderSummary(cartItems).split('<div class="mt-4 pt-4 border-top">')[0]);
    }

    updateCartItemsCount() {
        const totalItems = window.cart ? window.cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        $('.cart-items-count').text(totalItems);
    }

    updateCartSummary() {
        // This method can be used for real-time updates
        this.updateOrderSummary();
        this.updateCartItemsCount();
    }
}

// Initialize cart page when DOM is ready
$(document).ready(function() {
    // Wait for the cart to be initialized
    const initCartPage = () => {
        if (window.cart) {
            window.cartPage = new CartPage();
        } else {
            setTimeout(initCartPage, 100);
        }
    };
    
    initCartPage();
});