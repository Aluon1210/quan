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

// Load products data
async function loadProducts() {
    try {
        // Dữ liệu sản phẩm được nhúng trực tiếp để tránh lỗi CORS
        const data = {
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
        
        products = data.products;
        categories = data.categories;
        
        // Hiển thị sản phẩm sau khi tải xong
        if (document.getElementById('products-grid')) {
            displayProducts(products);
        }
        
        return data;
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

    // Add back to home button if it doesn't exist
    const adminHeader = document.querySelector('.admin-header');
    if (adminHeader && !document.getElementById('back-to-home')) {
        const backButton = document.createElement('a');
        backButton.id = 'back-to-home';
        backButton.href = 'index.html';
        backButton.className = 'back-to-home-btn';
        backButton.innerHTML = '<i class="fas fa-home"></i> Quay về trang chủ';
        backButton.style.position = 'absolute';
        backButton.style.top = '20px';
        backButton.style.right = '20px';
        backButton.style.padding = '8px 15px';
        backButton.style.backgroundColor = '#74b9ff';
        backButton.style.color = 'white';
        backButton.style.borderRadius = '5px';
        backButton.style.textDecoration = 'none';
        adminHeader.appendChild(backButton);
    }

    // Update statistics
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-customers').textContent = users.filter(u => u.role === 'customer').length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);

    // Display top products
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
        `).join('');
    }

    // Display category statistics
    const categoryStats = {};
    products.forEach(product => {
        if (!categoryStats[product.category]) {
            categoryStats[product.category] = 0;
        }
        categoryStats[product.category]++;
    });

    const categoryStatsEl = document.getElementById('category-stats');
    if (categoryStatsEl) {
        categoryStatsEl.innerHTML = Object.entries(categoryStats).map(([category, count]) => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <span>${category}</span>
                <span style="color: #74b9ff; font-weight: bold;">${count} sản phẩm</span>
            </div>
        `).join('');
    }
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

    categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>' +
        categories.slice(1).map(category => 
            `<option value="${category}">${category}</option>`
        ).join('');
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