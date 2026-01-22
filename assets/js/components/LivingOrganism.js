
export default class LivingOrganism {
    constructor(container) {
        this.container = container;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.group = null;

        // Configuration
        this.particlesData = [];
        this.nodeCount = 60; // Increased density
        this.connectionDistance = 180;
        this.baseSpeed = 0.5;
        this.targetSpeed = 0.5;

        // State
        this.time = 0;
        this.mouse = new THREE.Vector2();
        this.lastMouseMove = Date.now();
        this.isIdle = false;
        this.currentSector = 'group';

        // Sector Configs (Colors & Behaviors)
        this.sectors = {
            'group': { color: 0x569D03, speed: 0.5, dist: 180 }, // Default
            'energy': { color: 0xE5B946, speed: 2.0, dist: 140 }, // Fast, energetic
            'agro': { color: 0x569D03, speed: 0.3, dist: 220 }, // Slow, wide (growth)
            'mining': { color: 0xC69C6D, speed: 0.1, dist: 120 }, // Heavy, dense
            'manufacturing': { color: 0xD66853, speed: 1.0, dist: 160 }, // Regular, industrial
            'logistics': { color: 0x2B4C7E, speed: 1.5, dist: 200 }, // Flowing
            'retail': { color: 0xE63946, speed: 0.8, dist: 150 },
            'creative': { color: 0x9D4EDD, speed: 0.6, dist: 190 }
        };

        this.currentColor = new THREE.Color(this.sectors['group'].color);
        this.targetColor = new THREE.Color(this.sectors['group'].color);
    }

    init() {
        if (!this.container) return;

        // 1. Scene Setup
        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.001);

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 1000);
        this.camera.position.z = 400;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // 2. Create Constellation Group
        this.group = new THREE.Group();
        this.scene.add(this.group);

        // 3. Create Particles (Nodes)
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.nodeCount * 3);

        const pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF, // We tint via vertex colors or global update
            size: 4,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });

        for (let i = 0; i < this.nodeCount; i++) {
            const r = 300;
            const x = Math.random() * r - r / 2;
            const y = Math.random() * r - r / 2;
            const z = Math.random() * r - r / 2;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            this.particlesData.push({
                velocity: new THREE.Vector3(
                    -1 + Math.random() * 2,
                    -1 + Math.random() * 2,
                    -1 + Math.random() * 2
                ),
                originalPos: new THREE.Vector3(x, y, z), // For homing
                phase: Math.random() * Math.PI * 2 // Unique pulse phase
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.pointCloud = new THREE.Points(geometry, pMaterial);
        this.group.add(this.pointCloud);

        // 4. Lines (Connections)
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });

        this.linesGeometry = new THREE.BufferGeometry();
        this.linesMesh = new THREE.LineSegments(this.linesGeometry, lineMaterial);
        this.group.add(this.linesMesh);

        // 5. Events
        window.addEventListener('resize', this.onResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));

        // 6. Start Loop
        this.animate();
    }

    setMode(sectorId) {
        if (!this.sectors[sectorId]) return;

        this.currentSector = sectorId;
        const config = this.sectors[sectorId];

        // 1. Target Color
        this.targetColor.setHex(config.color);

        // 2. Target Speed
        this.targetSpeed = config.speed;

        // 3. Target Distance (Density)
        // We tween this property gradually
        gsap.to(this, {
            connectionDistance: config.dist,
            duration: 2,
            ease: "power2.out"
        });
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / this.width) * 2 - 1;
        this.mouse.y = -(e.clientY / this.height) * 2 + 1;
        this.lastMouseMove = Date.now();
        this.isIdle = false;
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.time += 0.01;

        // 1. Color Lerp (Smooth transition to sector color)
        this.currentColor.lerp(this.targetColor, 0.05);
        this.pointCloud.material.color.copy(this.currentColor);
        this.linesMesh.material.color.copy(this.currentColor);

        // 2. Speed Lerp
        this.baseSpeed += (this.targetSpeed - this.baseSpeed) * 0.05;

        // 3. Breathing (Z-Axis Pulse)
        // Entire organism slowly inhaled/exhales
        const breath = Math.sin(this.time * 0.5) * 20; // +/- 20 units
        this.group.position.z = breath;

        // 4. Idle Choreography
        const timeSinceMove = Date.now() - this.lastMouseMove;
        if (timeSinceMove > 8000) {
            this.isIdle = true;
            // Drifting rotation
            this.group.rotation.y += 0.002;
            this.group.rotation.x = Math.sin(this.time * 0.2) * 0.1;
        } else {
            // Mouse Influence
            this.group.rotation.y += 0.001;
            // Slight tilt towards mouse
            this.group.rotation.x += ((-this.mouse.y * 0.5) - this.group.rotation.x) * 0.05;
            this.group.rotation.y += ((this.mouse.x * 0.5) - this.group.rotation.y) * 0.05;
        }

        this.updateParticles();
        this.renderer.render(this.scene, this.camera);
    }

    updateParticles() {
        const positions = this.pointCloud.geometry.attributes.position.array;

        let linePositions = [];

        // Pulse Factor (Heartbeat)
        // Sharp beat every ~2 seconds
        const beat = Math.pow(Math.sin(this.time * 2), 20); // Spiky sine wave
        const pulseOpacity = 0.1 + (beat * 0.3);
        this.linesMesh.material.opacity = pulseOpacity;

        for (let i = 0; i < this.nodeCount; i++) {
            const data = this.particlesData[i];

            // Movement
            positions[i * 3] += data.velocity.x * this.baseSpeed;
            positions[i * 3 + 1] += data.velocity.y * this.baseSpeed;
            positions[i * 3 + 2] += data.velocity.z * this.baseSpeed;

            // Boundaries (Bounce) - Dynamic based on state?
            const limit = 200;
            if (positions[i * 3 + 1] < -limit || positions[i * 3 + 1] > limit) data.velocity.y = -data.velocity.y;
            if (positions[i * 3] < -limit || positions[i * 3] > limit) data.velocity.x = -data.velocity.x;
            if (positions[i * 3 + 2] < -limit || positions[i * 3 + 2] > limit) data.velocity.z = -data.velocity.z;

            // Connections
            for (let j = i + 1; j < this.nodeCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < this.connectionDistance) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }

        this.pointCloud.geometry.attributes.position.needsUpdate = true;
        this.linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    }
}
