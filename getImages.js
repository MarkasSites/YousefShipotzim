// Gallery lightbox and interaction system
// Images are now auto-discovered and rendered by C# generator

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const imageGallery = document.getElementById('imageGallery');
    const loading = document.getElementById('loading');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Exit early if gallery elements don't exist
    if (!imageGallery) {
        console.log('Gallery not found - skipping gallery initialization');
        return;
    }

    // Hide loading since images are already rendered
    if (loading) {
        loading.style.display = 'none';
    }

    // Show gallery immediately
    if (imageGallery) {
        imageGallery.style.display = 'grid';
        imageGallery.style.opacity = '1';
    }

    // Lightbox functionality
    window.openLightbox = function(src, alt) {
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent body scroll
            
            // Track image view for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'image_view', {
                    'custom_parameter': src
                });
            }
        }
    };

    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore body scroll
        }
    }

    // Event listeners for lightbox (only if elements exist)
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    // Error handling for images
    function handleImageErrors() {
        const images = document.querySelectorAll('.gallery-item img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = `
                    <i class="fas fa-image" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="margin-top: 10px; color: #666; font-family: Heebo, Arial, sans-serif;">תמונה לא זמינה</p>
                `;
                placeholder.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 250px;
                    background: #f8f9fa;
                    border-radius: 15px;
                `;
                this.parentNode.insertBefore(placeholder, this);
            });
        });
    }

    // Add fade-in animation to gallery items
    function animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    // Initialize gallery features
    setTimeout(() => {
        handleImageErrors();
        animateGalleryItems();
        addImageStructuredData();
    }, 500);

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        if (imageGallery) {
            imageGallery.style.transition = 'all 0.3s ease';
        }
    });

    console.log('✅ Gallery initialized - images rendered by C# generator');
});

// SEO: Add structured data for images
function addImageStructuredData() {
    const images = document.querySelectorAll('.gallery-item img');
    if (images.length > 0) {
        const imageData = Array.from(images).map(img => ({
            "@type": "ImageObject",
            "url": img.src,
            "description": img.alt
        }));

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "גלריית מצבר לדרך",
            "description": "גלריית תמונות של רכבים ויאכטות - שירותי חילוץ מקצועיים",
            "image": imageData
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
        
        console.log(`📊 Added structured data for ${images.length} images`);
    }
}