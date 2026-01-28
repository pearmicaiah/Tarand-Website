/**
 * Hero Slider Logic
 * Handles the sector spotlight slider in the hero section.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
});

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const progressBar = document.getElementById('hero-slider-progress');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    if (!slides.length) return;

    let currentIndex = 0;
    const intervalTime = 5000;
    let autoSlideInterval;

    // Initialize state
    updateSlides();
    resetProgressBar();

    function updateSlides() {
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                // Active Slide
                slide.classList.remove('opacity-0', 'translate-x-12', '-translate-x-12');
                slide.classList.add('opacity-100', 'translate-x-0');
            } else {
                // Inactive Slides
                slide.classList.remove('opacity-100', 'translate-x-0');
                slide.classList.add('opacity-0', 'translate-x-12'); // Push to right hidden
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
        resetProgressBar();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
        resetProgressBar();
    }

    function resetProgressBar() {
        // Reset animation
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        // Force reflow
        void progressBar.offsetWidth;

        // Start animation
        progressBar.style.transition = `width ${intervalTime}ms linear`;
        progressBar.style.width = '100%';

        // Clear and restart interval
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, intervalTime);
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
    });

    // Pause on hover
    const container = document.querySelector('.bg-white\\/10');
    if (container) {
        container.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
            // Freeze progress bar
            const width = progressBar.offsetWidth;
            progressBar.style.transition = 'none';
            progressBar.style.width = `${width}px`;
        });
        container.addEventListener('mouseleave', () => {
            // Restart animation from beginning of current slide (simpler UX)
            // Or we could resume, but resetting is cleaner for the interval logic.
            resetProgressBar();
            // Manually trigger next slide after full delay? 
            // Actually resetProgressBar calls setInterval, so it just restarts the timer for the *current* slide (effectively) or next.
            // Let's just call resetProgressBar to restart the timer for the current view.
        });
    }
}
