/*
   ==========================================================================
   FUTURE-AI PORTFOLIO CONTROLLER
   Author: Antigravity
   Interactivity: Canvas Particles, Typing Engine, Scroll Reveal, Contact
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Mobile Navigation Toggle
    // -------------------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Animate toggle bars
            const bars = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const bars = navToggle.querySelectorAll('span');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // -------------------------------------------------------------
    // 2. Header Scroll Effect & Active Nav Link Highlight
    // -------------------------------------------------------------
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky header glow
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 3. Typing Animation Effect
    // -------------------------------------------------------------
    const typingSpan = document.querySelector('.typing-text');
    if (typingSpan) {
        const phrases = [
            "AI & Data Science Student",
            "Future Software Engineer",
            "Tech Innovator"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typingSpan.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50; // Faster when deleting
            } else {
                typingSpan.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 100; // Normal speed when typing
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                // Pause at complete word
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }

        // Initialize typing
        setTimeout(type, 1000);
    }

    // -------------------------------------------------------------
    // 4. Scroll Reveal Animations (Intersection Observer)
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-bar-inner');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(elem => revealObserver.observe(elem));

    // Skill Bar Progress Animation
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                skillObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // -------------------------------------------------------------
    // 5. Interactive Particle Network Background (Canvas)
    // -------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Handle canvas sizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle class definition
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                // Cyberpunk teal/purple primary colors
                this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.4)' : 'rgba(185, 39, 252, 0.4)';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Move particle
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (repel effect)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let angle = Math.atan2(dy, dx);
                        this.x += Math.cos(angle) * force * 1.2;
                        this.y += Math.sin(angle) * force * 1.2;
                    }
                }
            }
        }

        // Initialize particles density based on window size
        function initParticles() {
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 10000;
            numberOfParticles = Math.min(numberOfParticles, 120); // Cap particles for performance
            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            // Draw line connections (web system)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 110) {
                        ctx.beginPath();
                        // Fade lines based on distance
                        let opacity = (1 - distance / 110) * 0.12;
                        ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
    }

    // -------------------------------------------------------------
    // 6. Interactive Contact Form Submission & Toast Simulation
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input data
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please fill in all fields.';
                return;
            }

            // Change button text to simulated sending
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> TRANSMITTING...';

            formStatus.className = 'form-status';
            formStatus.innerHTML = '';

            // Simulate server network latency
            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Connection established! Message encrypted and transmitted successfully.';
                
                // Clear input states
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = originalBtnHtml;

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            }, 1800);
        });
    }
});
