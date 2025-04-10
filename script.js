// Boot Sequence Animation
document.addEventListener('DOMContentLoaded', () => {
    const bootSequence = document.getElementById('boot-sequence');
    const bootLog = document.querySelector('.boot-log');
    const bootLogContainer = document.querySelector('.boot-log-container');
    const logEntries = document.querySelectorAll('.log-entry');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.boot-progress-text');
    const statusText = document.querySelector('.system-info span:last-child');
    let currentEntry = 0;
    let progress = 0;

    // Function to update progress bar and text
    const updateProgress = (value) => {
        progress = value;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `[${Math.round(progress)}%] System initialization in progress...`;

        // Update status text based on progress
        if (progress < 25) {
            statusText.textContent = 'STATUS: Initializing core systems...';
        } else if (progress < 50) {
            statusText.textContent = 'STATUS: Loading security modules...';
        } else if (progress < 75) {
            statusText.textContent = 'STATUS: Configuring defenses...';
        } else if (progress < 90) {
            statusText.textContent = 'STATUS: Finalizing setup...';
        } else {
            statusText.textContent = 'STATUS: System Ready';
        }
    };

    // Function to show log entries one by one with progress
    const showNextLog = () => {
        if (currentEntry < logEntries.length) {
            // Calculate progress based on current entry
            const progressIncrement = 100 / logEntries.length;
            const targetProgress = (currentEntry + 1) * progressIncrement;
            
            // Show current log entry
            const entry = logEntries[currentEntry];
            entry.classList.add('visible');
            
            // Calculate scroll position
            const totalHeight = entry.offsetTop + entry.offsetHeight;
            const containerHeight = bootLogContainer.offsetHeight;
            
            // Only scroll if we're past the visible area
            if (totalHeight > containerHeight) {
                const scrollAmount = totalHeight - containerHeight;
                bootLog.style.transform = `translateY(-${scrollAmount}px)`;
            }
            
            // Smoothly update progress
            const startProgress = progress;
            const duration = 500;
            const startTime = performance.now();
            
            const animateProgress = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progressPercentage = Math.min(elapsed / duration, 1);
                const currentProgress = startProgress + (targetProgress - startProgress) * progressPercentage;
                
                updateProgress(currentProgress);
                
                if (progressPercentage < 1) {
                    requestAnimationFrame(animateProgress);
                }
            };
            
            requestAnimationFrame(animateProgress);
            
            // Move to next entry
            currentEntry++;
            
            // Random delay between 100ms and 400ms for more terminal-like feel
            const delay = Math.random() * 300 + 100;
            setTimeout(showNextLog, delay);
        } else {
            // After all logs are shown, wait 1 second and hide boot sequence
            setTimeout(() => {
                bootSequence.classList.add('hidden');
                document.body.classList.remove('loading');
                initializeMainContent();
            }, 1000);
        }
    };

    // Start the boot sequence after a short delay
    setTimeout(showNextLog, 1000);
});

// Initialize main content with animations
function initializeMainContent() {
    // Fade in navbar
    const navbar = document.querySelector('.navbar');
    navbar.style.opacity = '0';
    navbar.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        navbar.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        navbar.style.opacity = '1';
        navbar.style.transform = 'translateY(0)';
    }, 100);

    // Fade in side links
    const sideLinks = document.querySelector('.side-links');
    sideLinks.style.opacity = '0';
    setTimeout(() => {
        sideLinks.style.transition = 'opacity 0.5s ease-out';
        sideLinks.style.opacity = '1';
    }, 300);

    // Initialize sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (section.id === 'about') {
            section.style.opacity = '1';
            section.style.transform = 'none';
        } else {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            setTimeout(() => {
                section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 500 + index * 200);
        }
    });

    // Initialize other features
    initializeSkillBars();
    initializeActiveSection();
    initializeFadeIn();
    initializeNavbarEffect();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Initialize skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.dataset.level;
                entry.target.querySelector('.skill-level').style.width = `${level}%`;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Active section highlighting
function initializeActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setActiveSection = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
                section.classList.add('active');
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            } else {
                section.classList.remove('active');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveSection);
    setActiveSection(); // Call once on load
}

// Fade-in animation for sections
function initializeFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        fadeObserver.observe(element);
    });
}

// Navbar scroll effect
function initializeNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Add glitch effect to the name
document.addEventListener('DOMContentLoaded', () => {
    const glitchText = document.querySelector('.glitch-text');
    if (!glitchText) return;

    const addGlitch = () => {
        glitchText.classList.add('glitch');
        setTimeout(() => {
            glitchText.classList.remove('glitch');
        }, 200);
    };

    // Random glitch effect
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance of glitch
            addGlitch();
        }
    }, 2000);
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// Background Particles
function initParticles() {
    const container = document.querySelector('.particles-background');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2 and 4 pixels
        const size = Math.random() * 2 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animation
        particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
        container.appendChild(particle);
    }
}

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.querySelector('.matrix-rain');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = '01';
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00e5ff';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
}

// Scroll Animations
function initScrollAnimations() {
    // Exclude section titles and ensure they're visible
    document.querySelectorAll('.section-title').forEach(title => {
        title.style.opacity = '1';
        title.style.transform = 'none';
        title.style.visibility = 'visible';
    });

    // Exclude profile, about sections, and section titles from fade animations
    const sections = document.querySelectorAll('.skill-category, .certificate-card, .project-card');
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Keep the animation visible even after scrolling away
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    sections.forEach(section => {
        // Reset any existing visible classes
        section.classList.remove('visible');
        // Start observing
        observer.observe(section);
    });

    // Ensure profile, about sections, and titles are always visible
    document.querySelectorAll('.profile-section, .about-section, .section-title').forEach(section => {
        section.classList.add('visible');
    });
}

// Initialize everything after boot sequence
document.addEventListener('DOMContentLoaded', () => {
    // Existing boot sequence code...
    
    // Initialize new effects
    initParticles();
    initMatrixRain();
    initScrollAnimations();
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initScrollAnimations();
        }, 250);
    });

    // After boot sequence completes
    setTimeout(() => {
        // Ensure all section titles are immediately visible
        document.querySelectorAll('.section-title').forEach(title => {
            title.style.opacity = '1';
            title.style.transform = 'none';
            title.style.visibility = 'visible';
        });

        // Ensure profile and about sections are immediately visible
        document.querySelectorAll('.profile-section, .about-section').forEach(section => {
            section.classList.add('visible');
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
        
        // Initialize animations
        initParticles();
        initMatrixRain();
        initScrollAnimations();
    }, 100);
});

// Add keyframe animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
        }
        50% {
            transform: translateY(-100px) translateX(50px);
        }
        100% {
            transform: translateY(0) translateX(0);
        }
    }
`;
document.head.appendChild(style); 