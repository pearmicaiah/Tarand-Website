
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

    // Innovation Layer: Bento Navigation
    const bento = new BentoNav();
    bento.init();

    // Intro Animation (GSAP)
    const tl = gsap.timeline();
    tl.to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });

    console.log('Tarand System: Online');
});
