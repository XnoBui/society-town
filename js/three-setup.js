// Three.js Scene Setup
let printerScene, printerCamera, printerRenderer;
let twinScene, twinCamera, twinRenderer;
let printerControls, twinControls;

// Initialize Three.js scenes
function initThreeJS() {
    // Printer Scene Setup
    printerScene = new THREE.Scene();
    printerCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    printerRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const printerCanvas = document.getElementById('printerCanvas');
    printerRenderer.setSize(printerCanvas.clientWidth, printerCanvas.clientHeight);
    printerCanvas.appendChild(printerRenderer.domElement);
    
    // Twin Scene Setup
    twinScene = new THREE.Scene();
    twinCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    twinRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const twinCanvas = document.getElementById('twinCanvas');
    twinRenderer.setSize(twinCanvas.clientWidth, twinCanvas.clientHeight);
    twinCanvas.appendChild(twinRenderer.domElement);
    
    // Camera Positions
    printerCamera.position.z = 5;
    twinCamera.position.z = 5;
    
    // Controls Setup
    printerControls = new THREE.OrbitControls(printerCamera, printerRenderer.domElement);
    printerControls.enableZoom = false;
    printerControls.enablePan = false;
    printerControls.autoRotate = true;
    printerControls.autoRotateSpeed = 2;
    
    twinControls = new THREE.OrbitControls(twinCamera, twinRenderer.domElement);
    twinControls.enableZoom = false;
    twinControls.enablePan = false;
    
    // Add Lights
    addLights(printerScene);
    addLights(twinScene);
    
    // Create Genesis Printer Model
    createPrinterModel();
    
    // Start Animation Loop
    animate();
}

// Add lights to scene
function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ffdd, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00ffdd, 1);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);
}

// Create Genesis Printer Model
function createPrinterModel() {
    // Create a basic printer model (placeholder)
    const geometry = new THREE.BoxGeometry(2, 3, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x00ffdd,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    const printer = new THREE.Mesh(geometry, material);
    printerScene.add(printer);
    
    // Add gene slots
    const slotGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const slotMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffdd,
        transparent: true,
        opacity: 0.3
    });
    
    // Position 5 slots around the printer
    for (let i = 0; i < 5; i++) {
        const slot = new THREE.Mesh(slotGeometry, slotMaterial.clone());
        const angle = (i / 5) * Math.PI * 2;
        slot.position.x = Math.cos(angle) * 1.2;
        slot.position.z = Math.sin(angle) * 1.2;
        slot.position.y = 0;
        printerScene.add(slot);
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    printerControls.update();
    twinControls.update();
    
    // Render scenes
    printerRenderer.render(printerScene, printerCamera);
    if (document.querySelector('.result-section').style.display !== 'none') {
        twinRenderer.render(twinScene, twinCamera);
    }
}

// Handle Window Resize
function onWindowResize() {
    const printerCanvas = document.getElementById('printerCanvas');
    const twinCanvas = document.getElementById('twinCanvas');
    
    // Update printer camera and renderer
    printerCamera.aspect = printerCanvas.clientWidth / printerCanvas.clientHeight;
    printerCamera.updateProjectionMatrix();
    printerRenderer.setSize(printerCanvas.clientWidth, printerCanvas.clientHeight);
    
    // Update twin camera and renderer
    twinCamera.aspect = twinCanvas.clientWidth / twinCanvas.clientHeight;
    twinCamera.updateProjectionMatrix();
    twinRenderer.setSize(twinCanvas.clientWidth, twinCanvas.clientHeight);
}

// Initialize on load
window.addEventListener('load', initThreeJS);
window.addEventListener('resize', onWindowResize); 