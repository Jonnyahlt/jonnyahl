// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initCursorTrail();
    initNeuralNetwork();
    initParallax();
    initScrollReveal();
    initTypewriter();
    initEasterEgg();
    initFlyingObjects();
});

// ==================== CURSOR TRAIL ====================
function initCursorTrail() {
    const trails = document.querySelectorAll('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    const trailX = [0, 0, 0];
    const trailY = [0, 0, 0];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrails() {
        trails.forEach((trail, index) => {
            trailX[index] += (mouseX - trailX[index]) * (0.1 / (index + 1));
            trailY[index] += (mouseY - trailY[index]) * (0.1 / (index + 1));
            
            trail.style.left = trailX[index] + 'px';
            trail.style.top = trailY[index] + 'px';
            trail.style.opacity = 1 - (index * 0.3);
        });
        
        requestAnimationFrame(animateTrails);
    }

    animateTrails();
}

// ==================== NEURAL NETWORK CANVAS ====================
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let nodes = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createNodes();
    }
    
    function createNodes() {
        nodes = [];
        const nodeCount = Math.floor((canvas.width * canvas.height) / 30000);
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    function drawNodes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 217, 255, 0.6)';
            ctx.fill();
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        });
        
        requestAnimationFrame(drawNodes);
    }
    
    resize();
    window.addEventListener('resize', resize);
    drawNodes();
}

// ==================== PARALLAX SCROLLING ====================
function initParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < window.innerHeight) {
            const stars = document.querySelector('.stars-layer');
            const heroBg = document.querySelector('.hero-bg-image');
            const heroContent = document.querySelector('.hero-content');
            const scrollPrompt = document.querySelector('.scroll-prompt');
            
            if (stars) {
                stars.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            if (heroContent) {
                const fadeProgress = Math.min(scrolled / (window.innerHeight * 0.5), 1);
                heroContent.style.opacity = 1 - fadeProgress;
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            if (scrollPrompt) {
                scrollPrompt.style.opacity = 1 - (scrolled / (window.innerHeight * 0.3));
            }
        }
        
        // Pattern section background fade
        const patternSection = document.querySelector('.pattern-section');
        if (patternSection) {
            const rect = patternSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Fade in when section enters viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                patternSection.classList.add('active');
            } else {
                patternSection.classList.remove('active');
            }
        }
        
        // Parallax for section backgrounds
        document.querySelectorAll('.section-bg-image').forEach(bg => {
            const section = bg.closest('section');
            if (section) {
                const rect = section.getBoundingClientRect();
                const scrollProgress = -rect.top / (rect.height + window.innerHeight);
                bg.style.transform = `translateY(${scrollProgress * 100}px)`;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    updateParallax();
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
        observer.observe(el);
    });
}

// ==================== TYPEWRITER EFFECT ====================
function initTypewriter() {
    const codeElement = document.getElementById('typing-code');
    if (!codeElement) return;
    
    const codeSnippets = [
        'const solveProblem = (challenge) => { return solution; }',
        'npm install innovation creativity',
        'git commit -m "Breaking barriers with AI"',
        'for (idea in ideas) { makeItReal(idea); }',
        'while (learning) { skills++; }',
        'import { passion } from "creativity";',
        'async function dreamBig() { await achieve(); }'
    ];
    
    let currentSnippet = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function type() {
        const snippet = codeSnippets[currentSnippet];
        
        if (!isDeleting) {
            codeElement.textContent = snippet.substring(0, currentChar);
            currentChar++;
            
            if (currentChar > snippet.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        } else {
            codeElement.textContent = snippet.substring(0, currentChar);
            currentChar--;
            
            if (currentChar === 0) {
                isDeleting = false;
                currentSnippet = (currentSnippet + 1) % codeSnippets.length;
            }
        }
        
        const speed = isDeleting ? 30 : 80;
        setTimeout(type, speed);
    }
    
    // Start typing when code section is visible
    const codeSection = document.querySelector('.code-section');
    if (codeSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && currentChar === 0 && !isDeleting) {
                    setTimeout(type, 500);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(codeSection);
    }
}

// ==================== FLYING OBJECTS ====================
function initFlyingObjects() {
    // Random delays for flying objects
    const flyingObjects = document.querySelectorAll('.flying-object');
    flyingObjects.forEach((obj, index) => {
        obj.style.animationDelay = `${index * 5}s`;
    });
}

// ==================== EASTER EGG: HÖGTAFLA HAGE ====================
function initEasterEgg() {
    const trigger = document.getElementById('easter-egg-trigger');
    const modal = document.getElementById('easter-egg-modal');
    const closeBtn = document.getElementById('close-easter-egg');
    const playAllBtn = document.getElementById('play-all');
    const stopAllBtn = document.getElementById('stop-all');
    
    // Audio context for Web Audio API
    let audioContext = null;
    const oscillators = {};
    const activeHorses = new Set();
    
    // Initialize Audio Context
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }
    
    // Note frequencies
    const notes = {
        'C3': 130.81,
        'C4': 261.63,
        'E4': 329.63,
        'G4': 392.00,
        'B4': 493.88,
        'D5': 587.33,
        'F5': 698.46,
        'A5': 880.00
    };
    
    // Create oscillator for a horse
    function createOscillator(note) {
        const ctx = initAudio();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(notes[note], ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        return { oscillator, gainNode };
    }
    
    // Toggle horse
    function toggleHorse(horseName, note, button) {
        if (activeHorses.has(horseName)) {
            // Stop
            if (oscillators[horseName]) {
                const { oscillator, gainNode } = oscillators[horseName];
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
                setTimeout(() => {
                    oscillator.stop();
                    delete oscillators[horseName];
                }, 100);
            }
            activeHorses.delete(horseName);
            button.classList.remove('active');
            button.querySelector('.toggle-state').textContent = 'OFF';
        } else {
            // Start
            const { oscillator, gainNode } = createOscillator(note);
            oscillator.start();
            oscillators[horseName] = { oscillator, gainNode };
            activeHorses.add(horseName);
            button.classList.add('active');
            button.querySelector('.toggle-state').textContent = 'ON';
        }
    }
    
    // Open modal
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop all sounds
        activeHorses.forEach(horseName => {
            if (oscillators[horseName]) {
                const { oscillator, gainNode } = oscillators[horseName];
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
                setTimeout(() => {
                    oscillator.stop();
                }, 100);
            }
        });
        
        activeHorses.clear();
        Object.keys(oscillators).forEach(key => delete oscillators[key]);
        
        // Reset buttons
        document.querySelectorAll('.horse-toggle').forEach(btn => {
            btn.classList.remove('active');
            btn.querySelector('.toggle-state').textContent = 'OFF';
        });
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Horse toggles
    document.querySelectorAll('.horse-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const horseName = button.dataset.horse;
            const channel = button.closest('.horse-channel');
            const note = channel.dataset.note;
            toggleHorse(horseName, note, button);
        });
    });
    
    // Play all
    playAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.horse-toggle').forEach(button => {
            if (!button.classList.contains('active')) {
                button.click();
            }
        });
    });
    
    // Stop all
    stopAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.horse-toggle.active').forEach(button => {
            button.click();
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === ' ') {
            e.preventDefault();
            if (activeHorses.size > 0) {
                stopAllBtn.click();
            } else {
                playAllBtn.click();
            }
        }
    });
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});
