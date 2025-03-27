// Probability Configuration
const PROBABILITY_TIERS = {
    tier1: {
        min: 1.0,
        max: 1.4,
        probabilities: {
            Humanoid: 70,
            Cybernetic: 20,
            Draconic: 8,
            Celestial: 2
        }
    },
    tier2: {
        min: 1.5,
        max: 1.9,
        probabilities: {
            Humanoid: 60,
            Cybernetic: 25,
            Draconic: 10,
            Celestial: 5
        }
    },
    tier3: {
        min: 2.0,
        max: 2.4,
        probabilities: {
            Humanoid: 50,
            Cybernetic: 30,
            Draconic: 15,
            Celestial: 5
        }
    },
    tier4: {
        min: 2.5,
        max: 2.9,
        probabilities: {
            Humanoid: 40,
            Cybernetic: 30,
            Draconic: 20,
            Celestial: 10
        }
    },
    tier5: {
        min: 3.0,
        max: 3.4,
        probabilities: {
            Humanoid: 30,
            Cybernetic: 25,
            Draconic: 30,
            Celestial: 15
        }
    },
    tier6: {
        min: 3.5,
        max: 3.9,
        probabilities: {
            Humanoid: 20,
            Cybernetic: 20,
            Draconic: 35,
            Celestial: 25
        }
    },
    tier7: {
        min: 4.0,
        max: 4.0,
        probabilities: {
            Humanoid: 10,
            Cybernetic: 15,
            Draconic: 35,
            Celestial: 40
        }
    }
};

// Chart instance
let probabilityChart = null;

// Calculate average star rating
function calculateAverageStars(genes) {
    const totalStars = genes.reduce((sum, gene) => sum + gene.stars, 0);
    return totalStars / genes.length;
}

// Get probabilities based on average stars
function getProbabilities(averageStars) {
    for (const tier of Object.values(PROBABILITY_TIERS)) {
        if (averageStars >= tier.min && averageStars <= tier.max) {
            return tier.probabilities;
        }
    }
    return PROBABILITY_TIERS.tier1.probabilities; // Default to lowest tier
}

// Update probability display
function updateProbabilityDisplay(genes) {
    const averageStars = calculateAverageStars(genes);
    const probabilities = getProbabilities(averageStars);
    
    // Update chart
    updateProbabilityChart(probabilities);
    
    // Update text display
    const probabilityText = document.getElementById('probabilityText');
    probabilityText.textContent = `Chances: ${probabilities.Celestial}% Celestial, ${probabilities.Draconic}% Draconic, ${probabilities.Cybernetic}% Cybernetic, ${probabilities.Humanoid}% Humanoid`;
}

// Update the chart options to match Apple's style
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#1D1D1F',
                font: {
                    family: '-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif',
                    size: 14,
                    weight: '500'
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1D1D1F',
            titleFont: {
                family: '-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif',
                size: 14,
                weight: '600'
            },
            bodyColor: '#1D1D1F',
            bodyFont: {
                family: '-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif',
                size: 14
            },
            borderColor: '#E5E5EA',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
                label: function(context) {
                    return `${context.label}: ${context.raw}%`;
                }
            }
        }
    },
    elements: {
        arc: {
            borderWidth: 0
        }
    },
    cutout: '60%',
    animation: {
        animateScale: true,
        animateRotate: true
    }
};

// Update the probability chart with Apple-style colors
function updateProbabilityChart(probabilities) {
    const ctx = document.getElementById('probabilityChart').getContext('2d');
    
    const data = {
        labels: ['Celestial', 'Draconic', 'Cybernetic', 'Humanoid'],
        datasets: [{
            data: [
                probabilities.Celestial,
                probabilities.Draconic,
                probabilities.Cybernetic,
                probabilities.Humanoid
            ],
            backgroundColor: [
                '#007AFF', // Apple Blue
                '#5856D6', // Apple Purple
                '#FF2D55', // Apple Pink
                '#FF9500'  // Apple Orange
            ],
            hoverBackgroundColor: [
                '#005BB5', // Darker Blue
                '#4139AC', // Darker Purple
                '#D70040', // Darker Pink
                '#CC7600'  // Darker Orange
            ]
        }]
    };
    
    if (probabilityChart) {
        probabilityChart.destroy();
    }
    
    probabilityChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: chartOptions
    });
}

// Determine AI Twin type based on probabilities
function determineAITwinType(genes) {
    const averageStars = calculateAverageStars(genes);
    const probabilities = getProbabilities(averageStars);
    
    // Generate random number between 1 and 100
    const roll = Math.floor(Math.random() * 100) + 1;
    
    // Determine type based on probability ranges
    let currentRange = 0;
    
    if (roll <= (currentRange += probabilities.Celestial)) return 'Celestial';
    if (roll <= (currentRange += probabilities.Draconic)) return 'Draconic';
    if (roll <= (currentRange += probabilities.Cybernetic)) return 'Cybernetic';
    return 'Humanoid';
}

// Get description for AI Twin type
function getAITwinDescription(type) {
    const descriptions = {
        Celestial: 'A divine being of pure cosmic energy, radiating with ethereal power.',
        Draconic: 'A majestic dragon-hybrid, commanding both strength and ancient magic.',
        Cybernetic: 'A high-tech marvel, seamlessly blending organic and mechanical parts.',
        Humanoid: 'A skilled warrior, enhanced with advanced combat capabilities.'
    };
    
    return descriptions[type] || 'A mysterious being of unknown origin.';
} 