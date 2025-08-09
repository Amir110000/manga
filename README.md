# 🌟 Manhwa Store - Premium Korean Webtoons E-commerce Platform

A modern, responsive e-commerce website for selling Korean manhwa (webtoons) with a beautiful user interface and comprehensive shopping features.

## ✨ Features

### 🏪 Core E-commerce Features
- **Product Catalog** - Browse hundreds of manhwa titles with advanced filtering
- **Shopping Cart** - Add items, modify quantities, and manage purchases
- **Wishlist** - Save favorite manhwa for later
- **User Authentication** - Secure login/register system
- **Search & Filters** - Find manhwa by title, author, genre, price, and rating
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices

### 🎨 Modern UI/UX
- **Beautiful Design** - Modern card-based layout with smooth animations
- **Dark Theme** - Elegant dark color scheme perfect for reading platforms
- **Interactive Elements** - Hover effects, transitions, and micro-interactions
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Professional loading indicators and progress feedback

### 📱 Pages Included
1. **Homepage** (`index.html`) - Hero slider, featured manhwa, genre categories
2. **Catalog** (`catalog.html`) - Complete product listing with filters and sorting
3. **Product Details** (`details.html`) - Individual manhwa information and reviews
4. **Shopping Cart** (`cart.html`) - Cart management and order summary
5. **Login/Register** (`login.html`) - User authentication with validation
6. **Checkout** - Secure payment process (referenced)

### 🛒 Shopping Features
- **Smart Cart Management** - Persistent cart using localStorage
- **Quantity Controls** - Increment/decrement with validation
- **Price Calculations** - Automatic subtotal, tax, and shipping calculations
- **Free Shipping** - Automatic free shipping on orders over $50
- **Move to Wishlist** - Easy item management between cart and wishlist

### 🔍 Advanced Filtering
- **Genre Filtering** - Action, Romance, Fantasy, Drama, Comedy, Thriller, Supernatural
- **Price Range** - Customizable price filtering with slider
- **Rating Filter** - Filter by star ratings (3+, 4+, 5 stars)
- **Status Filter** - Completed, Ongoing, or On Hiatus series
- **Real-time Search** - Live search with suggestions and highlighting

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for best experience)

### Installation
1. **Clone or download** the project files to your local machine
2. **Open in browser** - Simply open `index.html` in your web browser
3. **Or use a local server** (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

### Demo Credentials
For testing the login functionality:
- **Email:** demo@manhwastore.com
- **Password:** password123

## 🗂️ File Structure

```
manhwa-store/
├── index.html              # Homepage
├── catalog.html            # Product catalog
├── cart.html              # Shopping cart
├── login.html             # Login page
├── details.html           # Product details (existing)
├── css/
│   ├── bootstrap.min.css  # Bootstrap framework
│   ├── main.css          # Main theme styles
│   └── store.css         # E-commerce specific styles
├── js/
│   ├── jquery-3.4.1.min.js
│   ├── bootstrap.min.js
│   ├── main.js           # Basic functionality
│   ├── store.js          # Shopping cart & core features
│   ├── catalog.js        # Catalog filtering & sorting
│   ├── cart-page.js      # Cart page functionality
│   └── auth.js           # Authentication system
├── img/                  # Product images and assets
└── README.md
```

## 🎯 Key Features Walkthrough

### Shopping Cart System
- **Persistent Storage** - Cart data saved in localStorage
- **Real-time Updates** - Instant quantity and price updates
- **Smart Validation** - Quantity limits and input validation
- **Toast Notifications** - User feedback for all actions

### Product Filtering
- **Multi-criteria Filtering** - Combine genre, price, rating, and status filters
- **URL Parameters** - Direct links to filtered results (e.g., `catalog.html?genre=romance`)
- **Smart Pagination** - Efficient navigation through large product sets
- **View Switching** - Toggle between grid and list views

### User Authentication
- **Form Validation** - Real-time validation with visual feedback
- **Password Strength** - Dynamic password strength indicator
- **Social Login** - Ready for Google/Facebook integration
- **Session Management** - Secure session handling with localStorage

## 🎨 Customization

### Colors & Branding
The main brand color is defined in CSS as `#ab201c` (deep red). To customize:

```css
/* In css/main.css and css/store.css */
:root {
  --primary-color: #ab201c;
  --primary-hover: #8a1915;
  --dark-bg: #070707;
  --light-text: #faf9f9;
}
```

### Adding Products
Products are currently defined in JavaScript arrays. To add new manhwa:

```javascript
// In js/catalog.js - allProducts array
{
  id: 13,
  title: 'New Manhwa Title',
  genres: ['romance', 'drama'],
  price: 16.99,
  rating: 4.8,
  status: 'ongoing',
  image: 'img/new-cover.jpg',
  author: 'Author Name',
  description: 'Manhwa description...',
  releaseDate: '2024-01-01',
  popularity: 85
}
```

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup and modern standards
- **CSS3** - Flexbox, Grid, animations, and responsive design
- **Bootstrap 4** - Responsive framework and components
- **JavaScript (ES6+)** - Modern JavaScript with classes and modules
- **jQuery** - DOM manipulation and event handling
- **Font Awesome** - Icons and visual elements
- **localStorage** - Client-side data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- **Lazy Loading** - Images load as needed (intersection observer)
- **Efficient Filtering** - Client-side filtering for fast results
- **Minimal Dependencies** - Optimized file sizes
- **Responsive Images** - Properly sized images for different screens

## 🛡️ Security Features

- **Input Validation** - Client-side and server-ready validation
- **XSS Prevention** - Proper input sanitization
- **CSRF Protection** - Ready for server-side implementation
- **Secure Sessions** - Best practices for session management

## 🔮 Future Enhancements

### Planned Features
- **Real Backend Integration** - Connect to actual API/database
- **Payment Processing** - Stripe/PayPal integration
- **User Reviews** - Rating and review system
- **Reading Interface** - In-browser manhwa reader
- **Social Features** - User profiles and recommendations
- **Admin Panel** - Content management system

### API Integration Points
The frontend is designed to easily integrate with a backend API:

```javascript
// Ready for API integration
async function fetchProducts(filters) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  return response.json();
}
```

## 📱 Mobile Experience

The website is fully responsive and optimized for mobile devices:
- **Touch-friendly** - Large buttons and touch targets
- **Swipe Gestures** - Carousel navigation
- **Mobile Menu** - Collapsible navigation
- **Optimized Images** - Fast loading on mobile networks

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across devices
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Demo

Visit the live demo: Open `index.html` in your browser and explore the full shopping experience!

### Sample User Journey
1. **Browse** the homepage featuring popular manhwa
2. **Explore** the catalog with filtering options
3. **Add items** to your cart and wishlist
4. **Login** with demo credentials
5. **Review** your cart and proceed to checkout
6. **Experience** the responsive design on different devices

---

**Built with ❤️ for manhwa enthusiasts worldwide**

*Need help? Check the demo credentials above or explore the various features by clicking around the interface!*
