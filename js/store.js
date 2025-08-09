// Manhwa Store JavaScript functionality

// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.updateWishlistCount();
        this.updateCartDropdown();
        this.bindEvents();
    }

    bindEvents() {
        // Add to cart buttons
        $(document).on('click', '.add-to-cart', (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const productData = {
                id: btn.data('id'),
                title: btn.data('title'),
                price: parseFloat(btn.data('price')),
                image: btn.data('image'),
                quantity: 1
            };
            this.addToCart(productData);
        });

        // Add to wishlist buttons
        $(document).on('click', '.add-to-wishlist', (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const productData = {
                id: btn.data('id'),
                title: btn.data('title') || btn.closest('.product-card').find('.card-title a').text(),
                price: parseFloat(btn.data('price')) || parseFloat(btn.closest('.product-card').find('.price').text().replace('$', '')),
                image: btn.data('image') || btn.closest('.product-card').find('img').attr('src')
            };
            this.toggleWishlist(productData);
            btn.toggleClass('active');
        });

        // Remove from cart
        $(document).on('click', '.cart-item-remove', (e) => {
            e.preventDefault();
            const itemId = $(e.currentTarget).data('id');
            this.removeFromCart(itemId);
        });

        // Search functionality
        $('.search input[type="text"]').on('input', this.handleSearch.bind(this));
        $(document).on('click', '.search-suggestion', this.selectSearchSuggestion.bind(this));
        
        // Close search suggestions when clicking outside
        $(document).on('click', (e) => {
            if (!$(e.target).closest('.search').length) {
                $('.search-suggestions').hide();
            }
        });
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showToast(`Updated ${product.title} quantity in cart`, 'success');
        } else {
            this.items.push(product);
            this.showToast(`${product.title} added to cart!`, 'success');
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDropdown();
    }

    removeFromCart(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartCount();
            this.updateCartDropdown();
            this.showToast(`${removedItem.title} removed from cart`, 'info');
        }
    }

    toggleWishlist(product) {
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            this.showToast(`${product.title} removed from wishlist`, 'info');
        } else {
            this.wishlist.push(product);
            this.showToast(`${product.title} added to wishlist!`, 'success');
        }

        this.saveWishlist();
        this.updateWishlistCount();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        $('.cart-count').text(totalItems);
        $('.cart-count').toggle(totalItems > 0);
    }

    updateWishlistCount() {
        $('.wishlist-count').text(this.wishlist.length);
        $('.wishlist-count').toggle(this.wishlist.length > 0);
    }

    updateCartDropdown() {
        const cartItems = $('.cart-items');
        const cartTotal = $('#cart-total');
        
        if (this.items.length === 0) {
            cartItems.html(`
                <div class="empty-cart text-center py-3">
                    <i class="fas fa-shopping-cart fa-2x text-muted"></i>
                    <p class="text-muted mt-2">Your cart is empty</p>
                </div>
            `);
            cartTotal.text('0.00');
        } else {
            let total = 0;
            let itemsHtml = '';
            
            this.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                itemsHtml += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
            
            cartItems.html(itemsHtml);
            cartTotal.text(total.toFixed(2));
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    getCartTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Search functionality
    handleSearch(e) {
        const query = $(e.target).val().trim().toLowerCase();
        
        if (query.length < 2) {
            $('.search-suggestions').hide();
            return;
        }

        // Mock search data - in a real app, this would come from an API
        const manhwaData = [
            { id: 1, title: 'Solo Leveling', genre: 'Action, Fantasy', price: 15.99 },
            { id: 2, title: 'Tower of God', genre: 'Adventure, Fantasy', price: 19.99 },
            { id: 3, title: 'The God of High School', genre: 'Action, Martial Arts', price: 17.99 },
            { id: 4, title: 'Noblesse', genre: 'Supernatural, Action', price: 16.99 },
            { id: 5, title: 'True Beauty', genre: 'Romance, Drama', price: 14.99 },
            { id: 6, title: 'Lookism', genre: 'Drama, School Life', price: 13.99 },
            { id: 7, title: 'Sweet Home', genre: 'Horror, Thriller', price: 18.99 },
            { id: 8, title: 'Cheese in the Trap', genre: 'Romance, Drama', price: 16.99 },
            { id: 9, title: 'Unordinary', genre: 'Supernatural, School', price: 15.99 },
            { id: 10, title: 'Lore Olympus', genre: 'Romance, Mythology', price: 19.99 }
        ];

        const suggestions = manhwaData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.genre.toLowerCase().includes(query)
        ).slice(0, 5);

        this.displaySearchSuggestions(suggestions, query);
    }

    displaySearchSuggestions(suggestions, query) {
        let suggestionsHtml = '';
        
        if (suggestions.length === 0) {
            suggestionsHtml = '<div class="search-suggestion">No results found</div>';
        } else {
            suggestions.forEach(item => {
                suggestionsHtml += `
                    <div class="search-suggestion" data-id="${item.id}" data-title="${item.title}">
                        <strong>${this.highlightQuery(item.title, query)}</strong>
                        <br>
                        <small class="text-muted">${item.genre} - $${item.price}</small>
                    </div>
                `;
            });
        }

        // Create suggestions dropdown if it doesn't exist
        if (!$('.search-suggestions').length) {
            $('.search .input-group').append('<div class="search-suggestions"></div>');
        }

        $('.search-suggestions').html(suggestionsHtml).show();
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    selectSearchSuggestion(e) {
        const suggestion = $(e.currentTarget);
        const title = suggestion.data('title');
        const id = suggestion.data('id');
        
        $('.search input[type="text"]').val(title);
        $('.search-suggestions').hide();
        
        // Redirect to product page or catalog with filter
        if (id) {
            window.location.href = `details.html?id=${id}`;
        }
    }

    // Toast notification system
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        if (!$('.toast-container').length) {
            $('body').append('<div class="toast-container"></div>');
        }

        const toast = $(`
            <div class="toast ${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                ${message}
            </div>
        `);

        $('.toast-container').append(toast);
        
        // Show toast
        setTimeout(() => toast.addClass('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Product filtering and sorting
class ProductFilter {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilters = {
            genre: '',
            priceRange: '',
            rating: '',
            sortBy: 'newest'
        };
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Genre filter
            if (this.currentFilters.genre && !product.genres.includes(this.currentFilters.genre)) {
                return false;
            }

            // Price filter
            if (this.currentFilters.priceRange) {
                const [min, max] = this.currentFilters.priceRange.split('-').map(Number);
                if (product.price < min || product.price > max) {
                    return false;
                }
            }

            // Rating filter
            if (this.currentFilters.rating && product.rating < this.currentFilters.rating) {
                return false;
            }

            return true;
        });

        this.sortProducts();
        this.displayProducts();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.currentFilters.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    return new Date(b.releaseDate) - new Date(a.releaseDate);
            }
        });
    }

    displayProducts() {
        // This would be implemented in individual pages
        console.log('Displaying filtered products:', this.filteredProducts);
    }
}

