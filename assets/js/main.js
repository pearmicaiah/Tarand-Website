
import BentoNav from './components/BentoNav.js';
import LivingOrganism from './components/LivingOrganism.js';

console.log('Tarand System: Initializing...');


// 1. Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Global State
window.tarandState = {
    organism: null,
    bento: null,
    scrollProgress: 0
};

// RAF Loop for Scroll & Animation
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Initialize Components
document.addEventListener('DOMContentLoaded', () => {

    // Innovation Layer: WebGL Background
    const organism = new LivingOrganism(document.querySelector('#webgl-canvas'));
    organism.init();
    window.tarandState.organism = organism;

    // Innovation Layer: Bento Navigation
    const bento = new BentoNav();
    bento.init();
    window.tarandState.bento = bento;

    // 3. Cinematic Scroll Logic
    lenis.on('scroll', (e) => {
        window.tarandState.scrollProgress = e.progress; // 0 to 1

        // A. Camera Dolly
        // As we scroll down, camera moves closer/deeper
        if (organism.camera) {
            organism.camera.position.z = 400 - (e.scrollY * 0.2);
        }

        // B. Blur Effect
        // The deeper we go, the blurrier/dreamier the background gets
        const blurAmount = Math.min(10, e.scrollY * 0.01);
        gsap.to('#webgl-canvas', {
            filter: `blur(${blurAmount}px)`,
            duration: 0.5,
            overwrite: true
        });

        // C. Parallax Elements
        // Move hero text differently
        gsap.to('.hero-content', {
            y: e.scrollY * 0.5,
            opacity: 1 - (e.scrollY * 0.002),
            overwrite: true
        });
    });

    // 4. Intro Animation (GSAP)
    const tl = gsap.timeline();
    tl.to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });

    // 5. Time-Based "Immersion" States
    setTimeout(() => {
        console.log("Tarand: Entering Orientation Phase");
        // Subtle shift to indicate the user has stayed
        if (organism) organism.targetSpeed = 0.8;
    }, 5000);

    setTimeout(() => {
        console.log("Tarand: Entering Immersion Phase");
        // Deepen the experience
        if (organism) organism.connectionDistance = 250; // Connections grow
    }, 20000);

    console.log('Tarand System: Online');
});

