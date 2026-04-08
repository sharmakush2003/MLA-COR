// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Full Screen Menu Logic
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');
const overlayLinks = document.querySelectorAll('.overlay-links a');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
}

overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Sticky Navbar Visibility (Optional now since it's solid Saffron)
const navbar = document.getElementById('navbar');
window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.padding = '1rem 0';
    }
    
    // Counter Animation trigger
    scrollCounter();
};

// Counter Animation Logic
const counters = document.querySelectorAll('.counter');
let counterStarted = false;

function scrollCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const sectionPos = statsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;

    if (sectionPos < screenPos && !counterStarted) {
        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / 50;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
        counterStarted = true;
    }
}

// Gallery Filter Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.innerText;
        
        galleryItems.forEach(item => {
            if (filter === 'सभी') {
                item.style.display = 'block';
            } else if (item.querySelector('h4').innerText.includes(filter) || 
                       item.querySelector('p').innerText.includes(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission - AJX Submission for Best-in-Class Experience
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const successDiv = document.getElementById('formSuccess');
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.innerText = 'भेज रहे हैं...';
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                const name = formData.get('name') || 'जी';
                document.getElementById('successName').innerText = `धन्यवाद, ${name}!`;
                
                form.style.display = 'none';
                successDiv.style.display = 'block';
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Trigger Saffron & White Confetti
                const colors = ['#FF9933', '#FFFFFF', '#FFB366'];
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: colors
                });
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            alert('क्षमा करें, कुछ तकनीकी समस्या आई है। कृपया पुनः प्रयास करें।');
            submitBtn.disabled = false;
            submitBtn.innerText = 'भेजें';
        });
    });

    // Support Enter key submission for a smoother experience
    contactForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                contactForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    // Support Enter key submission for the Textarea (Shift+Enter for new line)
    const textarea = contactForm.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            // If Enter is pressed WITHOUT Shift, submit the form
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                contactForm.dispatchEvent(new Event('submit'));
            }
            // If Shift + Enter is pressed, it will naturally create a new line
        });
    }
}
