// Custom Cursor Logic
document.addEventListener("DOMContentLoaded", () => {
    const cursorWrapper = document.getElementById('cursor-wrapper');
    const cursorVisual = document.getElementById('cursor-visual');
    const cursorTrail = document.getElementById('cursor-trail');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Main cursor updates instantly
        if (cursorWrapper) {
            cursorWrapper.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
    });

    // Trail animation
    function animateCursor() {
        trailX += (mouseX - trailX) * 0.2;
        trailY += (mouseY - trailY) * 0.2;
        
        if (cursorTrail) {
            cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Interactive states
    const addCursorInteractions = () => {
        const interactables = document.querySelectorAll('a, button, input, textarea, .magnetic, .hero-social-btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursorVisual) cursorVisual.classList.add('hovering');
                if (cursorTrail) cursorTrail.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                if (cursorVisual) cursorVisual.classList.remove('hovering');
                if (cursorTrail) cursorTrail.classList.remove('hovering');
            });
        });
    };
    
    // Call once and also after any dynamic content loads if necessary
    addCursorInteractions();
    
    // Use MutationObserver if data.json populates elements later
    const observer = new MutationObserver(addCursorInteractions);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousedown', () => {
        if (cursorVisual) cursorVisual.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
        if (cursorVisual) cursorVisual.classList.remove('clicking');
    });
});

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(0, 28, 50, 0.95)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
    }
    else {
        navbar.style.background = "rgba(27, 53, 97, 0.3)";
        navbar.style.boxShadow = "none";
    }
});

const canvas = document.getElementById('cyber-grid');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Premium Ambient Glow Effect
    const particles = [];
    const particleCount = 15; // Few, large ambient orbs

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 150 + 80, // Large soft orbs (80px to 230px)
            vx: (Math.random() - 0.5) * 0.15, // Ultra slow movement
            vy: (Math.random() - 0.5) * 0.15,
            color: Math.random() > 0.4 ? '217, 179, 130' : '27, 109, 127', // Golden Dune or Tidal Blue
            baseOpacity: Math.random() * 0.04 + 0.02 // Very faint base opacity
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Smooth infinite wrap around edges
            if (p.x < -p.radius * 2) p.x = width + p.radius * 2;
            if (p.x > width + p.radius * 2) p.x = -p.radius * 2;
            if (p.y < -p.radius * 2) p.y = height + p.radius * 2;
            if (p.y > height + p.radius * 2) p.y = -p.radius * 2;

            // Mouse interaction
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let currentOpacity = p.baseOpacity;

            if (dist < 400) {
                const intensity = 1 - (dist / 400);
                // Glow brighter when cursor is nearby
                currentOpacity += intensity * 0.08;
                
                // Very gentle parralax repel
                p.x += (dx / dist) * intensity * 0.2;
                p.y += (dy / dist) * intensity * 0.2;
            }

            // Draw beautiful soft radial gradient
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `rgba(${p.color}, ${currentOpacity})`);
            gradient.addColorStop(1, `rgba(${p.color}, 0)`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
}

document
    .getElementById("contactForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const inputs = e.target.querySelectorAll('input, textarea');
        const data = {
            name: inputs[0].value,
            email: inputs[1].value,
            message: inputs[2].value
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert("Message Sent Successfully!");
                e.target.reset();
            }
        } catch (err) {
            console.error(err);
            alert("Error sending message.");
        }
    });

// Intersection Observer for Scroll Reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.reveal');
hiddenElements.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = `translate(0px, 0px)`;
    });
});

// 3D Tilt Effect
const tiltElements = document.querySelectorAll('.tilt, .card, .project-card');
tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// Dynamic Content Management
async function loadPortfolioData() {
    try {
        // Try to fetch from API, fallback to direct JSON file if running statically
        const res = await fetch('/api/data').catch(() => fetch('data.json'));
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        console.log("Portfolio Data Loaded:", data);
        
        // Example of dynamic content injection (Top Tier Content Management)
        // If elements had IDs like id="hero-title", we would do:
        // document.getElementById('hero-title').innerText = data.hero.title;
        // This sets up the architecture for easy future updates via the JSON file!
        
    } catch (err) {
        console.error("Failed to load portfolio data:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadPortfolioData);