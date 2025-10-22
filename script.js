// Global variables
let products = [];
let categories = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Initialize demo data
function initializeDemoData() {
    // Chỉ seed dữ liệu demo khi chưa có dữ liệu trong localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (!Array.isArray(storedUsers) || storedUsers.length === 0) {
        users = [{
                id: 1,
                email: 'customer@demo.com',
                password: '123456',
                fullname: 'Nguyễn Văn A',
                phone: '0123456789',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                birthday: '1990-01-01',
                gender: 'male',
                role: 'customer',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: 'admin@demo.com',
                password: 'admin123',
                fullname: 'Admin TechStore',
                phone: '0987654321',
                address: '456 Đường XYZ, Quận 2, TP.HCM',
                birthday: '1985-05-15',
                gender: 'male',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        users = storedUsers;
    }

    // Demo orders: chỉ khởi tạo khi chưa có
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (!Array.isArray(storedOrders) || storedOrders.length === 0) {
        orders = [{
                id: 1,
                customerId: 1,
                customerName: 'Nguyễn Văn A',
                customerEmail: 'customer@demo.com',
                items: [
                    { productId: 1, name: 'iPhone 15 Pro Max', price: 29990000, quantity: 1 },
                    { productId: 3, name: 'AirPods Pro 2', price: 5990000, quantity: 1 }
                ],
                total: 35990000,
                status: 'delivered',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                paymentMethod: 'cod',
                address: '123 Đường ABC, Quận 1, TP.HCM'
            },
            {
                id: 2,
                customerId: 1,
                customerName: 'Nguyễn Văn A',
                customerEmail: 'customer@demo.com',
                items: [
                    { productId: 2, name: 'MacBook Air M2', price: 25990000, quantity: 1 }
                ],
                total: 25990000,
                status: 'processing',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                paymentMethod: 'bank',
                address: '123 Đường ABC, Quận 1, TP.HCM'
            }
        ];
        localStorage.setItem('orders', JSON.stringify(orders));
    } else {
        orders = storedOrders;
    }
}

// Load products data (prefer localStorage, fallback to defaults)
async function loadProducts() {
    try {
        // Kiểm tra dữ liệu đã được lưu tùy biến bởi admin chưa
        const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');

        // Dữ liệu mặc định nhúng sẵn để tránh CORS
        const defaultData = {
            "products": [{
                "id": 1,
                "name": "iPhone 15 Pro Max",
                "price": 29990000,
                "category": "Điện thoại",
                "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&q=80",
                "stock": 50,
                "description": "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch"
            },
            {
                "id": 2,
                "name": "MacBook Air M2",
                "price": 25990000,
                "category": "Laptop",
                "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&q=80",
                "stock": 30,
                "description": "MacBook Air với chip M2, màn hình Liquid Retina 13.6 inch, pin dùng cả ngày"
            },
            {
                "id": 3,
                "name": "AirPods Pro 2",
                "price": 5990000,
                "category": "Phụ kiện",
                "image": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&q=80",
                "stock": 100,
                "description": "AirPods Pro thế hệ 2 với chống ồn chủ động, âm thanh không gian và pin dùng 6 giờ"
            },
            {
                "id": 4,
                "name": "iPad Pro 12.9",
                "price": 21990000,
                "category": "Máy tính bảng",
                "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&q=80",
                "stock": 25,
                "description": "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR và hỗ trợ Apple Pencil"
            },
            {
                "id": 5,
                "name": "Apple Watch Series 9",
                "price": 8990000,
                "category": "Đồng hồ",
                "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&q=80",
                "stock": 75,
                "description": "Apple Watch Series 9 với chip S9, màn hình Always-On Retina và theo dõi sức khỏe nâng cao"
            },
            {
                "id": 6,
                "name": "Samsung Galaxy S24 Ultra",
                "price": 26990000,
                "category": "Điện thoại",
                "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80",
                "stock": 40,
                "description": "Samsung Galaxy S24 Ultra với camera 200MP, S Pen và màn hình Dynamic AMOLED 2X"
            },
            {
                "id": 7,
                "name": "Dell XPS 13",
                "price": 22990000,
                "category": "Laptop",
                "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80",
                "stock": 20,
                "description": "Dell XPS 13 với Intel Core i7, màn hình InfinityEdge 13.4 inch và thiết kế siêu mỏng"
            },
            {
                "id": 8,
                "name": "Sony WH-1000XM5",
                "price": 7990000,
                "category": "Phụ kiện",
                "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
                "stock": 60,
                "description": "Tai nghe Sony WH-1000XM5 với chống ồn hàng đầu thế giới và âm thanh chất lượng cao"
            },
            {
                "id": 9,
                "name": "Gaming Chair Pro",
                "price": 4500000,
                "category": "Phụ kiện",
                "image": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop&q=80",
                "stock": 25,
                "description": "Ghế gaming cao cấp với đệm lưng và cổ, hỗ trợ tối đa cho game thủ"
            },
            {
                "id": 10,
                "name": "Mechanical Keyboard RGB",
                "price": 2500000,
                "category": "Phụ kiện",
                "image": "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&q=80",
                "stock": 80,
                "description": "Bàn phím cơ RGB với switch Cherry MX, đèn LED đa màu và thiết kế gaming"
            }],
            "categories": ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện", "Đồng hồ"]
        };
        const hasCustomData = Array.isArray(storedProducts) && storedProducts.length > 0;
        const hasCustomCategories = Array.isArray(storedCategories) && storedCategories.length > 0;

        products = hasCustomData ? storedProducts : defaultData.products;
        categories = hasCustomCategories ? storedCategories : defaultData.categories;

        // Nếu lần đầu, lưu mặc định vào localStorage để Admin có thể chỉnh sửa
        if (!hasCustomData) localStorage.setItem('products', JSON.stringify(products));
        if (!hasCustomCategories) localStorage.setItem('categories', JSON.stringify(categories));

        // Hiển thị sản phẩm sau khi tải xong (trang chủ / danh sách)
        if (document.getElementById('products-grid')) {
            displayProducts(products);
        }
        
        return { products, categories };
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback data if JSON file fails to load
        products = [{
                id: 1,
                name: "iPhone 15 Pro Max",
                price: 29990000,
                category: "Điện thoại",
                image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&q=80",
                stock: 50,
                description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch"
            },
            {
                id: 2,
                name: "MacBook Air M2",
                price: 25990000,
                category: "Laptop",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&q=80",
                stock: 30,
                description: "MacBook Air với chip M2, màn hình Liquid Retina 13.6 inch, pin dùng cả ngày"
            },
            {
                id: 3,
                name: "AirPods Pro 2",
                price: 5990000,
                category: "Phụ kiện",
                image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&q=80",
                stock: 100,
                description: "AirPods Pro thế hệ 2 với chống ồn chủ động, âm thanh không gian và pin dùng 6 giờ"
            },
            {
                id: 4,
                name: "iPad Pro 12.9",
                price: 21990000,
                category: "Máy tính bảng",
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&q=80",
                stock: 25,
                description: "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR và hỗ trợ Apple Pencil"
            },
            {
                id: 5,
                name: "Apple Watch Series 9",
                price: 8990000,
                category: "Đồng hồ",
                image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&q=80",
                stock: 75,
                description: "Apple Watch Series 9 với chip S9, màn hình Always-On Retina và theo dõi sức khỏe nâng cao"
            },
            {
                id: 6,
                name: "Samsung Galaxy S24 Ultra",
                price: 26990000,
                category: "Điện thoại",
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80",
                stock: 40,
                description: "Samsung Galaxy S24 Ultra với camera 200MP, S Pen và màn hình Dynamic AMOLED 2X"
            },
            {
                id: 7,
                name: "Dell XPS 13",
                price: 22990000,
                category: "Laptop",
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80",
                stock: 20,
                description: "Dell XPS 13 với Intel Core i7, màn hình InfinityEdge 13.4 inch và thiết kế siêu mỏng"
            },
            {
                id: 8,
                name: "Sony WH-1000XM5",
                price: 7990000,
                category: "Phụ kiện",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
                stock: 60,
                description: "Tai nghe Sony WH-1000XM5 với chống ồn hàng đầu thế giới và âm thanh chất lượng cao"
            }
        ];
        categories = ["Tất cả", "Điện thoại", "Laptop", "Máy tính bảng", "Đồng hồ", "Phụ kiện"];
        return { products, categories };
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Show message
function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;

    container.innerHTML = '';
    container.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Add to cart
function addToCart(productId, quantity = 1) {
    // Đảm bảo products đã được tải
    if (!products || products.length === 0) {
        console.error('Danh sách sản phẩm chưa được tải');
        showMessage('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.', 'error');
        return;
    }
    
    const parsedProductId = parseInt(productId);
    const parsedQuantity = parseInt(quantity);
    
    const product = products.find(p => p.id === parsedProductId);
    if (!product) {
        console.error("Không tìm thấy sản phẩm với ID:", productId);
        showMessage("Không thể thêm sản phẩm vào giỏ hàng!", "error");
        return;
    }

    const existingItem = cart.find(item => item.id === parsedProductId);
    if (existingItem) {
        existingItem.quantity += parsedQuantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: parsedQuantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart(); // Cập nhật hiển thị giỏ hàng nếu đang ở trang giỏ hàng
    showMessage(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
}

// Remove from cart
function removeFromCart(productId) {
    productId = parseInt(productId);
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart(); // Cập nhật hiển thị giỏ hàng
    showMessage('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
}

// Render cart
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    const emptyCart = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartTotal) cartTotal.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartTotal) cartTotal.style.display = 'block';
    
    let total = 0;
    let cartHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='media/images/product-placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p>${formatCurrency(itemTotal)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    if (totalAmount) totalAmount.textContent = formatCurrency(total);
}

// Update cart quantity
function updateCartQuantity(productId, quantity) {
    productId = parseInt(productId);
    quantity = parseInt(quantity);
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart(); // Cập nhật hiển thị giỏ hàng
            showMessage('Đã cập nhật số lượng sản phẩm!', 'success');
        }
    }
}

// Display products
function displayProducts(productsToShow = products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) {
        console.error("Không tìm thấy phần tử products-grid");
        const mainContent = document.getElementById('main-content') || document.body;
        if (mainContent) mainContent.innerHTML = '<div style="text-align:center;color:#ff4757;padding:2rem;">Không thể tải danh sách sản phẩm.</div>';
        return;
    }

    // Ẩn loading
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'none';

    // Hiển thị số lượng sản phẩm
    const showingCountEl = document.getElementById('showing-count');
    if (showingCountEl) showingCountEl.textContent = productsToShow.length;

    // Kiểm tra nếu không có sản phẩm
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '';
        const noProductsEl = document.getElementById('no-products');
        if (noProductsEl) noProductsEl.style.display = 'block';
        return;
    }

    // Ẩn thông báo không có sản phẩm
    const noProductsEl = document.getElementById('no-products');
    if (noProductsEl) noProductsEl.style.display = 'none';

    // Hiển thị sản phẩm
    productsGrid.innerHTML = productsToShow.map((product, index) => `
        <div class="product-card fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="stock-info">Còn ${product.stock} sản phẩm</div>
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    `).join('');
    
    // Hiển thị phân trang nếu cần
    const paginationEl = document.getElementById('pagination');
    if (paginationEl && productsToShow.length > 0) {
        paginationEl.style.display = 'block';
    }
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter') ? document.getElementById('category-filter').value : '';
    const priceFilter = document.getElementById('price-filter') ? document.getElementById('price-filter').value : '';
    const searchInput = document.getElementById('search-input') ? document.getElementById('search-input').value.toLowerCase() : '';

    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const allProducts = productsGrid.querySelectorAll('.product-card');

    allProducts.forEach(productCard => {
        let shouldShow = true;

        // Get product info from the card
        const category = productCard.querySelector('.product-category') ? productCard.querySelector('.product-category').textContent : '';
        const name = productCard.querySelector('.product-name') ? productCard.querySelector('.product-name').textContent.toLowerCase() : '';
        const description = productCard.querySelector('.product-description') ? productCard.querySelector('.product-description').textContent.toLowerCase() : '';
        const priceText = productCard.querySelector('.product-price') ? productCard.querySelector('.product-price').textContent : '';
        const price = parseInt(priceText ? priceText.replace(/[^\d]/g, '') : '') || 0;

        // Filter by category
        if (categoryFilter && category !== categoryFilter) {
            shouldShow = false;
        }

        // Filter by price
        if (priceFilter && shouldShow) {
            const [min, max] = priceFilter.split('-').map(p => parseInt(p));
            if (max === 999999999) {
                if (price < min) shouldShow = false;
            } else {
                if (price < min || price > max) shouldShow = false;
            }
        }

        // Filter by search
        if (searchInput && shouldShow) {
            if (!name.includes(searchInput) && !description.includes(searchInput)) {
                shouldShow = false;
            }
        }

        // Show or hide the product
        productCard.style.display = shouldShow ? 'block' : 'none';
    });

    // Show no products message if no products are visible
    const visibleProducts = productsGrid.querySelectorAll('.product-card[style*="block"], .product-card:not([style*="none"])');
    const noProductsEl = document.getElementById('no-products');

    if (visibleProducts.length === 0) {
        if (noProductsEl) noProductsEl.style.display = 'block';
    } else {
        if (noProductsEl) noProductsEl.style.display = 'none';
    }
}

// Display cart
function displayCart() {
    const cartContainer = document.getElementById('cart-container');
    const emptyCart = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        cartTotal.style.display = 'none';
        return;
    }

    cartContainer.style.display = 'block';
    emptyCart.style.display = 'none';
    cartTotal.style.display = 'block';

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                       onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-amount').textContent = formatCurrency(total);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showMessage('Giỏ hàng trống!', 'error');
        return;
    }

    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('checkout-form').scrollIntoView({ behavior: 'smooth' });
}

// Process payment
function processPayment() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const orderData = {
            id: orders.length + 1,
            customerId: currentUser ? currentUser.id : null,
            customerName: document.getElementById('customer-name').value,
            customerEmail: document.getElementById('customer-email').value,
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            createdAt: new Date().toISOString(),
            paymentMethod: document.getElementById('payment-method').value,
            address: document.getElementById('customer-address').value,
            notes: document.getElementById('notes').value
        };

        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Redirect to thank you page
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        window.location.href = 'thankyou.html';
    });
}

// Display order details on thank you page
function displayOrderDetails() {
    const orderDetails = document.getElementById('order-info');
    if (!orderDetails) return;

    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (!lastOrder) return;

    orderDetails.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Mã đơn hàng:</strong> #${lastOrder.id}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Khách hàng:</strong> ${lastOrder.customerName}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Email:</strong> ${lastOrder.customerEmail}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Địa chỉ:</strong> ${lastOrder.address}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Phương thức thanh toán:</strong> ${getPaymentMethodName(lastOrder.paymentMethod)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Sản phẩm:</strong>
            <ul style="margin-top: 0.5rem;">
                ${lastOrder.items.map(item => `
                    <li>${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}</li>
                `).join('')}
            </ul>
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Tổng cộng:</strong> ${formatCurrency(lastOrder.total)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Trạng thái:</strong> <span style="color: #74b9ff;">Chờ xử lý</span>
        </div>
    `;
}

// Get payment method name
function getPaymentMethodName(method) {
    const methods = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng',
        'card': 'Thẻ tín dụng/ghi nợ'
    };
    return methods[method] || method;
}

// User authentication
function login(email, password) {
    // Đảm bảo users đã được khởi tạo
    if (users.length === 0) {
        initializeDemoData();
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateNavigation();
        showMessage('Đăng nhập thành công!', 'success');
        
        console.log("Đăng nhập thành công với tài khoản:", user);
        
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
        return true;
    } else {
        console.log("Đăng nhập thất bại. Email:", email, "Password:", password);
        console.log("Danh sách users hiện tại:", users);
        showMessage('Email hoặc mật khẩu không đúng!', 'error');
        return false;
    }
}

function register(userData) {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
        showMessage('Email đã được sử dụng!', 'error');
        return false;
    }

    const newUser = {
        id: users.length + 1,
        ...userData,
        role: 'customer',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigation();
    showMessage('Đã đăng xuất!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Update navigation based on user status
function updateNavigation() {
    const nav = document.querySelector('.nav');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    let profileLink = document.getElementById('profile-link');
    let adminLink = document.getElementById('admin-link');
    let logoutLink = document.getElementById('logout-link');
    const adminIcon = document.getElementById('admin-icon');

    if (currentUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';

        // Tạo link Hồ sơ nếu chưa có
        if (!profileLink && nav) {
            profileLink = document.createElement('a');
            profileLink.id = 'profile-link';
            profileLink.href = 'profile.html';
            profileLink.textContent = 'Hồ sơ';
            nav.appendChild(profileLink);
        }
        if (profileLink) profileLink.style.display = 'block';
        
        // Show admin link and icon if user is admin
        if (currentUser.role === 'admin') {
            // Tạo link Quản trị nếu chưa có
            if (!adminLink && nav) {
                adminLink = document.createElement('a');
                adminLink.id = 'admin-link';
                adminLink.href = 'admin.html';
                adminLink.textContent = 'Quản trị';
                nav.appendChild(adminLink);
            }
            if (adminLink) adminLink.style.display = 'block';
            
            // Add admin icon if it doesn't exist
            if (!adminIcon) {
                const headerContent = document.querySelector('.header-content');
                if (headerContent) {
                    const adminIconElement = document.createElement('div');
                    adminIconElement.id = 'admin-icon';
                    adminIconElement.className = 'admin-icon';
                    adminIconElement.innerHTML = '<i class="fas fa-user-shield"></i>';
                    adminIconElement.style.position = 'absolute';
                    adminIconElement.style.top = '10px';
                    adminIconElement.style.right = '10px';
                    adminIconElement.style.color = '#ff6b6b';
                    adminIconElement.style.fontSize = '24px';
                    headerContent.appendChild(adminIconElement);
                }
            } else {
                adminIcon.style.display = 'block';
            }
        } else {
            if (adminLink) adminLink.style.display = 'none';
            if (adminIcon) adminIcon.style.display = 'none';
        }

        // Tạo nút Đăng xuất nếu chưa có
        if (!logoutLink && nav) {
            logoutLink = document.createElement('a');
            logoutLink.id = 'logout-link';
            logoutLink.href = '#';
            logoutLink.textContent = 'Đăng xuất';
            nav.appendChild(logoutLink);
        }
        if (logoutLink) {
            logoutLink.style.display = 'block';
            logoutLink.onclick = function(e) {
                e.preventDefault();
                logout();
            };
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (adminIcon) adminIcon.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// ========= ADMIN UTILITIES =========
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCategoriesToStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function generateUniqueProductId() {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    return maxId + 1;
}

function updateAdminStats() {
    const totalProductsEl = document.getElementById('total-products');
    const totalOrdersEl = document.getElementById('total-orders');
    const totalCustomersEl = document.getElementById('total-customers');
    const totalRevenueEl = document.getElementById('total-revenue');

    if (totalProductsEl) totalProductsEl.textContent = products.length;
    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
    if (totalCustomersEl) totalCustomersEl.textContent = users.filter(u => u.role === 'customer').length;
    if (totalRevenueEl) {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        totalRevenueEl.textContent = formatCurrency(totalRevenue);
    }

    // Top products
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = { name: item.name, sales: 0 };
            }
            productSales[item.productId].sales += item.quantity;
        });
    });
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
    const topProductsEl = document.getElementById('top-products');
    if (topProductsEl) {
        topProductsEl.innerHTML = topProducts.map(product => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <span>${product.name}</span>
                <span style="color: #74b9ff; font-weight: bold;">${product.sales} sản phẩm</span>
            </div>
        `).join('') || '<div style="color:#666;">Chưa có dữ liệu bán hàng</div>';
    }

    // Category stats
    const categoryStats = {};
    products.forEach(product => {
        if (!categoryStats[product.category]) categoryStats[product.category] = 0;
        categoryStats[product.category]++;
    });
    const categoryStatsEl = document.getElementById('category-stats');
    if (categoryStatsEl) {
        categoryStatsEl.innerHTML = Object.entries(categoryStats).map(([category, count]) => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <span>${category}</span>
                <span style="color: #74b9ff; font-weight: bold;">${count} sản phẩm</span>
            </div>
        `).join('') || '<div style="color:#666;">Chưa có sản phẩm</div>';
    }
}

// ========= ADMIN: PRODUCTS =========
let adminEditingProductId = null;

function populateAdminProductFilters() {
    const filterSelect = document.getElementById('product-category-filter');
    const modalSelect = document.getElementById('product-category');
    const uniqueCategories = Array.from(new Set(categories)).filter(Boolean);
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">Tất cả danh mục</option>' +
            uniqueCategories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    if (modalSelect) {
        modalSelect.innerHTML = '<option value="">Chọn danh mục</option>' +
            uniqueCategories.map(c => `<option value="${c}">${c}</option>`).join('');
    }
}

function renderAdminProductsList() {
    const listEl = document.getElementById('products-list');
    if (!listEl) return;

    const searchValue = (document.getElementById('product-search')?.value || '').toLowerCase();
    const categoryValue = document.getElementById('product-category-filter')?.value || '';

    const filtered = products.filter(p => {
        if (categoryValue && p.category !== categoryValue) return false;
        if (searchValue && !(`${p.name}`.toLowerCase().includes(searchValue))) return false;
        return true;
    });

    listEl.innerHTML = filtered.map(p => `
        <div style="display:flex; align-items:center; justify-content: space-between; padding: 0.75rem 0; border-bottom:1px solid #eee; gap:1rem;">
            <div style="display:flex; align-items:center; gap:1rem; flex:1;">
                <img src="${p.image}" alt="${p.name}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">
                <div>
                    <div style="font-weight:700; color:#1a1a1a;">${p.name}</div>
                    <div style="color:#64748b; font-size:0.9rem;">${p.category} • Tồn: ${p.stock}</div>
                </div>
            </div>
            <div style="font-weight:700; color:#059669; min-width:140px; text-align:right;">${formatCurrency(p.price)}</div>
            <div style="display:flex; gap:0.5rem; min-width:200px; justify-content:flex-end;">
                <button class="form-btn" style="padding:0.6rem 0.9rem;" onclick="openProductModal(${p.id})"><i class=\"fas fa-edit\"></i> Sửa</button>
                <button class="form-btn" style="padding:0.6rem 0.9rem; background: linear-gradient(135deg, #ef4444, #dc2626);" onclick="deleteProduct(${p.id})"><i class=\"fas fa-trash\"></i> Xóa</button>
            </div>
        </div>
    `).join('') || '<div style="color:#666; text-align:center; padding:1rem;">Không có sản phẩm</div>';
}

function openProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');
    if (!modal || !title || !form) return;
    populateAdminProductFilters();
    form.reset();
    adminEditingProductId = null;
    if (productId) {
        const p = products.find(pr => pr.id === productId);
        if (!p) return;
        adminEditingProductId = p.id;
        title.textContent = 'Chỉnh sửa sản phẩm';
        document.getElementById('product-name').value = p.name;
        document.getElementById('product-price').value = p.price;
        document.getElementById('product-category').value = p.category;
        document.getElementById('product-image').value = p.image;
        document.getElementById('product-stock').value = p.stock;
        document.getElementById('product-description').value = p.description;
    } else {
        title.textContent = 'Thêm sản phẩm mới';
    }
    modal.style.display = 'block';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
}

function attachAdminProductEvents() {
    const addBtn = document.getElementById('add-product-btn');
    const cancelBtn = document.getElementById('cancel-product-btn');
    const form = document.getElementById('product-form');
    const search = document.getElementById('product-search');
    const categoryFilter = document.getElementById('product-category-filter');
    if (addBtn) addBtn.onclick = () => openProductModal();
    if (cancelBtn) cancelBtn.onclick = closeProductModal;
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value.trim();
            const price = parseInt(document.getElementById('product-price').value, 10) || 0;
            const category = document.getElementById('product-category').value.trim();
            const image = document.getElementById('product-image').value.trim();
            const stock = parseInt(document.getElementById('product-stock').value, 10) || 0;
            const description = document.getElementById('product-description').value.trim();
            if (!name || !category) {
                showMessage('Vui lòng nhập đầy đủ tên và danh mục.', 'error');
                return;
            }
            if (price < 0 || stock < 0) {
                showMessage('Giá và tồn kho phải không âm.', 'error');
                return;
            }
            if (adminEditingProductId) {
                const idx = products.findIndex(p => p.id === adminEditingProductId);
                if (idx !== -1) {
                    products[idx] = { ...products[idx], name, price, category, image, stock, description };
                }
                showMessage('Đã cập nhật sản phẩm.', 'success');
            } else {
                const newProduct = { id: generateUniqueProductId(), name, price, category, image, stock, description };
                products.push(newProduct);
                showMessage('Đã thêm sản phẩm mới.', 'success');
            }
            // Cập nhật danh mục nếu cần
            if (!categories.includes(category)) {
                categories.push(category);
                saveCategoriesToStorage();
            }
            saveProductsToStorage();
            populateAdminProductFilters();
            renderAdminProductsList();
            updateAdminStats();
            closeProductModal();
        };
    }
    if (search) search.oninput = renderAdminProductsList;
    if (categoryFilter) categoryFilter.onchange = renderAdminProductsList;
}

function deleteProduct(productId) {
    if (!confirm('Xóa sản phẩm này?')) return;
    products = products.filter(p => p.id !== productId);
    saveProductsToStorage();
    renderAdminProductsList();
    updateAdminStats();
    showMessage('Đã xóa sản phẩm.', 'success');
}

// ========= ADMIN: CATEGORIES =========
let adminEditingCategoryName = null;

function renderAdminCategoriesList() {
    const listEl = document.getElementById('categories-list');
    if (!listEl) return;
    const categoryCounts = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    const sorted = [...categories].sort((a, b) => a.localeCompare(b));
    listEl.innerHTML = sorted.map(name => `
        <div style="display:flex; align-items:center; justify-content: space-between; padding: 0.75rem 0; border-bottom:1px solid #eee; gap:1rem;">
            <div style="font-weight:600; color:#1a1a1a;">${name}</div>
            <div style="color:#64748b;">${categoryCounts[name] || 0} sản phẩm</div>
            <div style="display:flex; gap:0.5rem;">
                <button class="form-btn" style="padding:0.5rem 0.8rem;" onclick="openCategoryModal('${name.replace(/'/g, "&#39;")}')"><i class=\"fas fa-edit\"></i> Sửa</button>
                <button class="form-btn" style="padding:0.5rem 0.8rem; background: linear-gradient(135deg, #ef4444, #dc2626);" onclick="deleteCategory('${name.replace(/'/g, "&#39;")}')"><i class=\"fas fa-trash\"></i> Xóa</button>
            </div>
        </div>
    `).join('') || '<div style="color:#666; text-align:center; padding:1rem;">Chưa có danh mục</div>';
}

function openCategoryModal(name) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-modal-title');
    const form = document.getElementById('category-form');
    if (!modal || !title || !form) return;
    form.reset();
    adminEditingCategoryName = null;
    if (name) {
        adminEditingCategoryName = name;
        title.textContent = 'Chỉnh sửa danh mục';
        document.getElementById('category-name').value = name;
    } else {
        title.textContent = 'Thêm danh mục mới';
    }
    modal.style.display = 'block';
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.style.display = 'none';
}

function attachAdminCategoryEvents() {
    const addBtn = document.getElementById('add-category-btn');
    const cancelBtn = document.getElementById('cancel-category-btn');
    const form = document.getElementById('category-form');
    if (addBtn) addBtn.onclick = () => openCategoryModal();
    if (cancelBtn) cancelBtn.onclick = closeCategoryModal;
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('category-name').value.trim();
            if (!name) {
                showMessage('Vui lòng nhập tên danh mục.', 'error');
                return;
            }
            if (adminEditingCategoryName) {
                if (name !== adminEditingCategoryName) {
                    // Cập nhật tên danh mục trong danh sách và các sản phẩm liên quan
                    categories = categories.map(c => c === adminEditingCategoryName ? name : c);
                    products = products.map(p => p.category === adminEditingCategoryName ? { ...p, category: name } : p);
                    saveProductsToStorage();
                }
                showMessage('Đã cập nhật danh mục.', 'success');
            } else {
                if (!categories.includes(name)) {
                    categories.push(name);
                    showMessage('Đã thêm danh mục mới.', 'success');
                } else {
                    showMessage('Danh mục đã tồn tại.', 'error');
                    return;
                }
            }
            saveCategoriesToStorage();
            populateAdminProductFilters();
            renderAdminCategoriesList();
            renderAdminProductsList();
            updateAdminStats();
            closeCategoryModal();
        };
    }
}

function deleteCategory(name) {
    const inUse = products.some(p => p.category === name);
    if (inUse) {
        showMessage('Không thể xóa danh mục đang được sử dụng.', 'error');
        return;
    }
    if (!confirm('Xóa danh mục này?')) return;
    categories = categories.filter(c => c !== name);
    saveCategoriesToStorage();
    renderAdminCategoriesList();
    populateAdminProductFilters();
    showMessage('Đã xóa danh mục.', 'success');
}

// ========= ADMIN: ORDERS =========
function renderAdminOrdersList() {
    const listEl = document.getElementById('orders-list');
    if (!listEl) return;
    const statusFilter = document.getElementById('order-status-filter')?.value || '';
    const dateFilter = document.getElementById('order-date-filter')?.value || '';
    const filtered = orders.filter(o => {
        if (statusFilter && o.status !== statusFilter) return false;
        if (dateFilter) {
            const d = new Date(o.createdAt).toISOString().slice(0, 10);
            if (d !== dateFilter) return false;
        }
        return true;
    });
    listEl.innerHTML = filtered.map(o => `
        <div style="border:1px solid #eee; border-radius:10px; padding:1rem; margin-bottom:0.75rem;">
            <div style="display:flex; justify-content: space-between; align-items:center;">
                <strong>Đơn #${o.id}</strong>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span style="color:#64748b;">${new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                    <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding:0.4rem 0.6rem; border:2px solid #e2e8f0; border-radius:8px;">
                        ${['pending','processing','shipped','delivered','cancelled'].map(s => `<option value="${s}" ${o.status===s?'selected':''}>${getOrderStatusName(s)}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div style="color:#64748b; margin-top:0.5rem;">${o.customerName} • ${o.customerEmail}</div>
            <div style="margin-top:0.5rem; color:#059669; font-weight:700;">${formatCurrency(o.total)}</div>
        </div>
    `).join('') || '<div style="color:#666; text-align:center; padding:1rem;">Không có đơn hàng</div>';
}

function updateOrderStatus(orderId, newStatus) {
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;
    orders[idx].status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders));
    updateAdminStats();
    showMessage('Đã cập nhật trạng thái đơn hàng.', 'success');
}

