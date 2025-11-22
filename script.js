// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .video-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Fan Art Carousel Configuration
const REDDIT_SUBREDDIT = 'RedRangerYT';
const REDDIT_URL = `https://www.reddit.com/r/${REDDIT_SUBREDDIT}`;

// Local fan art images from the images folder
const LOCAL_FAN_ART = [
    {
        url: 'images/peter.jpg',
        title: 'Peter Fan Art',
        permalink: REDDIT_URL
    },
    {
        url: 'images/perter2.jpg',
        title: 'Peter Fan Art 2',
        permalink: REDDIT_URL
    },
    {
        url: 'images/goblin.png',
        title: 'Goblin Fan Art',
        permalink: REDDIT_URL
    },
    {
        url: 'images/mascot.webp',
        title: 'Mascot Fan Art',
        permalink: REDDIT_URL
    },
    {
        url: 'images/yes.jpg',
        title: 'Fan Art',
        permalink: REDDIT_URL
    }
];

// Carousel state
let currentSlide = 0;
let fanArtImages = [];
let carouselInterval = null;

// Load fan art from local images folder
function fetchFanArt() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) {
        console.error('Carousel track not found!');
        return;
    }

    // Use local images directly
    fanArtImages = LOCAL_FAN_ART;
    console.log('Loading images:', fanArtImages);
    
    if (fanArtImages.length > 0) {
        displayCarousel();
    } else {
        console.error('No fan art images found!');
        carouselTrack.innerHTML = `
            <div class="carousel-loading">
                <p>No fan art images found.</p>
                <p style="margin-top: 1rem;">
                    <a href="${REDDIT_URL}" target="_blank" class="btn btn-primary">Visit Reddit</a>
                </p>
            </div>
        `;
    }
} catch (error) {
        console.error('Error fetching fan art:', error);
        carouselTrack.innerHTML = `
            <div class="carousel-loading">
                <p>Unable to load fan art from Reddit.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Error: ${error.message}</p>
                <p style="margin-top: 1rem;">
                    <a href="${REDDIT_URL}" target="_blank" style="color: var(--neon-green);">Visit Reddit</a>
                </p>
            </div>
        `;
    }
}

// Display carousel with images
function displayCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDots = document.getElementById('carousel-dots');
    
    if (!carouselTrack) {
        console.error('Carousel track not found in displayCarousel!');
        return;
    }
    
    if (fanArtImages.length === 0) {
        console.error('No images to display!');
        return;
    }
    
    console.log('Displaying carousel with', fanArtImages.length, 'images');
    
    // Clear existing content
    carouselTrack.innerHTML = '';
    carouselDots.innerHTML = '';
    
    // Create slides
    fanArtImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        
        img.onerror = function() {
            console.error('Failed to load image:', image.url);
            this.style.display = 'none';
        };
        
        img.onload = function() {
            console.log('Image loaded successfully:', image.url);
        };
        
        const link = document.createElement('a');
        link.href = image.permalink;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'block';
        link.style.width = '100%';
        link.style.height = '100%';
        link.appendChild(img);
        slide.appendChild(link);
        carouselTrack.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
    
    // Initialize carousel
    updateCarousel();
    startAutoPlay();
}

// Update carousel position
function updateCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    
    const translateX = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
}

// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % fanArtImages.length;
    updateCarousel();
    resetAutoPlay();
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + fanArtImages.length) % fanArtImages.length;
    updateCarousel();
    resetAutoPlay();
}

// Auto-play carousel
function startAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function resetAutoPlay() {
    startAutoPlay();
}

// Stop auto-play on hover
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            if (carouselInterval) clearInterval(carouselInterval);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
});

// Initialize carousel buttons
document.addEventListener('DOMContentLoaded', () => {
    // Fetch fan art immediately
    console.log('DOM loaded, fetching fan art...');
    fetchFanArt();
    
    // Setup carousel navigation buttons
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const fanartSection = document.getElementById('fanart');
        if (fanartSection && isElementInViewport(fanartSection)) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });
    
    // Observe feature cards for animations
    const animateElements = document.querySelectorAll('.feature-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add active class to nav links on click
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Lightbox functionality for fan art
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const fanartItems = document.querySelectorAll('.fanart-item');
    
    if (!lightbox || !lightboxImage) {
        console.error('Lightbox elements not found!');
        return;
    }
    
    if (fanartItems.length === 0) {
        console.error('No fan art items found!');
        return;
    }
    
    console.log('Lightbox initialized with', fanartItems.length, 'items');
    
    // Close lightbox function
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Open lightbox when clicking on fan art
    fanartItems.forEach((item) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const imageSrc = this.getAttribute('data-image');
            const imageTitle = this.getAttribute('data-title');
            
            console.log('Click detected! Opening:', imageSrc);
            
            if (imageSrc) {
                lightboxImage.src = imageSrc;
                lightboxImage.alt = imageTitle || 'Fan Art';
                if (lightboxTitle) {
                    lightboxTitle.textContent = imageTitle || '';
                }
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close on button click
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Initialize lightbox when DOM is ready
window.addEventListener('load', function() {
    setTimeout(initLightbox, 100);
});

