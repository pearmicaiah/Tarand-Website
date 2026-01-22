
export default class LivingOrganism {
    constructor(container) {
        this.container = container;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
    }

    init() {
        if (!this.container) return;

        // 1. Scene
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0x0a0a0a); // Transparent for now to show CSS bg

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 5;

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // 4. Add "The Core" (Placeholder)
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x569D03, // Tarand/Ecomatt Green
            wireframe: true
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        // 5. Events
        window.addEventListener('resize', this.onResize.bind(this));

        // 6. Start Loop
        this.animate();
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

        if (this.mesh) {
            this.mesh.rotation.x += 0.001;
            this.mesh.rotation.y += 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