// ========= ADMIN: CUSTOMERS =========
function renderAdminCustomersList() {
    const listEl = document.getElementById('customers-list');
    if (!listEl) return;
    const search = (document.getElementById('customer-search')?.value || '').toLowerCase();
    const sort = document.getElementById('customer-sort')?.value || 'newest';

    const customerUsers = users.filter(u => u.role === 'customer');
    const withStats = customerUsers.map(u => {
        const userOrders = orders.filter(o => o.customerId === u.id);
        const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
        return { user: u, orderCount: userOrders.length, totalSpent };
    }).filter(cs => {
        if (!search) return true;
        return cs.user.fullname.toLowerCase().includes(search)
            || cs.user.email.toLowerCase().includes(search)
            || (cs.user.phone || '').toLowerCase().includes(search);
    });

    switch (sort) {
        case 'oldest':
            withStats.sort((a, b) => new Date(a.user.createdAt) - new Date(b.user.createdAt));
            break;
        case 'name':
            withStats.sort((a, b) => a.user.fullname.localeCompare(b.user.fullname));
            break;
        case 'orders':
            withStats.sort((a, b) => b.orderCount - a.orderCount);
            break;
        default: // newest
            withStats.sort((a, b) => new Date(b.user.createdAt) - new Date(a.user.createdAt));
            break;
    }

    listEl.innerHTML = withStats.map(({ user, orderCount, totalSpent }) => `
        <div style="border:1px solid #eee; border-radius:10px; padding:1rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; gap:1rem;">
            <div>
                <div style="font-weight:700; color:#1a1a1a;">${user.fullname}</div>
                <div style="color:#64748b;">${user.email} • ${user.phone || ''}</div>
                <div style="color:#94a3b8; font-size:0.9rem;">Tham gia: ${new Date(user.createdAt).toLocaleDateString('vi-VN')}</div>
            </div>
            <div style="text-align:right;">
                <div style="color:#2563eb; font-weight:700;">${orderCount} đơn</div>
                <div style="color:#059669; font-weight:700;">${formatCurrency(totalSpent)}</div>
            </div>
        </div>
    `).join('') || '<div style="color:#666; text-align:center; padding:1rem;">Không có khách hàng</div>';
}

