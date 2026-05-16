/* ════════════════════════════════════════════
   ROYCO DISTRIBUTORS — main.js
════════════════════════════════════════════ */

// ── Copyright year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// ── Mobile menu toggle ──
const toggle = document.getElementById('menuToggle');
const menu   = document.getElementById('navMenu');

if (toggle && menu) {
    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        // FIX: accessibility — update aria-expanded
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a nav link is clicked
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // FIX: close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('open') &&
            !menu.contains(e.target) &&
            !toggle.contains(e.target)) {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal, .reveal-left');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Contact form: success/error feedback ──
// Works with Web3Forms (action="https://api.web3forms.com/submit")
const contactForm = document.querySelector('form[action*="web3forms"]');
if (contactForm) {
    const successPanel = document.querySelector('.form-success');
    let errorMsg = document.querySelector('.form-error-msg');

    // Inject error element if not present in HTML
    if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'form-error-msg';
        errorMsg.textContent = 'Something went wrong. Please try again or call us directly.';
        contactForm.appendChild(errorMsg);
    }

    // SECURITY FIX: inject honeypot field dynamically so bots that
    // parse static HTML don't know to skip it
    const honeypot = document.createElement('input');
    honeypot.type  = 'text';
    honeypot.name  = 'botcheck';
    honeypot.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0;width:0;';
    honeypot.tabIndex = -1;
    honeypot.setAttribute('autocomplete', 'off');
    honeypot.setAttribute('aria-hidden', 'true');
    contactForm.prepend(honeypot);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
        errorMsg.style.display = 'none';

        try {
            const data = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            const result = await response.json();

            if (result.success) {
                // Hide form, show success panel
                contactForm.style.display = 'none';
                if (successPanel) {
                    successPanel.style.display = 'block';
                } else {
                    // Fallback if success panel isn't in HTML
                    const fallback = document.createElement('div');
                    fallback.className = 'form-success';
                    fallback.style.display = 'block';
                    fallback.innerHTML = `
                        <div class="success-icon">✅</div>
                        <h3>Message Sent!</h3>
                        <p>Thanks for reaching out — we'll get back to you within one business day.</p>
                    `;
                    contactForm.parentNode.appendChild(fallback);
                }
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (err) {
            console.error('Form error:', err);
            errorMsg.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}