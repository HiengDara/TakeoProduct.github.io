// Global variables
let currentUser = null;
let sellers = [
    {
        id: 1,
        name: "John Smith",
        rank: 1,
        currentOrders: 15,
        totalSold: 234,
        telegram: "@johnsmith",
        location: "New York",
        products: ["Electronics", "Gadgets"],
        progress: {
            ctc: true,
            quality: true,
            delivery: false,
            arrived: false
        }
    },
    {
        id: 2,
        name: "Sarah Johnson",
        rank: 2,
        currentOrders: 12,
        totalSold: 198,
        telegram: "@sarahj",
        location: "California",
        products: ["Fashion", "Accessories"],
        progress: {
            ctc: true,
            quality: false,
            delivery: false,
            arrived: false
        }
    },
    {
        id: 3,
        name: "Mike Chen",
        rank: 3,
        currentOrders: 8,
        totalSold: 167,
        telegram: "@mikec",
        location: "Texas",
        products: ["Home & Garden", "Tools"],
        progress: {
            ctc: true,
            quality: true,
            delivery: true,
            arrived: false
        }
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('addSellerBtn').addEventListener('click', openAddSellerModal);
    document.getElementById('addSellerForm').addEventListener('submit', handleAddSeller);
    document.getElementById('addProductBtn').addEventListener('click', addProductField);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Load saved user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Load saved sellers
    const savedSellers = localStorage.getItem('sellers');
    if (savedSellers) {
        sellers = JSON.parse(savedSellers);
    }
});

// Login functionality
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    currentUser = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        role: formData.get('role')
    };
    
    // Save user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showDashboard();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginPage();
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    renderSellers();
    renderCommissionChart();
}

function showLoginPage() {
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
}

// Seller management
function renderSellers() {
    const sellersList = document.getElementById('sellersList');
    sellersList.innerHTML = '';
    
    // Sort sellers by rank
    const sortedSellers = [...sellers].sort((a, b) => a.rank - b.rank);
    
    sortedSellers.forEach(seller => {
        const sellerCard = createSellerCard(seller);
        sellersList.appendChild(sellerCard);
    });
}

function createSellerCard(seller) {
    const card = document.createElement('div');
    card.className = 'seller-card';
    
    const progressSteps = ['ctc', 'quality', 'delivery', 'arrived'];
    const progressLabels = ['Deliver to CTC', 'Quality Check', 'Deliver to Buyer', 'Arrived'];
    
    card.innerHTML = `
        <div class="seller-header">
            <div class="seller-info">
                <span class="seller-rank">Rank #${seller.rank}</span>
                <div class="seller-name">${seller.name}</div>
            </div>
        </div>
        
        <div class="seller-meta">
            <div class="meta-item">
                <span class="meta-value">${seller.currentOrders}</span>
                <span class="meta-label">Current Orders</span>
            </div>
            <div class="meta-item">
                <span class="meta-value">${seller.totalSold}</span>
                <span class="meta-label">Total Sold</span>
            </div>
            <div class="meta-item">
                <span class="meta-value">${seller.products.length}</span>
                <span class="meta-label">Products</span>
            </div>
        </div>
        
        <div class="progress-section">
            <h4>Package Progress</h4>
            <div class="progress-bar">
                ${progressSteps.map(step => {
                    const isActive = seller.progress[step];
                    const isCompleted = progressSteps.indexOf(step) < progressSteps.findIndex(s => !seller.progress[s]);
                    return `<div class="progress-step ${isActive ? 'completed' : isCompleted ? 'active' : ''}"></div>`;
                }).join('')}
            </div>
            <div class="progress-labels">
                ${progressLabels.map(label => `<span class="progress-label">${label}</span>`).join('')}
            </div>
        </div>
        
        <div class="seller-actions">
            <button class="analytics-btn" onclick="openAnalyticsModal(${seller.id})">
                📊 View Analytics
            </button>
        </div>
    `;
    
    return card;
}

// Add seller functionality
function openAddSellerModal() {
    document.getElementById('addSellerModal').classList.add('active');
}

function closeAddSellerModal() {
    document.getElementById('addSellerModal').classList.remove('active');
    document.getElementById('addSellerForm').reset();
    resetProductFields();
}

