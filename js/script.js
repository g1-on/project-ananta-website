// Hero sentence animation
const paragraphContainer = document.getElementById('hero-paragraph-container');
if (paragraphContainer) {
    const originalP = paragraphContainer.querySelector('p');
    if (originalP) {
        const fullText = originalP.textContent;
        const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
        originalP.innerHTML = '';
        sentences.forEach((sentence, index) => {
            const span = document.createElement('span');
            span.className = 'hero-sentence';
            span.textContent = sentence.trim();
            originalP.appendChild(span);
            setTimeout(() => {
                span.classList.add('visible');
            }, (index * 1200) + 1000);
        });
    }
}

// Scroll to Top button
const scrollToTopButton = document.querySelector('.scroll-to-top');
if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        scrollToTopButton.classList.toggle('visible', window.pageYOffset > 300);
    });
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.ceil(start).toLocaleString('en-IN');
        if (start >= target) {
            element.textContent = target.toLocaleString('en-IN');
            clearInterval(timer);
        }
    }, 16);
    if (target === 0) element.textContent = '0';
}
const counters = document.querySelectorAll('.counter-value');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
counters.forEach(counter => counterObserver.observe(counter));

// NEW: About Section Animation
const aboutSection = document.getElementById('about');
const aboutContent = document.getElementById('about-content');
const aboutObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            aboutContent.classList.add('visible');
            aboutSection.classList.add('visible');
            const listItems = aboutSection.querySelectorAll('.list-item');
            listItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// NEW: 3D Tilt Effect for Info Cards
const infoCards = document.querySelectorAll('.info-card');
infoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;
        const rotateX = (y / height - 0.5) * -15;
        const rotateY = (x / width - 0.5) * 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});


// === UPDATED AND IMPROVED CONTACT FORM SCRIPT ===
const mainContactForm = document.getElementById('main-contact-form');
if (mainContactForm) {
    const formStatusMessage = document.getElementById('form-status-message');
    const submitButton = mainContactForm.querySelector('button[type="submit"]');

    mainContactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        formStatusMessage.textContent = '';
        formStatusMessage.className = 'mt-4 text-center';

        // More reliable way to get form data, this automatically finds the new select box
        const formData = new FormData(mainContactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Ensure this is your correct API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Success (status 200-299)
                formStatusMessage.textContent = 'Message sent successfully! We will get back to you soon.';
                formStatusMessage.classList.add('text-green-400');
                mainContactForm.reset();
                submitButton.textContent = 'Sent!';
                // Button remains disabled after successful submission
            } else {
                // Server responded with an error (status 4xx, 5xx)
                const errorResult = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
                throw new Error(errorResult.message);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatusMessage.textContent = error.message || 'Could not connect. Please check your internet and try again.';
            formStatusMessage.classList.add('text-red-400');
        } finally {
            // Re-enable the button ONLY if the submission failed
            if (!submitButton.textContent.includes('Sent!')) {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        }
    });
}
// === END OF UPDATED SCRIPT ===


// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Set current year in footer
const currentYearSpan = document.getElementById('currentYear');
if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();