// Display profile
function displayProfile() {
    const profileInfo = document.getElementById('profile-info');
    if (!profileInfo || !currentUser) return;

    profileInfo.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Họ và tên:</strong> ${currentUser.fullname}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Email:</strong> ${currentUser.email}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Số điện thoại:</strong> ${currentUser.phone}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Địa chỉ:</strong> ${currentUser.address}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Ngày sinh:</strong> ${new Date(currentUser.birthday).toLocaleDateString('vi-VN')}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Giới tính:</strong> ${currentUser.gender === 'male' ? 'Nam' : currentUser.gender === 'female' ? 'Nữ' : 'Khác'}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Ngày tham gia:</strong> ${new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}
        </div>
    `;

    // Display order history
    const orderHistory = document.getElementById('order-history');
    if (orderHistory) {
        const userOrders = orders.filter(order => order.customerId === currentUser.id);
        if (userOrders.length === 0) {
            orderHistory.innerHTML = '<p style="color: #666; text-align: center;">Chưa có đơn hàng nào</p>';
        } else {
            orderHistory.innerHTML = userOrders.map(order => `
                <div style="border: 1px solid #eee; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <strong>Đơn hàng #${order.id}</strong>
                        <span style="color: #74b9ff;">${getOrderStatusName(order.status)}</span>
                    </div>
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div style="color: #e17055; font-weight: bold;">
                        ${formatCurrency(order.total)}
                    </div>
                </div>
            `).join('');
        }
    }

    // Update statistics
    updateProfileStats();
}

// Update profile statistics
function updateProfileStats() {
    if (!currentUser) return;

    const userOrders = orders.filter(order => order.customerId === currentUser.id);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    const memberDays = Math.floor((new Date() - new Date(currentUser.createdAt)) / (1000 * 60 * 60 * 24));

    const totalOrdersEl = document.getElementById('total-orders');
    const totalSpentEl = document.getElementById('total-spent');
    const memberSinceEl = document.getElementById('member-since');

    if (totalOrdersEl) totalOrdersEl.textContent = userOrders.length;
    if (totalSpentEl) totalSpentEl.textContent = formatCurrency(totalSpent);
    if (memberSinceEl) memberSinceEl.textContent = `${memberDays} ngày`;
}

// Get order status name
function getOrderStatusName(status) {
    const statuses = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao hàng',
        'delivered': 'Đã nhận hàng',
        'cancelled': 'Đã hủy'
    };
    return statuses[status] || status;
}

// Admin functions
function displayAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Cập nhật thống kê
    updateAdminStats();

    // Sản phẩm
    populateAdminProductFilters();
    renderAdminProductsList();
    attachAdminProductEvents();

    // Danh mục
    renderAdminCategoriesList();
    attachAdminCategoryEvents();

    // Đơn hàng
    renderAdminOrdersList();
    const statusFilter = document.getElementById('order-status-filter');
    const dateFilter = document.getElementById('order-date-filter');
    if (statusFilter) statusFilter.onchange = renderAdminOrdersList;
    if (dateFilter) dateFilter.onchange = renderAdminOrdersList;

    // Khách hàng
    renderAdminCustomersList();
    const customerSearch = document.getElementById('customer-search');
    const customerSort = document.getElementById('customer-sort');
    if (customerSearch) customerSearch.oninput = renderAdminCustomersList;
    if (customerSort) customerSort.onchange = renderAdminCustomersList;
}

// Admin tab switching
function switchAdminTab(tabName) {
    // Hide all content
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected content
    document.getElementById(tabName).classList.add('active');
    
    // Add active to selected tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Contact form
function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
            timestamp: new Date().toISOString()
        };

        // Store contact message
        let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        contactMessages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));

        showMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');
        form.reset();
    });
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthEl = document.getElementById('password-strength') || document.getElementById('new-password-strength');
    if (!strengthEl) return;

    let strength = 0;
    let feedback = [];

    if (password.length >= 6) strength++;
    else feedback.push('Ít nhất 6 ký tự');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Có chữ thường');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Có chữ hoa');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Có số');

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Có ký tự đặc biệt');

    const colors = ['#ff4757', '#ffa502', '#ffd32a', '#7bed9f', '#2ed573'];
    const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];

    strengthEl.innerHTML = `
        <div style="background: ${colors[strength - 1] || '#ddd'}; height: 5px; border-radius: 3px; margin-bottom: 0.5rem;"></div>
        <div style="color: ${colors[strength - 1] || '#666'}; font-size: 0.8rem;">
            ${labels[strength - 1] || 'Rất yếu'} ${feedback.length > 0 ? `- Thiếu: ${feedback.join(', ')}` : ''}
        </div>
    `;
}

// Password match checker
function checkPasswordMatch(password, confirmPassword) {
    const matchEl = document.getElementById('password-match') || document.getElementById('new-password-match');
    if (!matchEl) return;

    if (confirmPassword === '') {
        matchEl.innerHTML = '';
        return;
    }

    if (password === confirmPassword) {
        matchEl.innerHTML = '<span style="color: #2ed573;"><i class="fas fa-check"></i> Mật khẩu khớp</span>';
    } else {
        matchEl.innerHTML = '<span style="color: #ff4757;"><i class="fas fa-times"></i> Mật khẩu không khớp</span>';
    }
}

// Initialize page based on current page
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    // Initialize demo data
    initializeDemoData();
    
    // Update navigation
    updateNavigation();
    updateCartCount();

    switch (currentPage) {
        case 'index':
        case '':
            // Show loading indicator
            const loadingEl = document.getElementById('loading');
            if (loadingEl) loadingEl.style.display = 'block';
            
            loadProducts().then(() => {
                displayProducts();
                populateCategoryFilter();
                setupFilters();
                // Hide loading indicator
                if (loadingEl) loadingEl.style.display = 'none';
            }).catch((error) => {
                console.error('Error loading products:', error);
                // Hide loading indicator even if there's an error
                if (loadingEl) loadingEl.style.display = 'none';
                displayProducts(); // Display fallback data
                populateCategoryFilter();
                setupFilters();
            });
            break;
            
        case 'cart':
            loadProducts().then(() => {
                displayCart();
                processPayment();
            });
            break;
            
        case 'thankyou':
            displayOrderDetails();
            break;
            
        case 'login':
            setupLoginForm();
            break;
            
        case 'register':
            setupRegisterForm();
            break;
            
        case 'profile':
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }
            displayProfile();
            setupProfileForms();
            break;
            
        case 'admin':
            if (!currentUser || currentUser.role !== 'admin') {
                window.location.href = 'login.html';
                return;
            }
            loadProducts().then(() => {
                displayAdminDashboard();
                setupAdminTabs();
            });
            break;
            
        case 'contact':
            handleContactForm();
            break;
    }
}

// Setup functions
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    // Điền đầy đủ danh mục, thêm tuỳ chọn "Tất cả"
    const uniqueCategories = Array.from(new Set(categories)).filter(c => c && c !== 'Tất cả');
    categoryFilter.innerHTML = ['<option value="">Tất cả</option>']
        .concat(uniqueCategories.map(category => `<option value="${category}">${category}</option>`))
        .join('');
}

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const searchInput = document.getElementById('search-input');
    const clearFilters = document.getElementById('clear-filters');

    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            if (categoryFilter) categoryFilter.value = '';
            if (priceFilter) priceFilter.value = '';
            if (searchInput) searchInput.value = '';
            filterProducts();
        });
    }
}

function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

function setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    // Password strength checker
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            checkPasswordMatch(passwordInput.value, this.value);
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            password: document.getElementById('password').value,
            birthday: document.getElementById('birthday').value,
            gender: document.getElementById('gender').value
        };

        if (register(userData)) {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
}

function setupProfileForms() {
    // Edit profile form
    const editBtn = document.getElementById('edit-profile-btn');
    const editForm = document.getElementById('edit-profile-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    if (editBtn && editForm) {
        editBtn.addEventListener('click', function() {
            // Fill form with current user data
            document.getElementById('edit-fullname').value = currentUser.fullname;
            document.getElementById('edit-email').value = currentUser.email;
            document.getElementById('edit-phone').value = currentUser.phone;
            document.getElementById('edit-address').value = currentUser.address;
            document.getElementById('edit-birthday').value = currentUser.birthday;
            document.getElementById('edit-gender').value = currentUser.gender;
            
            editForm.style.display = 'block';
            editForm.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (cancelEditBtn && editForm) {
        cancelEditBtn.addEventListener('click', function() {
            editForm.style.display = 'none';
        });
    }

    // Update profile form
    const updateForm = document.getElementById('update-profile-form');
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update user data
            currentUser.fullname = document.getElementById('edit-fullname').value;
            currentUser.email = document.getElementById('edit-email').value;
            currentUser.phone = document.getElementById('edit-phone').value;
            currentUser.address = document.getElementById('edit-address').value;
            currentUser.birthday = document.getElementById('edit-birthday').value;
            currentUser.gender = document.getElementById('edit-gender').value;

            // Update in users array
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            showMessage('Cập nhật thông tin thành công!', 'success');
            editForm.style.display = 'none';
            displayProfile();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAdminTab(tabName);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);