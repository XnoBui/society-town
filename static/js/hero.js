// Hero Section JavaScript

// Initialize Particles.js
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#00FFDD'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                animation: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00FFDD',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !hamburger.contains(e.target)) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Animate tubes glow
const tubesGlow = document.querySelector('.tubes-glow');
if (tubesGlow) {
    setInterval(() => {
        tubesGlow.style.opacity = '0.6';
        setTimeout(() => {
            tubesGlow.style.opacity = '0.3';
        }, 1500);
    }, 3000);
}

// Sound Control
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const soundControl = document.getElementById('soundControl');
    const soundIcon = soundControl.querySelector('.sound-icon');
    const soundLabel = soundControl.querySelector('.sound-label');

    // Function to update sound control state
    function updateSoundControl(isMuted) {
        video.muted = isMuted;
        
        if (isMuted) {
            soundIcon.classList.remove('sound-on');
            soundLabel.textContent = 'Unmute';
        } else {
            soundIcon.classList.add('sound-on');
            soundLabel.textContent = 'Mute';
        }
    }

    // Initialize sound control state
    updateSoundControl(true);

    // Handle click events
    soundControl.addEventListener('click', function() {
        // Toggle mute state
        const newMutedState = !video.muted;
        
        if (!newMutedState) {
            // Try to play with sound
            try {
                video.muted = false;
                video.play().then(() => {
                    updateSoundControl(false);
                }).catch((error) => {
                    console.error('Error playing video:', error);
                    video.muted = true;
                    updateSoundControl(true);
                });
            } catch (error) {
                console.error('Error toggling sound:', error);
                video.muted = true;
                updateSoundControl(true);
            }
        } else {
            // Mute the video
            video.muted = true;
            updateSoundControl(true);
        }
    });

    // Ensure video starts muted
    video.addEventListener('loadedmetadata', function() {
        video.muted = true;
        updateSoundControl(true);
    });

    // Handle video play events
    video.addEventListener('play', function() {
        if (!video.muted) {
            soundIcon.classList.add('sound-on');
            soundLabel.textContent = 'Mute';
        }
    });

    // Handle video pause events
    video.addEventListener('pause', function() {
        if (!video.muted) {
            video.play().catch(error => console.error('Error resuming video:', error));
        }
    });
}); 