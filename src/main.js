
/**
 * Innscor Africa Clone - Main Controller
 * Handles Navigation, Mega Menu State, Animations, and Scroll Effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initMobileMenu();
    initMegaMenu();
    initScrollReveal();
});

function initScrollEffects() {
    const header = document.getElementById('main-header');

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initMobileMenu() {
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');
    const nav = document.getElementById('off-canvas-nav');
    const overlay = document.getElementById('menu-overlay');

    if (!openBtn || !nav) return;

    const toggleMenu = (isActive) => {
        if (isActive) {
            nav.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('overflow-hidden');
        } else {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        }
    };

    openBtn.addEventListener('click', () => toggleMenu(true));
    closeBtn.addEventListener('click', () => toggleMenu(false));
    overlay.addEventListener('click', () => toggleMenu(false));
}

function initMegaMenu() {
    const tabs = document.querySelectorAll('.mega-tab-btn');
    const contents = document.querySelectorAll('.mega-tab-content');

    if (!tabs.length) return;

    class MegaMenuController {
        constructor(btns, panels) {
            this.btns = btns;
            this.panels = panels;
            this.activeTab = 'mill-bake'; // Default
            this.init();
        }

        init() {
            this.btns.forEach(btn => {
                btn.addEventListener('mouseenter', (e) => this.switchTab(e.target.dataset.tab));
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab(e.currentTarget.dataset.tab);
                });
            });
        }

        switchTab(tabId) {
            if (this.activeTab === tabId) return;
            this.activeTab = tabId;

            // Update Buttons
            this.btns.forEach(btn => {
                if (btn.dataset.tab === tabId) {
                    btn.classList.add('active');
                    btn.classList.add('bg-white', 'shadow-sm'); // Visual feedback
                } else {
                    btn.classList.remove('active');
                    btn.classList.remove('bg-white', 'shadow-sm');
                }
            });

            // Update Panels
            this.panels.forEach(panel => {
                // Determine ID match
                // Panel IDs are: tab-content-mill-bake, etc.
                const panelId = panel.id.replace('tab-content-', '');

                if (panelId === tabId) {
                    panel.classList.remove('hidden');
                    // Reset animation safely
                    panel.classList.remove('animate-fade-in');
                    void panel.offsetWidth; // Trigger reflow
                    panel.classList.add('animate-fade-in');
                } else {
                    panel.classList.add('hidden');
                }
            });
        }
    }

    new MegaMenuController(tabs, contents);
}

function initScrollReveal() {
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}