// Newsletter subscription
function subscribeNewsletter() {
    const email = $('input[type="email"]').val();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        cart.showToast('Thank you for subscribing to our newsletter!', 'success');
        $('input[type="email"]').val('');
    } else {
        cart.showToast('Please enter a valid email address', 'error');
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000);
                return false;
            }
        }
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize everything when DOM is ready
$(document).ready(function() {
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize lazy loading if supported
    if ('IntersectionObserver' in window) {
        initLazyLoading();
    }

    // Newsletter subscription
    $('.footer button[type="button"]').click(subscribeNewsletter);
    $('.footer input[type="email"]').keypress(function(e) {
        if (e.which === 13) {
            subscribeNewsletter();
        }
    });

    // Add fade-in animation to product cards
    $('.product-card').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's').addClass('fade-in');
    });

    // Mobile menu enhancements
    $('.navbar-toggler').click(function() {
        setTimeout(() => {
            if ($('.navbar-collapse').hasClass('show')) {
                $('body').addClass('menu-open');
            } else {
                $('body').removeClass('menu-open');
            }
        }, 300);
    });

    // Quantity selector functionality
    $(document).on('click', '.quantity-btn', function() {
        const input = $(this).siblings('.quantity-input');
        const currentVal = parseInt(input.val()) || 1;
        const isIncrement = $(this).hasClass('quantity-plus');
        
        if (isIncrement) {
            input.val(currentVal + 1);
        } else if (currentVal > 1) {
            input.val(currentVal - 1);
        }
    });

    // Back to top button
    const backToTop = $('<button class="btn btn-primary back-to-top" style="position: fixed; bottom: 20px; right: 20px; display: none; z-index: 1000; border-radius: 50%; width: 50px; height: 50px;"><i class="fas fa-arrow-up"></i></button>');
    $('body').append(backToTop);

    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    });

    backToTop.click(function() {
        $('html, body').animate({scrollTop: 0}, 600);
        return false;
    });
});

// Export for use in other files
window.ShoppingCart = ShoppingCart;
window.ProductFilter = ProductFilter;