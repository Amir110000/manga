// Catalog page JavaScript functionality

class CatalogManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = 'grid';
        this.currentFilters = {
            genres: [],
            priceRange: null,
            rating: [],
            status: [],
            search: ''
        };
        this.currentSort = 'newest';
        this.allProducts = [];
        this.filteredProducts = [];
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.initializeFilters();
        this.renderProducts();
    }

    // Mock product data - in a real app, this would come from an API
    loadProducts() {
        this.allProducts = [
            {
                id: 1, title: 'Solo Leveling', genres: ['action', 'fantasy'], price: 15.99, 
                rating: 4.9, status: 'completed', image: 'img/cover1.jpg',
                author: 'Chugong', description: 'The ultimate power fantasy manhwa',
                releaseDate: '2023-01-15', popularity: 95
            },
            {
                id: 2, title: 'Tower of God', genres: ['adventure', 'fantasy'], price: 19.99,
                rating: 4.7, status: 'ongoing', image: 'img/cover2.jpg',
                author: 'SIU', description: 'Epic fantasy adventure',
                releaseDate: '2022-12-20', popularity: 88
            },
            {
                id: 3, title: 'The God of High School', genres: ['action', 'martial-arts'], price: 17.99,
                rating: 4.8, status: 'completed', image: 'img/cover3.jpg',
                author: 'Yongje Park', description: 'Action-packed martial arts manhwa',
                releaseDate: '2023-02-10', popularity: 82
            },
            {
                id: 4, title: 'Noblesse', genres: ['supernatural', 'action'], price: 16.99,
                rating: 4.6, status: 'completed', image: 'img/cover4.jpg',
                author: 'Jeho Son', description: 'Supernatural action adventure',
                releaseDate: '2022-11-15', popularity: 79
            },
            {
                id: 5, title: 'True Beauty', genres: ['romance', 'drama'], price: 14.99,
                rating: 4.9, status: 'ongoing', image: 'img/cover5.jpg',
                author: 'Yaongyi', description: 'Romantic drama manhwa',
                releaseDate: '2023-03-05', popularity: 91
            },
            {
                id: 6, title: 'Lookism', genres: ['drama', 'school'], price: 13.99,
                rating: 4.5, status: 'ongoing', image: 'img/cover6.jpg',
                author: 'Taejoon Park', description: 'School life drama',
                releaseDate: '2023-01-20', popularity: 75
            },
            {
                id: 7, title: 'Sweet Home', genres: ['horror', 'thriller'], price: 18.99,
                rating: 4.7, status: 'completed', image: 'img/cover1.jpg',
                author: 'Youngchan Hwang', description: 'Horror thriller manhwa',
                releaseDate: '2022-10-12', popularity: 86
            },
            {
                id: 8, title: 'Cheese in the Trap', genres: ['romance', 'drama'], price: 16.99,
                rating: 4.4, status: 'completed', image: 'img/cover2.jpg',
                author: 'Soonkki', description: 'College romance drama',
                releaseDate: '2022-09-08', popularity: 73
            },
            {
                id: 9, title: 'Unordinary', genres: ['supernatural', 'school'], price: 15.99,
                rating: 4.6, status: 'ongoing', image: 'img/cover3.jpg',
                author: 'uru-chan', description: 'Supernatural school story',
                releaseDate: '2023-02-28', popularity: 77
            },
            {
                id: 10, title: 'Lore Olympus', genres: ['romance', 'mythology'], price: 19.99,
                rating: 4.8, status: 'ongoing', image: 'img/cover4.jpg',
                author: 'Rachel Smythe', description: 'Modern retelling of Greek mythology',
                releaseDate: '2023-01-10', popularity: 89
            },
            {
                id: 11, title: 'The Breaker', genres: ['action', 'martial-arts'], price: 17.99,
                rating: 4.7, status: 'hiatus', image: 'img/cover5.jpg',
                author: 'Jeon Geuk-jin', description: 'Martial arts action manhwa',
                releaseDate: '2022-08-15', popularity: 81
            },
            {
                id: 12, title: 'Bastard', genres: ['thriller', 'psychological'], price: 16.99,
                rating: 4.8, status: 'completed', image: 'img/cover6.jpg',
                author: 'Youngchan Hwang', description: 'Psychological thriller',
                releaseDate: '2022-07-20', popularity: 84
            }
        ];
        
        this.filteredProducts = [...this.allProducts];
    }

    bindEvents() {
        // Filter events
        $('input[type="checkbox"]').on('change', this.handleFilterChange.bind(this));
        $('input[type="radio"]').on('change', this.handleFilterChange.bind(this));
        $('#priceRange').on('input', this.handlePriceRangeChange.bind(this));
        $('#clearFilters').on('click', this.clearAllFilters.bind(this));

        // Sort events
        $('#sortBy').on('change', this.handleSortChange.bind(this));

        // View toggle events
        $('.view-toggle button').on('click', this.handleViewChange.bind(this));

        // Pagination events
        $(document).on('click', '.page-link', this.handlePageChange.bind(this));

        // Search events
        $('.search input[type="text"]').on('input', this.handleSearch.bind(this));
    }

    initializeFilters() {
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const genre = urlParams.get('genre');
        
        if (genre) {
            $(`#genre-${genre}`).prop('checked', true);
            this.currentFilters.genres.push(genre);
        }

        // Initialize price range display
        this.updatePriceRangeDisplay();
    }

    handleFilterChange(e) {
        const input = $(e.target);
        const filterType = input.attr('name') || input.attr('id').split('-')[0];
        const value = input.val();

        if (input.attr('type') === 'checkbox') {
            if (filterType === 'genre') {
                if (input.is(':checked')) {
                    this.currentFilters.genres.push(value);
                } else {
                    this.currentFilters.genres = this.currentFilters.genres.filter(g => g !== value);
                }
            } else if (filterType === 'rating') {
                if (input.is(':checked')) {
                    this.currentFilters.rating.push(parseInt(value));
                } else {
                    this.currentFilters.rating = this.currentFilters.rating.filter(r => r !== parseInt(value));
                }
            } else if (filterType === 'status') {
                if (input.is(':checked')) {
                    this.currentFilters.status.push(value);
                } else {
                    this.currentFilters.status = this.currentFilters.status.filter(s => s !== value);
                }
            }
        } else if (input.attr('type') === 'radio' && input.attr('name') === 'priceRange') {
            this.currentFilters.priceRange = value;
        }

        this.applyFilters();
    }

    handlePriceRangeChange(e) {
        const value = $(e.target).val();
        this.updatePriceRangeDisplay(value);
        
        // Apply as filter
        if (value < 30) {
            this.currentFilters.priceRange = `0-${value}`;
        } else {
            this.currentFilters.priceRange = null;
        }
        
        this.applyFilters();
    }

    updatePriceRangeDisplay(value = 30) {
        $('#priceValue').text(`$${value}`);
    }

    handleSortChange(e) {
        this.currentSort = $(e.target).val();
        this.applyFilters();
    }

    handleViewChange(e) {
        const newView = $(e.target).data('view');
        if (newView === this.currentView) return;

        this.currentView = newView;
        
        // Update button states
        $('.view-toggle button').removeClass('active');
        $(e.target).addClass('active');

        // Update container classes
        if (newView === 'list') {
            $('#productsContainer').removeClass('grid-view').addClass('list-view row');
        } else {
            $('#productsContainer').removeClass('list-view').addClass('grid-view row');
        }

        this.renderProducts();
    }

    handlePageChange(e) {
        e.preventDefault();
        const link = $(e.target);
        
        if (link.parent().hasClass('disabled')) return;
        
        const text = link.text();
        if (text === 'Previous') {
            this.currentPage = Math.max(1, this.currentPage - 1);
        } else if (text === 'Next') {
            const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
            this.currentPage = Math.min(totalPages, this.currentPage + 1);
        } else if (!isNaN(text)) {
            this.currentPage = parseInt(text);
        }

        this.renderProducts();
        this.updatePagination();
        
        // Scroll to top of results
        $('html, body').animate({
            scrollTop: $('#productsGrid').offset().top - 100
        }, 500);
    }

    handleSearch(e) {
        const query = $(e.target).val().toLowerCase().trim();
        this.currentFilters.search = query;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            // Genre filter
            if (this.currentFilters.genres.length > 0) {
                const hasMatchingGenre = this.currentFilters.genres.some(genre => 
                    product.genres.includes(genre)
                );
                if (!hasMatchingGenre) return false;
            }

            // Price filter
            if (this.currentFilters.priceRange) {
                const [min, max] = this.currentFilters.priceRange.split('-').map(Number);
                if (product.price < min || (max && product.price > max)) {
                    return false;
                }
            }

            // Rating filter
            if (this.currentFilters.rating.length > 0) {
                const hasMatchingRating = this.currentFilters.rating.some(rating => 
                    product.rating >= rating
                );
                if (!hasMatchingRating) return false;
            }

            // Status filter
            if (this.currentFilters.status.length > 0) {
                if (!this.currentFilters.status.includes(product.status)) {
                    return false;
                }
            }

            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchableText = `${product.title} ${product.author} ${product.genres.join(' ')}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        this.sortProducts();
        this.currentPage = 1; // Reset to first page when filters change
        this.renderProducts();
        this.updateResultsCount();
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.currentSort) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'popularity':
                    return b.popularity - a.popularity;
                case 'oldest':
                    return new Date(a.releaseDate) - new Date(b.releaseDate);
                case 'newest':
                default:
                    return new Date(b.releaseDate) - new Date(a.releaseDate);
            }
        });
    }

    renderProducts() {
        const container = $('#productsContainer');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (pageProducts.length === 0) {
            container.html(`
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No manhwa found</h4>
                    <p class="text-muted">Try adjusting your filters or search terms</p>
                </div>
            `);
            return;
        }

        let html = '';
        pageProducts.forEach((product, index) => {
            if (this.currentView === 'grid') {
                html += this.renderGridProduct(product, index);
            } else {
                html += this.renderListProduct(product, index);
            }
        });

        container.html(html);
        this.updatePagination();

        // Add fade-in animation
        $('.product-card').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's').addClass('fade-in');
        });
    }

    renderGridProduct(product, index) {
        const stars = this.generateStars(product.rating);
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                <div class="product-card card mb-3">
                    <div class="product-image">
                        <a href="details.html?id=${product.id}">
                            <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        </a>
                        <div class="product-overlay">
                            <div class="product-info text-center">
                                <h6>${product.title}</h6>
                                <div class="rating mb-2">
                                    ${stars}
                                    <span class="text-muted">(${product.rating})</span>
                                </div>
                                <p class="text-muted small">${product.genres.join(', ')}</p>
                                <div class="product-actions">
                                    <button class="btn btn-sm btn-outline-light add-to-cart" 
                                        data-id="${product.id}" data-title="${product.title}" 
                                        data-price="${product.price}" data-image="${product.image}">
                                        <i class="fas fa-cart-plus"></i> Add to Cart
                                    </button>
                                    <button class="btn btn-sm btn-outline-light add-to-wishlist" data-id="${product.id}">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">
                            <a href="details.html?id=${product.id}">${product.title}</a>
                        </h6>
                        <p class="card-text">
                            <span class="price text-success font-weight-bold">$${product.price}</span>
                            <span class="badge badge-${this.getStatusBadgeClass(product.status)} badge-sm ml-2">
                                ${product.status}
                            </span>
                        </p>
                        <button class="btn btn-primary btn-sm add-to-cart" 
                            data-id="${product.id}" data-title="${product.title}" 
                            data-price="${product.price}" data-image="${product.image}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderListProduct(product, index) {
        const stars = this.generateStars(product.rating);
        return `
            <div class="col-12 mb-3">
                <div class="product-card card">
                    <div class="row no-gutters h-100">
                        <div class="col-md-2">
                            <div class="product-image h-100">
                                <a href="details.html?id=${product.id}">
                                    <img src="${product.image}" class="card-img h-100" alt="${product.title}" style="object-fit: cover;">
                                </a>
                            </div>
                        </div>
                        <div class="col-md-10">
                            <div class="card-body d-flex flex-column h-100">
                                <div class="flex-grow-1">
                                    <h5 class="card-title">
                                        <a href="details.html?id=${product.id}">${product.title}</a>
                                    </h5>
                                    <p class="card-text text-muted">by ${product.author}</p>
                                    <div class="rating mb-2">
                                        ${stars}
                                        <span class="text-muted">(${product.rating})</span>
                                    </div>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-text">
                                        <small class="text-muted">Genres: ${product.genres.join(', ')}</small>
                                    </p>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <div>
                                        <span class="price text-success font-weight-bold h5">$${product.price}</span>
                                        <span class="badge badge-${this.getStatusBadgeClass(product.status)} ml-2">
                                            ${product.status}
                                        </span>
                                    </div>
                                    <div>
                                        <button class="btn btn-outline-secondary btn-sm add-to-wishlist mr-2" data-id="${product.id}">
                                            <i class="fas fa-heart"></i>
                                        </button>
                                        <button class="btn btn-primary add-to-cart" 
                                            data-id="${product.id}" data-title="${product.title}" 
                                            data-price="${product.price}" data-image="${product.image}">
                                            <i class="fas fa-cart-plus"></i> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars += '<i class="fas fa-star-half-alt text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-warning"></i>';
            }
        }
        return stars;
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'completed': return 'success';
            case 'ongoing': return 'primary';
            case 'hiatus': return 'warning';
            default: return 'secondary';
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const pagination = $('#catalogPagination');
        
        if (totalPages <= 1) {
            pagination.hide();
            return;
        }
        
        pagination.show();
        let html = '';

        // Previous button
        html += `<li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" tabindex="-1">Previous</a>
        </li>`;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<li class="page-item ${i === this.currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>`;
        }

        // Next button
        html += `<li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#">Next</a>
        </li>`;

        pagination.html(html);
    }

    updateResultsCount() {
        $('#resultsCount').text(this.filteredProducts.length);
    }

    clearAllFilters() {
        // Clear checkboxes and radios
        $('input[type="checkbox"], input[type="radio"]').prop('checked', false);
        
        // Reset price range
        $('#priceRange').val(30);
        this.updatePriceRangeDisplay(30);
        
        // Reset filters object
        this.currentFilters = {
            genres: [],
            priceRange: null,
            rating: [],
            status: [],
            search: ''
        };

        // Clear search
        $('.search input[type="text"]').val('');

        // Reset sort
        $('#sortBy').val('newest');
        this.currentSort = 'newest';

        // Apply filters
        this.applyFilters();

        // Show toast
        if (window.cart) {
            window.cart.showToast('All filters cleared', 'info');
        }
    }
}

// Initialize catalog when DOM is ready
$(document).ready(function() {
    window.catalogManager = new CatalogManager();
});