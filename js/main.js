// DOM Elements
const geneContainers = document.querySelectorAll('.gene-container');
const revealButton = document.getElementById('revealButton');
const tryAgainButton = document.getElementById('tryAgainButton');
const buyGenesButton = document.getElementById('buyGenesButton');
const resultSection = document.querySelector('.result-section');
const twinType = document.getElementById('twinType');
const twinDescription = document.getElementById('twinDescription');

// State
let selectedGenes = [];
let isRevealing = false;

// Initialize
function init() {
    // Add event listeners to gene selectors
    geneContainers.forEach(container => {
        const typeSelect = container.querySelector('.gene-type');
        const starsSelect = container.querySelector('.gene-stars');
        const vial = container.querySelector('.gene-vial');
        
        typeSelect.addEventListener('change', () => updateGeneSelection(container));
        starsSelect.addEventListener('change', () => updateGeneSelection(container));
    });
    
    // Add event listeners to buttons
    revealButton.addEventListener('click', startReveal);
    tryAgainButton.addEventListener('click', resetSelection);
    buyGenesButton.addEventListener('click', () => {
        window.location.href = 'https://aeaea.xyz/en/twin/#buy-in-now';
    });
    
    // Initialize probability display
    updateProbabilityDisplay([]);
}

// Update gene selection
function updateGeneSelection(container) {
    const typeSelect = container.querySelector('.gene-type');
    const starsSelect = container.querySelector('.gene-stars');
    const vial = container.querySelector('.gene-vial');
    const geneType = container.querySelector('label').textContent;
    
    if (typeSelect.value && starsSelect.value) {
        // Update gene data
        const geneIndex = Array.from(geneContainers).indexOf(container);
        const gene = {
            type: geneType,
            value: typeSelect.value,
            stars: parseInt(starsSelect.value)
        };
        
        // Update selected genes array
        selectedGenes[geneIndex] = gene;
        
        // Update vial appearance
        vial.dataset.stars = starsSelect.value;
        
        // Update probability display if all genes are selected
        if (selectedGenes.length === 5 && selectedGenes.every(g => g)) {
            updateProbabilityDisplay(selectedGenes);
            revealButton.disabled = false;
        }
    } else {
        // Remove gene data if either select is empty
        const geneIndex = Array.from(geneContainers).indexOf(container);
        selectedGenes[geneIndex] = null;
        delete vial.dataset.stars;
        revealButton.disabled = true;
    }
}

// Start reveal process
async function startReveal() {
    if (isRevealing || selectedGenes.length !== 5 || !selectedGenes.every(g => g)) return;
    isRevealing = true;
    
    try {
        // Disable controls
        revealButton.disabled = true;
        geneContainers.forEach(container => {
            container.querySelector('.gene-type').disabled = true;
            container.querySelector('.gene-stars').disabled = true;
        });
        
        // Start animation sequence
        const resultType = await startRevealAnimation(selectedGenes);
        
        // Show result
        showResult(resultType);
    } catch (error) {
        console.error('Reveal error:', error);
        alert('An error occurred during the reveal. Please try again.');
    } finally {
        isRevealing = false;
    }
}

// Show result
function showResult(twinType) {
    // Update result section
    resultSection.style.display = 'block';
    document.getElementById('twinType').textContent = `Your AI Twin: ${twinType}!`;
    document.getElementById('twinDescription').textContent = getAITwinDescription(twinType);
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset selection
function resetSelection() {
    // Clear selections
    geneContainers.forEach(container => {
        const typeSelect = container.querySelector('.gene-type');
        const starsSelect = container.querySelector('.gene-stars');
        const vial = container.querySelector('.gene-vial');
        
        typeSelect.value = '';
        starsSelect.value = '';
        typeSelect.disabled = false;
        starsSelect.disabled = false;
        delete vial.dataset.stars;
    });
    
    // Reset state
    selectedGenes = [];
    revealButton.disabled = true;
    
    // Hide result section
    resultSection.style.display = 'none';
    
    // Reset probability display
    updateProbabilityDisplay([]);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize on load
window.addEventListener('load', init); 