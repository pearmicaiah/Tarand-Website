
/**
 * Tarand Command Interface - Main Controller
 * Implements Navigation State Machine, Ticker Logic, and WebGL Integration.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavStateMachine();
    initTickerLogic();
    initSectorHoverBar(); // New Hover Bar Logic
    initScrollReveal();
});

function initSectorHoverBar() {
    const triggerLink = document.getElementById('link-sectors');
    const hoverBar = document.getElementById('mega-hover-bar');
    const nav = document.getElementById('command-nav');

    // Internal State
    let isHoveringLink = false;
    let isHoveringBar = false;
    let closeTimeout;

    // Show Function
    const showBar = () => {
        clearTimeout(closeTimeout);
        hoverBar.classList.remove('opacity-0', 'invisible', 'translate-y-4', 'pointer-events-none');
        hoverBar.classList.add('opacity-100', 'visible', 'translate-y-0', 'pointer-events-auto');
    };

    // Hide Function (with safety delay)
    const hideBar = () => {
        closeTimeout = setTimeout(() => {
            if (!isHoveringLink && !isHoveringBar) {
                hoverBar.classList.add('opacity-0', 'invisible', 'translate-y-4', 'pointer-events-none');
                hoverBar.classList.remove('opacity-100', 'visible', 'translate-y-0', 'pointer-events-auto');
            }
        }, 150);
    };

    // 1. Link Interaction
    triggerLink.addEventListener('mouseenter', () => {
        isHoveringLink = true;
        showBar();
    });

    triggerLink.addEventListener('mouseleave', () => {
        isHoveringLink = false;
        hideBar();
    });

    // 2. Bar Interaction
    hoverBar.addEventListener('mouseenter', () => {
        isHoveringBar = true;
        showBar();
    });

    hoverBar.addEventListener('mouseleave', () => {
        isHoveringBar = false;
        hideBar();
    });

    // 3. Tab State Logic (Keep functionality)
    const triggers = document.querySelectorAll('.sector-trigger');
    const panels = document.querySelectorAll('.sector-panel');

    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            const targetId = trigger.dataset.target;

            // Update Triggers
            triggers.forEach(t => t.classList.remove('active'));
            trigger.classList.add('active');

            // Update Panels
            panels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.remove('opacity-0', 'invisible');
                    panel.classList.add('opacity-100', 'visible');
                } else {
                    panel.classList.add('opacity-0', 'invisible');
                    panel.classList.remove('opacity-100', 'visible');
                }
            });
        });
    });
}

function initNavStateMachine() {
    const nav = document.getElementById('command-nav');
    const menuTrigger = document.getElementById('cmd-menu-trigger');
    const closeTrigger = document.getElementById('cmd-menu-close');
    const menuOverlay = document.getElementById('command-menu');
    const ticker = document.getElementById('status-ticker');

    // State definitions
    const STATES = {
        IDLE: 'idle',
        SCROLLED: 'scrolled',
        MENU_OPEN: 'menu-open'
        // SECTOR_CONTEXT handled via data attribute on body
    };

    let currentState = STATES.IDLE;

    // --- State Transition Logic ---
    function setState(newState) {
        if (currentState === newState) return;

        console.log(`Nav State Change: ${currentState} -> ${newState}`);
        currentState = newState;
        nav.dataset.state = newState;

        // Side Effects
        if (newState === STATES.MENU_OPEN) {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock Scroll

            // WebGL Reaction
            if (window.TarandScene) window.TarandScene.setMode('menu-open');

            // Defocus Main Content (Optional visual flair)
            document.querySelector('main').style.filter = 'blur(5px) grayscale(50%)';
            document.querySelector('main').style.transition = 'filter 0.5s';

        } else {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Unlock Scroll

            // WebGL Reaction
            if (window.TarandScene) window.TarandScene.setMode('default');

            // Restore Content
            document.querySelector('main').style.filter = '';
        }
    }

    // --- Event Listeners ---

    // 1. Scroll Handler (Throttle)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (currentState === STATES.MENU_OPEN) return;

        // Immediate reaction: Scrolled state
        if (window.scrollY > 50) {
            setState(STATES.SCROLLED);
            nav.dataset.state = 'scrolled';
            // ticker.style.opacity = '0'; // Keep ticker visible for now unless distracting
        } else {
            setState(STATES.IDLE);
            nav.dataset.state = 'idle';
            // ticker.style.opacity = '1';
        }

        // Detect "Stop" for Ticker Re-entry
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (currentState !== STATES.MENU_OPEN) {
                ticker.style.opacity = '1'; // Show ticker when idle
            }
        }, 1500); // 1.5s idle to show ticker
    });

    // 2. Menu Interactions
    menuTrigger.addEventListener('click', () => setState(STATES.MENU_OPEN));
    closeTrigger.addEventListener('click', () => {
        // Return to appropriate state based on scroll
        if (window.scrollY > 50) setState(STATES.SCROLLED);
        else setState(STATES.IDLE);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentState === STATES.MENU_OPEN) {
            if (window.scrollY > 50) setState(STATES.SCROLLED);
            else setState(STATES.IDLE);
        }
    });

    // Close on Outside Click (if needed, but overlay covers screen)
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            if (window.scrollY > 50) setState(STATES.SCROLLED);
            else setState(STATES.IDLE);
        }
    });
}

function initTickerLogic() {
    const pwrEl = document.getElementById('ticker-pwr');
    const agroEl = document.getElementById('ticker-agro');

    // Simulate live telemetry with micro-fluctuations
    setInterval(() => {
        // PWR Fluctuation (248-252 MW)
        const pwrVal = (250 + (Math.random() * 4 - 2)).toFixed(1);

        // Randomly update text to feel alive
        if (Math.random() > 0.7) {
            pwrEl.innerText = `${pwrVal} MW`;
            // Trigger pulse
            pwrEl.style.color = '#fff';
            setTimeout(() => pwrEl.style.color = '', 300);
        }

    }, 2000);

    setInterval(() => {
        // Agro Fluctuation (45,000 +/- 50)
        if (Math.random() > 0.8) {
            const agroVal = Math.floor(45000 + (Math.random() * 100 - 50));
            agroEl.innerText = `${(agroVal / 1000).toFixed(1)}K T`;
            agroEl.style.color = '#fff';
            setTimeout(() => agroEl.style.color = '', 300);
        }
    }, 3500);
}

function initScrollReveal() {
    // Keep existing reveal logic as it works well
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
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
