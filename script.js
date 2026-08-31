// ===== Varukorg Funktionalitet =====
let cart = [];

function addToCart(itemName, price) {
    cart.push({
        name: itemName,
        price: price,
        id: Date.now()
    });
    
    updateCart();
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "✓ Tillagd!";
    button.style.backgroundColor = "#27ae60";
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "";
    }, 1500);
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Varukorgen är tom</p>';
        cartTotalSpan.textContent = '0 kr';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price} kr</span>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Ta bort</button>
            </div>
        `;
        total += item.price;
    });
    
    cartItemsDiv.innerHTML = html;
    cartTotalSpan.textContent = total + ' kr';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// ===== Meny-Kategorier =====
function showCategory(category) {
    const categories = document.querySelectorAll('.meny-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(category).classList.add('active');
    event.target.classList.add('active');
}

// ===== Beställning Submit =====
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Lägg till minst en artikel i varukorgen!');
        return;
    }
    
    const formData = {
        namn: document.getElementById('namn').value,
        email: document.getElementById('email').value,
        telefon: document.getElementById('telefon').value,
        adress: document.getElementById('adress').value,
        stad: document.getElementById('stad').value,
        postnummer: document.getElementById('postnummer').value,
        leveranstid: document.getElementById('leveranstid').value,
        anmarkning: document.getElementById('anmarkning').value,
        varor: cart,
        totalt: cart.reduce((sum, item) => sum + item.price, 0) + 50
    };
    
    console.log('Beställning:', formData);
    submitOrder(formData);
});

function submitOrder(orderData) {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Bearbetar...';
    
    setTimeout(() => {
        const orderSummary = `BESTÄLLNING BEKRÄFTAD! ✓\n\nKunduppgifter:\n${orderData.namn}\n${orderData.adress}\n${orderData.postnummer} ${orderData.stad}\nTelefon: ${orderData.telefon}\nE-post: ${orderData.email}\n\nBeställda varor:\n${orderData.varor.map(item => `- ${item.name}: ${item.price} kr`).join('\n')}\n\nLeveranspris: 50 kr\nTotalt: ${orderData.totalt} kr\n\nLeveranstid: ${orderData.leveranstid}\n\nTack för din beställning!`;
        
        alert(orderSummary);
        
        document.getElementById('orderForm').reset();
        cart = [];
        updateCart();
        
        saveOrderToLocalStorage(orderData);
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// ===== Lokal Lagring av Beställningar =====
function saveOrderToLocalStorage(orderData) {
    let orders = JSON.parse(localStorage.getItem('cafeOrders')) || [];
    orders.push({
        ...orderData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('cafeOrders', JSON.stringify(orders));
}

// ===== Kontaktformulär =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Skickar...';
    
    setTimeout(() => {
        alert('Tack för ditt meddelande! Vi återkommer så snart som möjligt.');
        this.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 1500);
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
    showCategory('kaffe');
    loadCheckoutInfo();
    
    const form = document.getElementById('orderForm');
    form.addEventListener('change', saveCheckoutInfo);
});

// ===== Admin Panel =====
function showAdminPanel() {
    const password = prompt('Ange admin-lösenord:');
    if (password === 'cafecult123') {
        const orders = JSON.parse(localStorage.getItem('cafeOrders')) || [];
        let adminHTML = 'ADMIN PANEL - BESTÄLLNINGAR\n\n';
        adminHTML += `Totalt beställningar: ${orders.length}\n────────────────────────\n\n`;
        
        let totalRevenue = 0;
        orders.forEach((order, index) => {
            adminHTML += `Beställning #${index + 1}\nKund: ${order.namn}\nTel: ${order.telefon}\nE-post: ${order.email}\nTotalt: ${order.totalt} kr\nTid: ${new Date(order.timestamp).toLocaleString('sv-SE')}\n────────────────────────\n\n`;
            totalRevenue += order.totalt;
        });
        
        adminHTML += `TOTAL INTÄKT: ${totalRevenue} kr`;
        alert(adminHTML);
    } else if (password !== null) {
        alert('Fel lösenord!');
    }
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        showAdminPanel();
    }
});

// ===== Spara checkout-info =====
function saveCheckoutInfo() {
    const checkoutInfo = {
        namn: document.getElementById('namn').value,
        email: document.getElementById('email').value,
        telefon: document.getElementById('telefon').value,
        adress: document.getElementById('adress').value,
        postnummer: document.getElementById('postnummer').value
    };
    localStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
}

function loadCheckoutInfo() {
    const saved = localStorage.getItem('checkoutInfo');
    if (saved) {
        const info = JSON.parse(saved);
        document.getElementById('namn').value = info.namn || '';
        document.getElementById('email').value = info.email || '';
        document.getElementById('telefon').value = info.telefon || '';
        document.getElementById('adress').value = info.adress || '';
        document.getElementById('postnummer').value = info.postnummer || '';
    }
}

console.log('✓ Cafe Cult hemsida är redo!');