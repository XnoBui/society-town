// Animation States and Objects
let geneVials = [];
let printerChamber;
let energyTubes = [];
let isAnimating = false;

// Initialize animation objects
function initAnimationObjects() {
    // Create gene vials
    const vialGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const vialMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffdd,
        transparent: true,
        opacity: 0.8
    });
    
    for (let i = 0; i < 5; i++) {
        const vial = new THREE.Mesh(vialGeometry, vialMaterial.clone());
        vial.position.set(0, -5, 0); // Start off-screen
        printerScene.add(vial);
        geneVials.push(vial);
    }
    
    // Create printer chamber
    const chamberGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const chamberMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x00ffdd,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9
    });
    
    printerChamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    printerScene.add(printerChamber);
    
    // Create energy tubes
    const tubeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
    const tubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffdd,
        transparent: true,
        opacity: 0.3
    });
    
    for (let i = 0; i < 5; i++) {
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial.clone());
        const angle = (i / 5) * Math.PI * 2;
        tube.position.x = Math.cos(angle) * 1.2;
        tube.position.z = Math.sin(angle) * 1.2;
        printerScene.add(tube);
        energyTubes.push(tube);
    }
}

// Start reveal animation sequence
async function startRevealAnimation(genes) {
    if (isAnimating) return;
    isAnimating = true;
    
    try {
        // Step 1: Load Genes (1-2 seconds)
        await loadGenesAnimation(genes);
        
        // Step 2: Printer Activation (2-3 seconds)
        await activatePrinterAnimation();
        
        // Step 3: Reveal (2-3 seconds)
        const twinType = await revealTwinAnimation(genes);
        
        return twinType;
    } catch (error) {
        console.error('Animation error:', error);
    } finally {
        isAnimating = false;
    }
}

// Load genes animation
function loadGenesAnimation(genes) {
    return new Promise((resolve) => {
        genes.forEach((gene, index) => {
            const vial = geneVials[index];
            const targetPosition = {
                x: Math.cos((index / 5) * Math.PI * 2) * 1.2,
                y: 0,
                z: Math.sin((index / 5) * Math.PI * 2) * 1.2
            };
            
            // Update vial color based on star rating
            const colors = {
                1: 0x4A90E2,
                2: 0x50E3C2,
                3: 0xBD10E0,
                4: 0xF5A623
            };
            vial.material.color.setHex(colors[gene.stars]);
            vial.material.emissive.setHex(colors[gene.stars]);
            vial.material.emissiveIntensity = 0.5;
            
            // Animate vial movement
            new TWEEN.Tween(vial.position)
                .to(targetPosition, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .delay(index * 200)
                .start();
        });
        
        // Resolve after all vials are in place
        setTimeout(resolve, 2000);
    });
}

// Printer activation animation
function activatePrinterAnimation() {
    return new Promise((resolve) => {
        // Animate chamber glow
        new TWEEN.Tween(printerChamber.material)
            .to({ emissiveIntensity: 1 }, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        
        // Animate energy tubes
        energyTubes.forEach((tube, index) => {
            new TWEEN.Tween(tube.material)
                .to({ opacity: 0.8 }, 500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(index * 200)
                .yoyo(true)
                .repeat(2)
                .start();
        });
        
        setTimeout(resolve, 2500);
    });
}

// Reveal twin animation
function revealTwinAnimation(genes) {
    return new Promise((resolve) => {
        // Determine twin type
        const twinType = determineAITwinType(genes);
        
        // Flash effect
        const flash = new THREE.PointLight(0xffffff, 2);
        flash.position.set(0, 0, 0);
        printerScene.add(flash);
        
        // Fade in twin type color
        const twinColors = {
            Celestial: 0xF5A623,
            Draconic: 0xBD10E0,
            Cybernetic: 0x50E3C2,
            Humanoid: 0x4A90E2
        };
        
        // Animate flash
        new TWEEN.Tween(flash)
            .to({ intensity: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                printerScene.remove(flash);
            })
            .start();
        
        // Change chamber color
        new TWEEN.Tween(printerChamber.material.emissive)
            .to({ r: (twinColors[twinType] >> 16) / 255,
                 g: ((twinColors[twinType] >> 8) & 255) / 255,
                 b: (twinColors[twinType] & 255) / 255 }, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        
        setTimeout(() => resolve(twinType), 3000);
    });
}

// Update animation loop
function updateAnimations() {
    TWEEN.update();
}

// Initialize animations
window.addEventListener('load', () => {
    initAnimationObjects();
    
    // Add TWEEN update to animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        updateAnimations();
    };
    animate();
}); 