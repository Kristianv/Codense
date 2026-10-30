// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        const toggle = question.querySelector('.faq-toggle');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const itemToggle = item.querySelector('.faq-toggle');
            if (itemToggle) itemToggle.textContent = '+';
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
            if (toggle) toggle.textContent = '−';
        }
    });
});

// Smooth scroll for navigation links
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

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.service-card, .product-card, .tech-category, .plan-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Carousel drag/swipe functionality
const carousel = document.querySelector('.carousel-track');
const container = document.querySelector('.carousel-container');

if (carousel && container) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let lastX = 0;
    let lastTime = Date.now();

    // Mouse events
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        velocity = 0;
        carousel.style.animationPlayState = 'paused';
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
        carousel.style.animationPlayState = 'running';
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
        carousel.style.animationPlayState = 'running';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTime;

        velocity = (x - lastX) / timeDiff;
        lastX = x;
        lastTime = currentTime;

        carousel.style.transform = `translateX(${scrollLeft - walk}px)`;
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        carousel.style.animationPlayState = 'paused';
    });

    container.addEventListener('touchend', () => {
        isDown = false;
        carousel.style.animationPlayState = 'running';
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.style.transform = `translateX(${scrollLeft - walk}px)`;
    });
}

// Connecting Dots Animation
const canvas = document.getElementById('dots-canvas');
const ctx = canvas.getContext('2d');

let width, height, dots = [];
const dotCount = 80;
const maxDistance = 150;
const dotSpeed = 0.3;

// Colors matching Codense brand
const colors = {
    dot: 'rgba(255, 102, 0, 0.6)',      // Orange dots
    dotHighlight: 'rgba(255, 102, 0, 1)', // Bright orange
    line: 'rgba(255, 102, 0, 0.15)',    // Subtle orange lines
    dotGray: 'rgba(150, 150, 150, 0.4)' // Gray dots
};

function setCanvasSize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
}

class Dot {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * dotSpeed;
        this.vy = (Math.random() - 0.5) * dotSpeed;
        this.radius = Math.random() * 2 + 1;
        this.isOrange = Math.random() < 0.3; // 30% orange, 70% gray
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isOrange ? colors.dot : colors.dotGray;
        ctx.fill();
    }
}

function init() {
    setCanvasSize();
    dots = [];
    for (let i = 0; i < dotCount; i++) {
        dots.push(new Dot());
    }
}

function connectDots() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 102, 0, ${opacity * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    dots.forEach(dot => {
        dot.update();
        dot.draw();
    });

    connectDots();
    requestAnimationFrame(animate);
}

// Handle resize
window.addEventListener('resize', () => {
    setCanvasSize();
});

// Initialize and start animation
init();
animate();

// Contact Form Handling with Web3Forms
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('form-success');
const errorMessage = document.getElementById('form-error');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('span');
    const originalText = buttonText.textContent;

    // Disable button and show loading
    submitButton.disabled = true;
    buttonText.textContent = 'Verzenden...';

    try {
        // Create FormData object from form
        const formData = new FormData(form);

        // Debug: log what we're sending
        console.log('Sending form data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Send form data using fetch
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('Response from Web3Forms:', data);

        if (response.ok && data.success) {
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Reset form
            form.reset();

            // Scroll to message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Start 10-second cooldown before allowing another submission
            let countdown = 10;
            submitButton.disabled = true;
            buttonText.textContent = `Wacht ${countdown} seconden...`;

            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    buttonText.textContent = `Wacht ${countdown} seconden...`;
                } else {
                    clearInterval(countdownInterval);
                    submitButton.disabled = false;
                    buttonText.textContent = originalText;
                    // Show form again after cooldown
                    form.style.display = 'block';
                    successMessage.style.display = 'none';
                }
            }, 1000);
        } else {
            throw new Error(data.message || 'Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);

        // Show error message
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';

        // Scroll to error
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Re-enable button after error
        submitButton.disabled = false;
        buttonText.textContent = originalText;
    }
});
