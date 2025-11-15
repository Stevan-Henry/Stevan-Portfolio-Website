// Particle Animation
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 100;
    this.mouse = { x: null, y: null, radius: 150 };

    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawParticle(particle) {
    this.ctx.fillStyle = `rgba(127, 90, 240, ${particle.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  connectParticles(p1, p2, distance) {
    const opacity = 1 - (distance / 150);
    this.ctx.strokeStyle = `rgba(127, 90, 240, ${opacity * 0.3})`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  update() {
    this.particles.forEach((particle, i) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

      // Mouse interaction
      if (this.mouse.x != null && this.mouse.y != null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;

          particle.x -= directionX * force * 2;
          particle.y -= directionY * force * 2;
        }
      }

      // Connect particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = particle.x - this.particles[j].x;
        const dy = particle.y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.connectParticles(particle, this.particles[j], distance);
        }
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      this.drawParticle(particle);
    });

    this.update();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles');
  if (canvas) {
    new ParticleSystem(canvas);
  }
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = [
  'Software Engineer',
  'Web Developer',
  'Problem Solver',
  'Full-Stack Developer',
  'Creative Thinker'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 60;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 30;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 60;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typingSpeed = 1000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 300;
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
if (typingText) {
  setTimeout(typeEffect, 500);
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate skill progress bars
      if (entry.target.classList.contains('skill-card')) {
        const progressBar = entry.target.querySelector('.skill-progress');
        if (progressBar) {
          const progress = progressBar.getAttribute('data-progress');
          setTimeout(() => {
            progressBar.style.width = progress + '%';
          }, 150);
        }
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-in and reveal elements
document.querySelectorAll('.fade-in, .reveal').forEach(el => {
  observer.observe(el);
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Add stagger delay to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.05}s`;
});

// Add stagger delay to skill cards
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.05}s`;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');

  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    heroContent.style.opacity = 1 - (scrolled / 600);
  }
});

// Dynamic cursor effect (optional enhancement)
const cursor = {
  x: 0,
  y: 0
};

document.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .contact-card');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});

// Prevent animations on page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Add subtle rotation to project cards on mouse move
projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Animate numbers on scroll (for potential stats section)
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Performance optimization: Reduce animations on mobile
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (reducedMotion.matches) {
  document.querySelectorAll('*').forEach(el => {
    el.style.animation = 'none';
    el.style.transition = 'none';
  });
}

// Add active state to nav links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNavLink);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);

  if (konamiCode.join('').includes(konamiSequence.join(''))) {
    document.body.style.animation = 'rainbow 2s linear infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});

// Initialize everything
console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #7f5af0; font-size: 20px; font-weight: bold;');
console.log('%cDesigned & Built by Stevan Henry', 'color: #ff7eb3; font-size: 14px;');
