/* ════════════════════════════════════════════
   ROYCO DISTRIBUTORS — main.js
════════════════════════════════════════════ */

// ── Copyright year ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu toggle ──
const toggle = document.getElementById('menuToggle');
const menu   = document.getElementById('navMenu');

toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
});

// Close menu when a nav link is clicked
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
});

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
