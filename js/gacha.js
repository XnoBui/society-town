// Gacha System Configuration
const GACHA_CONFIG = {
    spinCost: 50,
    animationDuration: 3000, // 3 seconds
    rarityProbabilities: {
        common: 0.6,
        rare: 0.3,
        epic: 0.1
    }
};

// Sample Gene NFT Data (replace with actual data from backend)
const GENE_POOL = [
    {
        id: 1,
        name: "Cybernetic Power Gene",
        description: "Enhanced strength with a futuristic edge",
        rarity: "rare",
        type: "cybernetic",
        category: "power",
        imageUrl: "images/genes/cybernetic-power.png"
    },
    // Add more genes here...
];

// State Management
let state = {
    tokens: 50,
    inventory: [],
    currentScreen: 'gacha-landing',
    coinInserted: false
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    state.currentScreen = screenId;
}

// Token Management
function updateTokens(amount) {
    state.tokens += amount;
    document.getElementById('token-count').textContent = state.tokens;
}

function canSpin() {
    return state.tokens >= GACHA_CONFIG.spinCost;
}

// Gacha Machine 3D Model
let gachaScene, gachaCamera, gachaRenderer, gachaMachine, capsules;

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

function initGachaMachine() {
    // Three.js setup
    gachaScene = new THREE.Scene();
    gachaCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    gachaRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true
    });
    
    const container = document.getElementById('gacha-machine');
    gachaRenderer.setSize(container.clientWidth, container.clientHeight);
    gachaRenderer.setClearColor(0x000000, 0);
    container.appendChild(gachaRenderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    gachaScene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 0, 5);
    gachaScene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, 0, -5);
    gachaScene.add(backLight);

    // Add point lights for better highlights
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
    pointLight1.position.set(5, 5, 5);
    gachaScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
    pointLight2.position.set(-5, -5, -5);
    gachaScene.add(pointLight2);

    // Create machine body with rounded corners
    const machineGeometry = new THREE.BoxGeometry(4, 4, 4, 1, 1, 1);
    const machineMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    gachaMachine = new THREE.Group();

    // Main body
    const machineBody = new THREE.Mesh(machineGeometry, machineMaterial);
    gachaMachine.add(machineBody);

    // Display window with better transparency
    const windowGeometry = new THREE.BoxGeometry(2.5, 2, 2);
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.1,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const displayWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    displayWindow.position.set(0, 0.2, 1.5);
    gachaMachine.add(displayWindow);

    // Coin slot
    const slotGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.1);
    const slotMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x808080,
        metalness: 0.8,
        roughness: 0.2
    });
    const coinSlot = new THREE.Mesh(slotGeometry, slotMaterial);
    coinSlot.position.set(1.8, 0, 2);
    gachaMachine.add(coinSlot);

    // Dispenser
    const dispenserGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.1);
    const dispenserMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x808080,
        metalness: 0.8,
        roughness: 0.2
    });
    const dispenser = new THREE.Mesh(dispenserGeometry, dispenserMaterial);
    dispenser.position.set(0, -1.8, 2);
    gachaMachine.add(dispenser);

    // Add capsules
    capsules = new THREE.Group();
    const capsuleGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const capsuleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8
    });

    for (let i = 0; i < 20; i++) {
        const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
        capsule.position.set(
            Math.random() * 2 - 1,
            Math.random() * 1.5 - 1,
            Math.random() * 1.5
        );
        capsules.add(capsule);
    }
    
    displayWindow.add(capsules);

    // Add text "MINI GASHAPON"
    const loader = new THREE.TextureLoader();
    const textGeometry = new THREE.PlaneGeometry(2, 0.3);
    const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 1.6, 2);
    gachaMachine.add(textMesh);

    gachaScene.add(gachaMachine);

    // Adjust camera position for better view
    gachaCamera.position.set(0, 0, 10);
    gachaCamera.lookAt(0, 0, 0);

    // Add mouse interaction events
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseUp);

    animate();
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    const rotationSpeed = 0.005;
    gachaMachine.rotation.y += deltaMove.x * rotationSpeed;
    gachaMachine.rotation.x += deltaMove.y * rotationSpeed;

    // Limit vertical rotation
    gachaMachine.rotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, gachaMachine.rotation.x));

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isDragging = false;
}

function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
        // Gentle automatic rotation when not being dragged
        gachaMachine.rotation.y += 0.001;
    }

    // Animate capsules
    capsules.children.forEach((capsule, i) => {
        capsule.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001;
    });

    gachaRenderer.render(gachaScene, gachaCamera);
}

