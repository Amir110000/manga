// Authentication functionality for Manhwa Store

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthState();
    }

    bindEvents() {
        // Login form
        $('#loginForm').on('submit', this.handleLogin.bind(this));
        
        // Register form
        $('#registerForm').on('submit', this.handleRegister.bind(this));
        
        // Password toggle
        $('#togglePassword').on('click', this.togglePasswordVisibility.bind(this));
        $('#toggleConfirmPassword').on('click', this.toggleConfirmPasswordVisibility.bind(this));
        
        // Social login
        $('#googleLogin').on('click', this.handleGoogleLogin.bind(this));
        $('#facebookLogin').on('click', this.handleFacebookLogin.bind(this));
        
        // Forgot password
        $('#forgotPassword').on('click', this.handleForgotPassword.bind(this));
        
        // Form validation
        $('.needs-validation').on('submit', this.validateForm.bind(this));
        
        // Real-time validation
        $('input[type="email"]').on('blur', this.validateEmail.bind(this));
        $('input[type="password"]').on('input', this.validatePassword.bind(this));
        $('#confirmPassword').on('input', this.validateConfirmPassword.bind(this));
    }

    handleLogin(e) {
        e.preventDefault();
        
        const form = $(e.target);
        const formData = {
            email: $('#email').val(),
            password: $('#password').val(),
            remember: $('#rememberMe').is(':checked')
        };

        if (!this.validateLoginForm(formData)) {
            form.addClass('was-validated');
            return;
        }

        // Show loading state
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Signing In...').prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            if (this.authenticateUser(formData)) {
                this.showToast('Login successful! Welcome back.', 'success');
                
                // Store user session
                this.setUserSession({
                    email: formData.email,
                    loggedIn: true,
                    loginTime: new Date().toISOString()
                });

                // Redirect to intended page or dashboard
                const redirectUrl = this.getRedirectUrl() || 'index.html';
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                this.showToast('Invalid email or password. Please try again.', 'error');
                submitBtn.html(originalText).prop('disabled', false);
            }
        }, 1500);
    }

    handleRegister(e) {
        e.preventDefault();
        
        const form = $(e.target);
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            confirmPassword: $('#confirmPassword').val(),
            terms: $('#agreeTerms').is(':checked')
        };

        if (!this.validateRegisterForm(formData)) {
            form.addClass('was-validated');
            return;
        }

        // Show loading state
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Creating Account...').prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            if (this.registerUser(formData)) {
                this.showToast('Account created successfully! Please check your email to verify your account.', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showToast('Registration failed. Email might already be in use.', 'error');
                submitBtn.html(originalText).prop('disabled', false);
            }
        }, 1500);
    }

    validateLoginForm(data) {
        let isValid = true;

        // Email validation
        if (!data.email || !this.isValidEmail(data.email)) {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            $('#email').removeClass('is-invalid').addClass('is-valid');
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            $('#password').addClass('is-invalid');
            isValid = false;
        } else {
            $('#password').removeClass('is-invalid').addClass('is-valid');
        }

        return isValid;
    }

    validateRegisterForm(data) {
        let isValid = true;

        // First name validation
        if (!data.firstName || data.firstName.length < 2) {
            $('#firstName').addClass('is-invalid');
            isValid = false;
        } else {
            $('#firstName').removeClass('is-invalid').addClass('is-valid');
        }

        // Last name validation
        if (!data.lastName || data.lastName.length < 2) {
            $('#lastName').addClass('is-invalid');
            isValid = false;
        } else {
            $('#lastName').removeClass('is-invalid').addClass('is-valid');
        }

        // Email validation
        if (!data.email || !this.isValidEmail(data.email)) {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            $('#email').removeClass('is-invalid').addClass('is-valid');
        }

        // Password validation
        if (!data.password || !this.isValidPassword(data.password)) {
            $('#password').addClass('is-invalid');
            isValid = false;
        } else {
            $('#password').removeClass('is-invalid').addClass('is-valid');
        }

        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            $('#confirmPassword').addClass('is-invalid');
            isValid = false;
        } else {
            $('#confirmPassword').removeClass('is-invalid').addClass('is-valid');
        }

        // Terms agreement
        if (!data.terms) {
            $('#agreeTerms').addClass('is-invalid');
            isValid = false;
        } else {
            $('#agreeTerms').removeClass('is-invalid').addClass('is-valid');
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    validateEmail(e) {
        const email = $(e.target).val();
        if (email && !this.isValidEmail(email)) {
            $(e.target).addClass('is-invalid');
        } else if (email) {
            $(e.target).removeClass('is-invalid').addClass('is-valid');
        }
    }

    validatePassword(e) {
        const password = $(e.target).val();
        const strengthBar = $('#passwordStrength');
        
        if (password) {
            const strength = this.getPasswordStrength(password);
            this.updatePasswordStrength(strength, strengthBar);
            
            if (this.isValidPassword(password)) {
                $(e.target).removeClass('is-invalid').addClass('is-valid');
            } else {
                $(e.target).addClass('is-invalid');
            }
        }
    }

    validateConfirmPassword(e) {
        const confirmPassword = $(e.target).val();
        const password = $('#password').val();
        
        if (confirmPassword && confirmPassword !== password) {
            $(e.target).addClass('is-invalid');
        } else if (confirmPassword) {
            $(e.target).removeClass('is-invalid').addClass('is-valid');
        }
    }

    getPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;
        
        return strength;
    }

    updatePasswordStrength(strength, strengthBar) {
        if (!strengthBar.length) return;
        
        const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthClass = ['danger', 'warning', 'info', 'primary', 'success'];
        
        strengthBar.removeClass('bg-danger bg-warning bg-info bg-primary bg-success');
        strengthBar.addClass(`bg-${strengthClass[strength - 1] || 'danger'}`);
        strengthBar.css('width', `${(strength / 5) * 100}%`);
        strengthBar.attr('aria-valuenow', strength);
        
        const strengthLabel = strengthBar.siblings('.password-strength-text');
        if (strengthLabel.length) {
            strengthLabel.text(strengthText[strength - 1] || 'Very Weak');
        }
    }

    togglePasswordVisibility(e) {
        const passwordField = $('#password');
        const icon = $(e.target).find('i');
        
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }

    toggleConfirmPasswordVisibility(e) {
        const passwordField = $('#confirmPassword');
        const icon = $(e.target).find('i');
        
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }

    handleGoogleLogin(e) {
        e.preventDefault();
        this.showToast('Google login integration coming soon!', 'info');
        // In a real app, this would integrate with Google OAuth
    }

    handleFacebookLogin(e) {
        e.preventDefault();
        this.showToast('Facebook login integration coming soon!', 'info');
        // In a real app, this would integrate with Facebook OAuth
    }

    handleForgotPassword(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address:');
        if (email && this.isValidEmail(email)) {
            this.showToast('Password reset instructions sent to your email!', 'success');
        } else if (email) {
            this.showToast('Please enter a valid email address.', 'error');
        }
    }

    authenticateUser(credentials) {
        // Simulate authentication - in a real app, this would call an API
        const validUsers = [
            { email: 'demo@manhwastore.com', password: 'password123' },
            { email: 'user@example.com', password: 'mypassword' }
        ];
        
        return validUsers.some(user => 
            user.email === credentials.email && user.password === credentials.password
        );
    }

    registerUser(userData) {
        // Simulate registration - in a real app, this would call an API
        const existingEmails = ['admin@manhwastore.com', 'taken@example.com'];
        
        return !existingEmails.includes(userData.email);
    }

    setUserSession(userData) {
        localStorage.setItem('manhwa_user', JSON.stringify(userData));
        this.updateAuthUI(true, userData);
    }

    getUserSession() {
        const userData = localStorage.getItem('manhwa_user');
        return userData ? JSON.parse(userData) : null;
    }

    clearUserSession() {
        localStorage.removeItem('manhwa_user');
        this.updateAuthUI(false);
    }

    checkAuthState() {
        const user = this.getUserSession();
        if (user && user.loggedIn) {
            this.updateAuthUI(true, user);
        }
    }

    updateAuthUI(isLoggedIn, userData = null) {
        const accountDropdown = $('#accountDropdown').siblings('.dropdown-menu');
        
        if (isLoggedIn && userData) {
            accountDropdown.html(`
                <div class="dropdown-header">
                    <small>Welcome back!</small><br>
                    <strong>${userData.email}</strong>
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="profile.html">
                    <i class="fas fa-user"></i> My Account
                </a>
                <a class="dropdown-item" href="orders.html">
                    <i class="fas fa-shopping-bag"></i> My Orders
                </a>
                <a class="dropdown-item" href="wishlist.html">
                    <i class="fas fa-heart"></i> Wishlist
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `);
            
            // Bind logout event
            $('#logoutBtn').on('click', this.handleLogout.bind(this));
        } else {
            accountDropdown.html(`
                <a class="dropdown-item" href="login.html">Login</a>
                <a class="dropdown-item" href="register.html">Register</a>
            `);
        }
    }

    handleLogout(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
            this.clearUserSession();
            this.showToast('You have been logged out successfully.', 'info');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    getRedirectUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('redirect');
    }

    showToast(message, type = 'info') {
        if (window.cart && window.cart.showToast) {
            window.cart.showToast(message, type);
        } else {
            // Fallback alert
            alert(message);
        }
    }

    // Utility method to protect pages that require authentication
    requireAuth() {
        const user = this.getUserSession();
        if (!user || !user.loggedIn) {
            const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `login.html?redirect=${currentUrl}`;
            return false;
        }
        return true;
    }
}

// Initialize authentication when DOM is ready
$(document).ready(function() {
    window.authManager = new AuthManager();
    
    // Add some demo credentials info for testing
    if ($('#loginForm').length) {
        $('<div class="alert alert-info mt-3">' +
          '<small><strong>Demo Credentials:</strong><br>' +
          'Email: demo@manhwastore.com<br>' +
          'Password: password123</small>' +
          '</div>').insertAfter('#loginForm');
    }
});