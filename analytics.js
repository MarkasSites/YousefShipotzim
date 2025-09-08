// Google Analytics 4 Tracking Script
// This script handles GA4 initialization and event tracking

// Initialize Google Analytics if enabled
function initializeAnalytics() {
    // Get analytics configuration from window (injected by C# generator)
    if (typeof window.siteAnalytics !== 'undefined' && window.siteAnalytics.enabled) {
        const analyticsId = window.siteAnalytics.googleAnalyticsId;
        
        // Domain check removed - analytics will work on any domain
        
        // Load Google Analytics library
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag; // Make gtag globally available
        
        // Configure Analytics with enhanced security
        gtag('js', new Date());
        gtag('config', analyticsId, {
            // Enhanced security settings
            'send_page_view': true,
            'anonymize_ip': true,  // GDPR compliance
            'allow_google_signals': false,  // Disable ads features if not needed
            'cookie_flags': 'SameSite=Strict;Secure'  // Secure cookies
        });
        
        console.log('Google Analytics initialized with ID:', analyticsId);
    } else {
        console.log('Google Analytics is disabled or not configured');
    }
}

// Track phone call clicks
function trackPhoneClick(source) {
    if (typeof window.gtag !== 'undefined') {
        // Google Analytics event tracking
        gtag('event', 'phone_call', {
            'event_category': 'contact',
            'event_label': source,
            'page_title': document.title,
            'page_location': window.location.href
        });
        
        // Google Ads conversion tracking
        gtag('event', 'conversion', {
            'send_to': window.siteAnalytics.googleAnalyticsId + '/phone_conversion'
        });
        
        console.log('Phone call tracked:', source);
    } else {
        console.log('Google Analytics not available for tracking phone call:', source);
    }
}

// Track custom events
function trackEvent(eventName, eventData = {}) {
    if (typeof window.gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': eventData.category || 'general',
            'event_label': eventData.label || '',
            'value': eventData.value || null,
            'page_title': document.title,
            'page_location': window.location.href,
            ...eventData // Spread any additional properties
        });
        
        console.log('Event tracked:', eventName, eventData);
    } else {
        console.log('Google Analytics not available for tracking event:', eventName);
    }
}

// Track service clicks
function trackServiceClick(serviceName) {
    trackEvent('service_click', {
        category: 'engagement',
        label: serviceName
    });
}

// Track CTA button clicks
function trackCTAClick(ctaType) {
    trackEvent('cta_click', {
        category: 'conversion',
        label: ctaType
    });
}

// Track gallery interactions
function trackGalleryView(imageIndex) {
    trackEvent('gallery_view', {
        category: 'engagement',
        label: 'image_' + imageIndex,
        value: imageIndex
    });
}

// Track scroll depth (25%, 50%, 75%, 100%)
function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    let trackedMilestones = [];
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Check if we've hit a new milestone
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
                    trackedMilestones.push(milestone);
                    trackEvent('scroll_depth', {
                        category: 'engagement',
                        label: milestone + '%',
                        value: milestone
                    });
                }
            });
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    trackScrollDepth();
});

// Make functions globally available
window.trackPhoneClick = trackPhoneClick;
window.trackEvent = trackEvent;
window.trackServiceClick = trackServiceClick;
window.trackCTAClick = trackCTAClick;
window.trackGalleryView = trackGalleryView;
