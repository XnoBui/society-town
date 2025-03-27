// DOM Elements
const characterTypeSelect = document.getElementById('characterType');
const scaleInput = document.getElementById('scale');
const scaleValueDisplay = document.getElementById('scaleValue');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const iconPreview = document.getElementById('iconPreview');
const iconSizeDisplay = document.getElementById('iconSize');
const iconTypeDisplay = document.getElementById('iconType');
const showGridCheckbox = document.getElementById('showGrid');
const showBackgroundCheckbox = document.getElementById('showBackground');

// API Configuration
const API_BASE_URL = 'http://localhost:8000';  // Updated port

// WebSocket Configuration
const WS_URL = 'ws://localhost:8000/ws';
let ws = null;
let updateTimeout = null;

// Connect WebSocket
function connectWebSocket() {
    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
        generateIcon(); // Generate initial icon
    };
    
    ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Try to reconnect after 2 seconds
        setTimeout(connectWebSocket, 2000);
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'success') {
            updatePreview(data);
        } else {
            console.error('Error:', data.message);
            showError();
        }
    };
}

// Update preview with received data
function updatePreview(data) {
    iconPreview.src = data.image;
    iconSizeDisplay.textContent = `Size: ${data.size.width}x${data.size.height}px`;
    iconTypeDisplay.textContent = `Type: ${characterTypeSelect.value}`;
    downloadBtn.disabled = false;
    updatePreviewStyle();
}

// Show error state
function showError() {
    iconPreview.src = '';
    iconSizeDisplay.textContent = 'Size: Error';
    iconTypeDisplay.textContent = 'Type: Error';
    downloadBtn.disabled = true;
}

// Event Listeners
characterTypeSelect.addEventListener('change', generateIcon);
scaleInput.addEventListener('input', () => {
    scaleValueDisplay.textContent = `${scaleInput.value}x`;
    // Debounce updates to avoid overwhelming the server
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(generateIcon, 100);
});
showGridCheckbox.addEventListener('change', updatePreviewStyle);
showBackgroundCheckbox.addEventListener('change', updatePreviewStyle);
generateBtn.addEventListener('click', generateIcon);
downloadBtn.addEventListener('click', downloadIcon);

// Update preview style based on options
function updatePreviewStyle() {
    const previewBackground = iconPreview.parentElement;
    
    // Update background color
    previewBackground.style.backgroundColor = showBackgroundCheckbox.checked ? '#2c3e50' : 'transparent';
    
    // Update grid
    if (showGridCheckbox.checked) {
        const gridSize = Math.max(5, Math.min(20, scaleInput.value * 2)); // Adjust grid size based on scale
        previewBackground.style.backgroundImage = `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `;
        previewBackground.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    } else {
        previewBackground.style.backgroundImage = 'none';
    }
}

// Generate icon using WebSocket
function generateIcon() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.log('WebSocket not connected, reconnecting...');
        connectWebSocket();
        return;
    }

    try {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        downloadBtn.disabled = true;

        // Clear previous preview
        iconPreview.src = '';
        iconSizeDisplay.textContent = 'Size: Loading...';
        iconTypeDisplay.textContent = 'Type: Loading...';

        // Send request through WebSocket
        ws.send(JSON.stringify({
            type: characterTypeSelect.value,
            scale: parseInt(scaleInput.value)
        }));

    } catch (error) {
        console.error('Error generating icon:', error);
        showError();
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Icon';
    }
}

// Download icon
async function downloadIcon() {
    try {
        const response = await fetch(`${API_BASE_URL}/icon/${characterTypeSelect.value}?scale=${scaleInput.value}`);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${characterTypeSelect.value.toLowerCase()}_icon.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading icon:', error);
        alert('Error downloading icon. Please try again.');
    }
}

// Initialize
connectWebSocket(); 