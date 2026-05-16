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
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

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

// ── Contact form ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn    = contactForm.querySelector('.form-submit');
    const errorMsg     = contactForm.querySelector('.form-error-msg');
    const successPanel = document.querySelector('.form-success');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
        errorMsg.style.display = 'none';

        const body = {
            firstName: contactForm.firstName.value,
            lastName:  contactForm.lastName.value,
            email:     contactForm.email.value,
            phone:     contactForm.phone.value,
            company:   contactForm.company.value,
            subject:   contactForm.subject.value,
            message:   contactForm.message.value,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            contactForm.style.display = 'none';
            if (successPanel) successPanel.style.display = 'block';

        } catch (err) {
            errorMsg.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}