function handleAddSeller(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const products = [];
    
    // Collect product names
    const productInputs = document.querySelectorAll('#productsContainer input');
    productInputs.forEach(input => {
        if (input.value.trim()) {
            products.push(input.value.trim());
        }
    });
    
    const newSeller = {
        id: Date.now(),
        name: formData.get('sellerName'),
        telegram: formData.get('telegram'),
        location: formData.get('location'),
        products: products,
        rank: sellers.length + 1,
        currentOrders: Math.floor(Math.random() * 20) + 1,
        totalSold: Math.floor(Math.random() * 100) + 1,
        progress: {
            ctc: true,
            quality: Math.random() > 0.5,
            delivery: Math.random() > 0.7,
            arrived: Math.random() > 0.8
        }
    };
    
    sellers.push(newSeller);
    localStorage.setItem('sellers', JSON.stringify(sellers));
    
    renderSellers();
    closeAddSellerModal();
    
    // Show success message
    showNotification('Seller added successfully!');
}

function addProductField() {
    const container = document.getElementById('productsContainer');
    const productDiv = document.createElement('div');
    productDiv.className = 'product-input';
    
    productDiv.innerHTML = `
        <input type="text" placeholder="Product name" required>
        <button type="button" class="remove-product" onclick="removeProduct(this)">&times;</button>
    `;
    
    container.appendChild(productDiv);
    
    // Show remove buttons if more than one product
    const removeButtons = container.querySelectorAll('.remove-product');
    removeButtons.forEach(btn => btn.style.display = removeButtons.length > 1 ? 'flex' : 'none');
}

function removeProduct(button) {
    const container = document.getElementById('productsContainer');
    button.parentElement.remove();
    
    // Hide remove buttons if only one product left
    const removeButtons = container.querySelectorAll('.remove-product');
    removeButtons.forEach(btn => btn.style.display = removeButtons.length > 1 ? 'flex' : 'none');
}

function resetProductFields() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = `
        <div class="product-input">
            <input type="text" placeholder="Product name" required>
            <button type="button" class="remove-product" onclick="removeProduct(this)" style="display: none;">&times;</button>
        </div>
    `;
}

// Analytics functionality
function openAnalyticsModal(sellerId) {
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) return;
    
    document.getElementById('analyticsTitle').textContent = `${seller.name} - Performance Analytics`;
    document.getElementById('monthlySales').textContent = seller.totalSold;
    document.getElementById('successRate').textContent = Math.floor(Math.random() * 20 + 80) + '%';
    document.getElementById('avgDelivery').textContent = Math.floor(Math.random() * 3 + 2) + ' days';
    
    document.getElementById('analyticsModal').classList.add('active');
    
    // Render performance chart
    setTimeout(() => renderPerformanceChart(seller), 100);
}

function closeAnalyticsModal() {
    document.getElementById('analyticsModal').classList.remove('active');
}

// Chart rendering functions
function renderCommissionChart() {
    const canvas = document.getElementById('commissionChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sample data for commission over months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = [8500, 9200, 10100, 11400, 10800, 12450];
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw data points and line
    ctx.strokeStyle = '#667eea';
    ctx.fillStyle = '#667eea';
    ctx.lineWidth = 3;
    
    const points = data.map((value, index) => ({
        x: padding + (index * chartWidth) / (data.length - 1),
        y: canvas.height - padding - ((value - minValue) / range) * chartHeight
    }));
    
    // Draw line
    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();
    
    // Draw points
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#718096';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    months.forEach((month, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        ctx.fillText(month, x, canvas.height - 10);
    });
}

function renderPerformanceChart(seller) {
    const canvas = document.getElementById('performanceChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sample performance data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const salesData = Array.from({length: 6}, () => Math.floor(Math.random() * 50 + 10));
    
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / months.length * 0.6;
    const barSpacing = chartWidth / months.length;
    
    const maxValue = Math.max(...salesData);
    
    // Draw bars
    salesData.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top of bar
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
    
    // Draw month labels
    ctx.fillStyle = '#718096';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    months.forEach((month, index) => {
        const x = padding + index * barSpacing + barSpacing / 2;
        ctx.fillText(month, x, canvas.height - 15);
    });
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}