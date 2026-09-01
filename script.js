// ===== Navigation & Page Switching =====
function navigateTo(pageId) {
    // Dölj alla sidor
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Visa vald sida
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
    }

    // Uppdatera navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Scrolla upp
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Booking Form =====
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bokningsData = {
            namn: document.getElementById('namn').value,
            telefon: document.getElementById('telefon').value,
            email: document.getElementById('email').value,
            personer: document.getElementById('personer').value,
            datum: document.getElementById('datum').value,
            tid: document.getElementById('tid').value,
            anmarkning: document.getElementById('anmarkning').value
        };

        console.log('Bokning mottagen:', bokningsData);
        
        // Spara till localStorage
        let bokningar = JSON.parse(localStorage.getItem('cafeBookings')) || [];
        bokningar.push({
            ...bokningsData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('cafeBookings', JSON.stringify(bokningar));

        // Visa bekräftelse
        alert(`Tack för din bokning!\n\nBord för ${bokningsData.personer} personer\n${bokningsData.datum} kl. ${bokningsData.tid}\n\nVi kontaktar dig på ${bokningsData.telefon}`);
        
        this.reset();
    });
}

// ===== Contact Form =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const meddelande = {
            namn: document.getElementById('c-namn').value,
            email: document.getElementById('c-email').value,
            meddelande: document.getElementById('c-meddelande').value
        };

        console.log('Meddelande mottaget:', meddelande);
        
        // Spara till localStorage
        let meddelanden = JSON.parse(localStorage.getItem('cafeMessages')) || [];
        meddelanden.push({
            ...meddelande,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('cafeMessages', JSON.stringify(meddelanden));

        alert('Tack för ditt meddelande! Vi återkommer så snart som möjligt.');
        this.reset();
    });
}

// ===== "Lägg till" knappfunktion =====
const addButtons = document.querySelectorAll('.btn-add');
addButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('h3').textContent;
        const productPrice = this.parentElement.querySelector('.product-price').textContent;
        
        // Visuell feedback
        const originalText = this.textContent;
        this.textContent = '✓ Tillagd!';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 1500);

        // Spara till localStorage
        let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        cart.push({
            name: productName,
            price: productPrice,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('cafeCart', JSON.stringify(cart));

        console.log(`${productName} tillagd!`);
    });
});

// ===== Admin Panel (Ctrl+Shift+A) =====
function showAdminPanel() {
    const password = prompt('Ange admin-lösenord:');
    if (password === 'cafecult123') {
        const bokningar = JSON.parse(localStorage.getItem('cafeBookings')) || [];
        const meddelanden = JSON.parse(localStorage.getItem('cafeMessages')) || [];
        const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        
        let adminHTML = 'ADMIN PANEL\n\n';
        adminHTML += `Bokningar: ${bokningar.length}\n`;
        adminHTML += `Meddelanden: ${meddelanden.length}\n`;
        adminHTML += `Varukorgar: ${cart.length}\n\n`;
        
        if (bokningar.length > 0) {
            adminHTML += 'SENASTE BOKNING:\n';
            const latest = bokningar[bokningar.length - 1];
            adminHTML += `${latest.namn} - ${latest.datum} kl ${latest.tid} (${latest.personer} personer)\n`;
        }
        
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

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ Cafe Cult hemsida är redo!');
    // Visa hem-sidan som standard
    const hemPage = document.getElementById('hem');
    if (hemPage) {
        hemPage.classList.add('active');
    }
});

// ===== Smooth Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            e.preventDefault();
            const targetId = href.substring(1);
            navigateTo(targetId);
        }
    });
});