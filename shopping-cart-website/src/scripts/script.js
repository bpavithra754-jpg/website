let products = [];
let cart = [];
let selectedProductId = null;

// Sample products data
const productsData = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 2000,
        description: "Premium wireless headphones with noise cancellation",
        image: "🎧",
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "gadgets",
        price: 3000,
        description: "Feature-rich smartwatch with health tracking",
        image: "⌚",
        rating: 4.7,
        reviews: 256
    },
    {
        id: 3,
        name: "USB-C Cable",
        category: "accessories",
        price: 500,
        description: "Durable fast-charging USB-C cable",
        image: "🔌",
        rating: 4.3,
        reviews: 512
    },
    {
        id: 4,
        name: "Phone Case",
        category: "accessories",
        price: 300,
        description: "Protective phone case with premium materials",
        image: "📱",
        rating: 4.6,
        reviews: 324
    },
    {
        id: 5,
        name: "Laptop Stand",
        category: "accessories",
        price: 1500,
        description: "Adjustable aluminum laptop stand",
        image: "💻",
        rating: 4.4,
        reviews: 189
    },
    {
        id: 6,
        name: "Portable Speaker",
        category: "electronics",
        price: 4500,
        description: "Compact Bluetooth speaker with great sound",
        image: "🔊",
        rating: 4.8,
        reviews: 447
    },
    {
        id: 7,
        name: "Webcam 4K",
        category: "electronics",
        price: 12449,
        description: "Ultra HD webcam for streaming and video calls",
        image: "📹",
        rating: 4.5,
        reviews: 203
    },
    {
        id: 8,
        name: "Keyboard",
        category: "gadgets",
        price: 3000,
        description: "Mechanical RGB gaming keyboard",
        image: "⌨️",
        rating: 4.6,
        reviews: 378
    },
    {
        id: 9,
        name: "Mouse Pad",
        category: "accessories",
        price: 1659,
        description: "Large extended mouse pad with non-slip base",
        image: "🖱️",
        rating: 4.4,
        reviews: 156
    },
    {
        id: 10,
        name: "Desk Lamp",
        category: "gadgets",
        price: 3734,
        description: "LED desk lamp with adjustable brightness",
        image: "💡",
        rating: 4.7,
        reviews: 289
    }
];

// Initialize
function init() {
    products = productsData;
    displayProducts('all');
    setupEventListeners();
    loadCartFromStorage();
}

function setupEventListeners() {
    document.getElementById('search-box').addEventListener('input', searchProducts);
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    document.getElementById('modal-add-btn').addEventListener('click', addFromModal);
}

function displayProducts(category = 'all') {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    let filtered = products;
    if (category !== 'all') {
        filtered = products.filter(p => p.category === category);
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-rating">⭐ ${product.rating} (${product.reviews})</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="view-btn" onclick="openModal(${product.id})">View</button>
                    <button class="add-btn" onclick="addToCart(${product.id}, 1)">Add</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayProducts(category);
}

function searchProducts(e) {
    const query = e.target.value.toLowerCase();
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-rating">⭐ ${product.rating} (${product.reviews})</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="view-btn" onclick="openModal(${product.id})">View</button>
                    <button class="add-btn" onclick="addToCart(${product.id}, 1)">Add</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No products found</p>';
    }
}

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    selectedProductId = productId;
    
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = '₹' + product.price.toFixed(2);
    document.getElementById('modal-rating').textContent = '⭐'.repeat(Math.round(product.rating));
    document.getElementById('modal-reviews').textContent = `(${product.reviews} reviews)`;
    document.getElementById('modal-image').textContent = product.image;
    document.getElementById('modal-quantity').value = 1;
    
    document.getElementById('product-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
    selectedProductId = null;
}

function increaseQuantity() {
    const input = document.getElementById('modal-quantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('modal-quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addFromModal() {
    const quantity = parseInt(document.getElementById('modal-quantity').value);
    addToCart(selectedProductId, quantity);
    closeModal();
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    updateCart();
    saveCartToStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        updateTotals();
        return;
    }
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="cart-item-price">₹${itemTotal.toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    document.getElementById('cart-count').textContent = cart.length;
    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '₹' + tax.toFixed(2);
    document.getElementById('total').textContent = '₹' + total.toFixed(2);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = document.getElementById('total').textContent;
    alert(`Thank you for your purchase!\nTotal: ₹${total}\n\nOrder confirmed!`);
    clearCart();
}

function clearCart() {
    cart = [];
    updateCart();
    saveCartToStorage();
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Start the app
init();