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

// Manual fan art from specific Reddit posts
const MANUAL_FAN_ART_POSTS = [
    {
        permalink: 'https://www.reddit.com/r/RedRangerYT/comments/15pnr69/wip_red_ranger_fanart_titled_peters_comfort',
        postId: '15pnr69',
        title: "WIP Red Ranger Fanart - Titled 'Peter's Comfort'"
    },
    {
        permalink: 'https://www.reddit.com/r/RedRangerYT/comments/15pkr00/peters_undying_love',
        postId: '15pkr00',
        title: "Peter's Undying Love"
    },
    {
        permalink: 'https://www.reddit.com/r/RedRangerYT/comments/15qj6wc/made_this_redranger_pride_flag',
        postId: '15qj6wc',
        title: 'Made this RedRanger Pride Flag'
    },
    {
        permalink: 'https://www.reddit.com/r/RedRangerYT/comments/15rtt8c/a_day_in_the_sun_goblinxoppenheimer_i_hope',
        postId: '15rtt8c',
        title: 'A Day in the Sun - Goblin x Oppenheimer'
    }
];

// Fallback: Direct image URLs (manually add if API fails)
// To get image URLs: Right-click on the image in Reddit > "Copy image address"
// Or use the format: https://i.redd.it/[image-id].jpg
const FALLBACK_IMAGES = [
    // Uncomment and add image URLs here if API fails:
    // {
    //     url: 'https://i.redd.it/example1.jpg',
    //     title: "WIP Red Ranger Fanart - Titled 'Peter's Comfort'",
    //     permalink: 'https://www.reddit.com/r/RedRangerYT/comments/15pnr69/wip_red_ranger_fanart_titled_peters_comfort'
    // },
    // Add more images here...
];

// Carousel state
let currentSlide = 0;
let fanArtImages = [];
let carouselInterval = null;

// Fetch fan art from specific Reddit posts
async function fetchFanArt() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;

    // Set a timeout to show loading message
    const timeout = setTimeout(() => {
        if (fanArtImages.length === 0) {
            carouselTrack.innerHTML = `
                <div class="carousel-loading">
                    <p>Loading fan art from Reddit...</p>
                </div>
            `;
        }
    }, 500);

    try {
        // Use CORS proxy with timeout
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        
        // Fetch each post's data to get the actual image URL
        const imagePromises = MANUAL_FAN_ART_POSTS.map(async (post) => {
            try {
                const url = `${corsProxy}${encodeURIComponent(`https://www.reddit.com/r/${REDDIT_SUBREDDIT}/comments/${post.postId}.json`)}`;
                
                // Add timeout to each fetch
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const postData = data[0].data.children[0].data;
                
                let imageUrl = null;
                let title = postData.title || post.title;
                
                // Try to get the image URL from the post data
                if (postData.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(postData.url)) {
                    imageUrl = postData.url;
                } else if (postData.preview && postData.preview.images && postData.preview.images[0]) {
                    imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
                } else if (postData.media && postData.media.oembed && postData.media.oembed.thumbnail_url) {
                    imageUrl = postData.media.oembed.thumbnail_url;
                } else if (postData.thumbnail && postData.thumbnail !== 'self' && postData.thumbnail !== 'default' && postData.thumbnail.startsWith('http')) {
                    imageUrl = postData.thumbnail;
                }
                
                if (!imageUrl) {
                    console.warn(`No image found for post ${post.postId}`);
                    return null;
                }
                
                return {
                    url: imageUrl,
                    title: title,
                    permalink: post.permalink
                };
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error(`Timeout fetching post ${post.postId}`);
                } else {
                    console.error(`Error fetching post ${post.postId}:`, error);
                }
                return null;
            }
        });
        
        const images = await Promise.all(imagePromises);
        clearTimeout(timeout);
        fanArtImages = images.filter(img => img && img.url && img.url.startsWith('http'));
        
        if (fanArtImages.length > 0) {
            displayCarousel();
        } else {
            // If all failed, try direct fetch
            console.log('All proxy fetches failed, trying direct...');
            await fetchFanArtDirect();
            
            // If direct fetch also failed, use fallback images
            if (fanArtImages.length === 0 && FALLBACK_IMAGES.length > 0) {
                console.log('Using fallback images...');
                fanArtImages = FALLBACK_IMAGES;
                displayCarousel();
            } else if (fanArtImages.length > 0) {
                displayCarousel();
            } else {
                carouselTrack.innerHTML = `
                    <div class="carousel-loading">
                        <p>Unable to load fan art automatically.</p>
                        <p style="margin-top: 0.5rem; font-size: 0.9rem;">This may be due to CORS restrictions.</p>
                        <p style="margin-top: 0.5rem; font-size: 0.85rem;">Check the browser console (F12) for details.</p>
                        <p style="margin-top: 1rem;">
                            <a href="${REDDIT_URL}" target="_blank" class="btn btn-primary">Visit Reddit</a>
                        </p>
                    </div>
                `;
            }
        }
    } catch (error) {
        clearTimeout(timeout);
        console.error('Error fetching fan art:', error);
        // Try direct fetch as fallback
        await fetchFanArtDirect();
        
        if (fanArtImages.length > 0) {
            displayCarousel();
        } else {
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
}

// Try fetching directly from Reddit (may fail due to CORS)
async function fetchFanArtDirect() {
    try {
        const imagePromises = MANUAL_FAN_ART_POSTS.map(async (post) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(`https://www.reddit.com/r/${REDDIT_SUBREDDIT}/comments/${post.postId}.json`, {
                    mode: 'cors',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const postData = data[0].data.children[0].data;
                
                let imageUrl = null;
                
                // Try to get the image URL from the post data
                if (postData.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(postData.url)) {
                    imageUrl = postData.url;
                } else if (postData.preview && postData.preview.images && postData.preview.images[0]) {
                    imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
                } else if (postData.media && postData.media.oembed && postData.media.oembed.thumbnail_url) {
                    imageUrl = postData.media.oembed.thumbnail_url;
                } else if (postData.thumbnail && postData.thumbnail !== 'self' && postData.thumbnail !== 'default' && postData.thumbnail.startsWith('http')) {
                    imageUrl = postData.thumbnail;
                }
                
                if (!imageUrl) {
                    return null;
                }
                
                return {
                    url: imageUrl,
                    title: post.title || postData.title,
                    permalink: post.permalink
                };
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error(`Error fetching post ${post.postId} directly:`, error);
                }
                return null;
            }
        });
        
        const images = await Promise.all(imagePromises);
        fanArtImages = images.filter(img => img && img.url && img.url.startsWith('http'));
    } catch (error) {
        console.error('Error in direct fetch:', error);
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
    
    if (!carouselTrack || fanArtImages.length === 0) return;
    
    // Clear existing content
    carouselTrack.innerHTML = '';
    carouselDots.innerHTML = '';
    
    // Create slides
    fanArtImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `
            <a href="${image.permalink}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%;">
                <img src="${image.url}" 
                     alt="${image.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'%3E%3Crect fill=\'%231a1a1a\' width=\'800\' height=\'600\'/%3E%3Ctext fill=\'%23b3b3b3\' font-family=\'sans-serif\' font-size=\'20\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EImage not available%3C/text%3E%3C/svg%3E';">
            </a>
        `;
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
    // Fetch fan art
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