// Gacha Logic
function spinGacha() {
    if (!canSpin()) {
        alert("Not enough tokens! Get more tokens to spin.");
        return;
    }

    // Deduct tokens
    updateTokens(-GACHA_CONFIG.spinCost);

    // Show spin animation
    showScreen('spin-animation');

    // Determine rarity based on probabilities
    const random = Math.random();
    let rarity;
    if (random < GACHA_CONFIG.rarityProbabilities.epic) {
        rarity = 'epic';
    } else if (random < GACHA_CONFIG.rarityProbabilities.rare + GACHA_CONFIG.rarityProbabilities.epic) {
        rarity = 'rare';
    } else {
        rarity = 'common';
    }

    // Select random gene of determined rarity
    const availableGenes = GENE_POOL.filter(gene => gene.rarity === rarity);
    const selectedGene = availableGenes[Math.floor(Math.random() * availableGenes.length)];

    // Add to inventory
    state.inventory.push(selectedGene);

    // Show reveal screen after animation
    setTimeout(() => {
        showGeneReveal(selectedGene);
    }, GACHA_CONFIG.animationDuration);
}

function showGeneReveal(gene) {
    showScreen('gene-reveal');
    
    // Update modal content
    document.getElementById('nft-image').src = gene.imageUrl;
    document.getElementById('nft-name').textContent = gene.name;
    document.getElementById('nft-description').textContent = gene.description;
    document.getElementById('nft-rarity').textContent = gene.rarity.toUpperCase();
    document.getElementById('nft-rarity').className = `rarity-tag ${gene.rarity}`;
}

// Inventory Management
function updateInventory() {
    const grid = document.getElementById('nft-grid');
    grid.innerHTML = '';

    state.inventory.forEach(gene => {
        const tile = document.createElement('div');
        tile.className = 'nft-tile';
        tile.innerHTML = `
            <img src="${gene.imageUrl}" alt="${gene.name}">
            <h3>${gene.name}</h3>
            <span class="rarity-tag ${gene.rarity}">${gene.rarity.toUpperCase()}</span>
        `;
        grid.appendChild(tile);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initGachaMachine();
    updateInventory();
    
    const coinSlot = document.querySelector('.coin-slot');
    const spinButton = document.querySelector('.spin-button');

    // Coin slot click handler
    coinSlot.addEventListener('click', () => {
        if (!canSpin()) {
            alert("Not enough tokens! Get more tokens to spin.");
            return;
        }

        if (!state.coinInserted) {
            // Add coin insertion animation
            const coin = document.createElement('div');
            coin.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: var(--accent-color);
                border-radius: 50%;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                animation: insertCoin 0.5s ease-in forwards;
            `;

            const keyframes = `
                @keyframes insertCoin {
                    0% {
                        top: 0;
                        opacity: 1;
                    }
                    100% {
                        top: 100%;
                        opacity: 0;
                    }
                }
            `;

            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);

            coinSlot.appendChild(coin);

            // Remove coin element after animation
            setTimeout(() => {
                coin.remove();
                style.remove();
            }, 500);

            // Update state and UI
            state.coinInserted = true;
            coinSlot.classList.add('coin-inserted');
            spinButton.disabled = false;

            // Play coin sound if available
            const coinSound = new Audio('sounds/coin.mp3');
            coinSound.play().catch(() => {}); // Ignore errors if sound fails to play
        }
    });

    // Spin button click handler
    spinButton.addEventListener('click', () => {
        if (!state.coinInserted || !canSpin()) return;

        // Reset coin slot state
        state.coinInserted = false;
        coinSlot.classList.remove('coin-inserted');
        spinButton.disabled = true;

        // Add click animation to button
        spinButton.style.transform = 'translateY(1px)';
        spinButton.style.boxShadow = '0 2px 8px rgba(108, 92, 231, 0.2)';
        
        setTimeout(() => {
            spinButton.style.transform = '';
            spinButton.style.boxShadow = '';
        }, 150);
        
        spinGacha();
    });

    // Spin again button
    document.getElementById('spin-again').addEventListener('click', () => {
        showScreen('gacha-landing');
    });

    // View inventory button
    document.getElementById('view-inventory').addEventListener('click', () => {
        showScreen('inventory');
    });

    // Share button
    document.querySelector('.share-button').addEventListener('click', () => {
        const gene = state.inventory[state.inventory.length - 1];
        const shareText = `I just got a ${gene.name} (${gene.rarity.toUpperCase()}) on Spin the Gacha! #GachaNFT`;
        // Implement sharing functionality (e.g., Web Share API)
        if (navigator.share) {
            navigator.share({
                title: 'Gacha NFT',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert('Share text copied to clipboard!');
        }
    });

    // Filter controls
    document.getElementById('type-filter').addEventListener('change', updateInventory);
    document.getElementById('category-filter').addEventListener('change', updateInventory);
    document.getElementById('view-toggle').addEventListener('click', () => {
        const grid = document.getElementById('nft-grid');
        grid.classList.toggle('list-view');
    });
});

// Window resize handler
window.addEventListener('resize', () => {
    const container = document.getElementById('gacha-machine');
    gachaCamera.aspect = container.clientWidth / container.clientHeight;
    gachaCamera.updateProjectionMatrix();
    gachaRenderer.setSize(container.clientWidth, container.clientHeight);
}); 