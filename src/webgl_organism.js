
// Tarand "Living Organism" - Innovation Layer 5.1
// A slow-rotating 3D cluster representing the connected ecosystem.

document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('hero-canvas');
    if (!canvasContainer) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // Particles (The Organism)
    const geometry = new THREE.BufferGeometry();
    const count = 300; // Number of "cells" in the organism
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const brandColors = [
        new THREE.Color('#0F6DB4'), // Primary Blue
        new THREE.Color('#2CB67D'), // Green
        new THREE.Color('#25215A'), // Indigo Accent
        new THREE.Color('#ffffff')  // White sparkles
    ];

    for (let i = 0; i < count; i++) {
        const r = (Math.random() - 0.5) * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        // Spherical distribution
        const x = 5 * Math.sin(phi) * Math.cos(theta);
        const y = 5 * Math.sin(phi) * Math.sin(theta);
        const z = 5 * Math.cos(phi);

        positions[i * 3] = x + (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 2;

        const color = brandColors[Math.floor(Math.random() * brandColors.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting Lines (The Network)
    // We can add a line loop or plexus effect if needed, but keeping it "cellular" for now as per "Cluster" description.

    camera.position.z = 10;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    // Expose Control API
    window.TarandScene = {
        mode: 'default',
        setMode(newMode) {
            this.mode = newMode;
            // Immediate State Reactions
            if (newMode === 'menu-open') {
                // Dim and slow
                targetRotationSpeed = 0.0001;
                particles.material.opacity = 0.3;
                camera.position.z = 15; // Pull back
            } else if (newMode === 'focus') {
                targetRotationSpeed = 0.005;
                particles.material.opacity = 1;
                camera.position.z = 8; // Zoom in
            } else {
                // Default
                targetRotationSpeed = 0.0005;
                particles.material.opacity = 0.8;
                camera.position.z = 10;
            }
        },
        pulse() {
            // Quick pulse effect
            const originalScale = particles.scale.x;
            particles.scale.setScalar(originalScale * 1.1);
            setTimeout(() => {
                particles.scale.setScalar(originalScale);
            }, 200);
        }
    };

    let targetRotationSpeed = 0.0005;
    let currentRotationSpeed = 0.0005;

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Smoothly interpolate speeds
        currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.05;

        // Slow rotation (Living)
        particles.rotation.y += currentRotationSpeed;
        particles.rotation.x += currentRotationSpeed * 0.5;

        // Mouse influence (Responsive) - Reduced when menu is open
        const sensitivity = window.TarandScene.mode === 'menu-open' ? 0.005 : 0.02;
        particles.rotation.y += mouseX * sensitivity;
        particles.rotation.x += mouseY * sensitivity;

        // Pulse effect (Breathing)
        const time = Date.now() * 0.001;

        // Simpler breathing in menu mode
        const breathIntensity = window.TarandScene.mode === 'menu-open' ? 0.02 : 0.05;

        particles.scale.x = 1 + Math.sin(time) * breathIntensity;
        particles.scale.y = 1 + Math.sin(time) * breathIntensity;
        particles.scale.z = 1 + Math.sin(time) * breathIntensity;

        renderer.render(scene, camera);

        // Interpolate Camera Z for smooth transitions
        if (Math.abs(camera.position.z - (window.TarandScene.mode === 'menu-open' ? 15 : 10)) > 0.1) {
            // Basic lerp for camera - purely decorative
        }
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
