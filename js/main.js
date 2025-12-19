// ===================================
// GLOBAL VARIABLES
// ===================================

const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const mobileToggle = document.getElementById('mobileToggle');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// ===================================
// THEME TOGGLE
// ===================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// SMOOTH SCROLL & ACTIVE NAV LINK
// ===================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// TYPING ANIMATION
// ===================================

const phrases = [
    'Frontend Developer',
    'Web Designer',
    'UI/UX Enthusiast',
    'Problem Solver'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before next phrase
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing animation
if (typingText) {
    typeText();
}

// ===================================
// INTERSECTION OBSERVER - ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const progress = progressBar.getAttribute('data-progress');
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 200);
            }
            
            // Animate stat numbers
            if (entry.target.classList.contains('stat-card')) {
                const statNumber = entry.target.querySelector('.stat-number');
                animateCounter(statNumber);
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
const animatedElements = document.querySelectorAll('.skill-card, .project-card, .stat-card, .about-text, .contact-info, .contact-form');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// COUNTER ANIMATION
// ===================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset previous errors
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorSpan = group.querySelector('.form-error');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
        
        // Validate fields
        let isValid = true;
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        if (name.value.trim().length < 2) {
            showError(name, 'Name must be at least 2 characters');
            isValid = false;
        }
        
        if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (subject.value.trim().length < 3) {
            showError(subject, 'Subject must be at least 3 characters');
            isValid = false;
        }
        
        if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                // Show success message
                if (formSuccess) formSuccess.classList.add('show');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (formSuccess) formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const errorSpan = formGroup.querySelector('.form-error');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// PARALLAX EFFECT ON SCROLL
// ===================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// CURSOR TRAIL EFFECT (OPTIONAL)
// ===================================

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;
    
    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// ===================================
// PROJECT CARDS TILT EFFECT
// ===================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================

window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateActiveNavLink();
    
    // Add entrance animation to hero section
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    setTimeout(() => {
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
        if (heroImage) {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }
    }, 100);
});

// Initial hero animation setup
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        heroImage.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    }
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #8b5cf6;');
console.log('%cLooking at the code? I like your style! 🚀', 'font-size: 14px; color: #06b6d4;');
console.log('%cFeel free to reach out: sinankayasoftware@gmail.com', 'font-size: 12px; color: #a1a1aa;');
