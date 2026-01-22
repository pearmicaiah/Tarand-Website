
export default class BentoNav {
    constructor() {
        this.trigger = document.querySelector('#menu-trigger');
        this.overlay = document.querySelector('.bento-overlay');
        this.closeBtn = document.querySelector('.close-bento');
        this.isOpen = false;
    }

    init() {
        if (!this.trigger) return;

        this.trigger.addEventListener('click', () => this.toggle());
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Optional: Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.overlay.style.display = 'block';

        // Simple GSAP transition
        gsap.to(this.overlay, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Lock scroll
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;

        gsap.to(this.overlay, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                this.overlay.style.display = 'none';
            }
        });

        // Unlock scroll
        document.body.style.overflow = '';
    }
}
