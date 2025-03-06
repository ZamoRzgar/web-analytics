// public/tracker.js
(function() {
    const websiteId = document.currentScript.getAttribute('data-website-id');
    
    if (!websiteId) {
      console.error('Analytics: No website ID provided');
      return;
    }
    
    const apiEndpoint = 'https://your-analytics-domain.com/api/track';
    
    // Function to send analytics data
    const trackPageview = () => {
      const data = {
        websiteId,
        pathname: window.location.pathname,
        referrer: document.referrer
      };
      
      // Use sendBeacon if available for better reliability during page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          apiEndpoint, 
          JSON.stringify(data)
        );
      } else {
        // Fallback to fetch
        fetch(apiEndpoint, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          // Use keepalive to ensure request completes even if page unloads
          keepalive: true
        }).catch(error => {
          console.error('Analytics error:', error);
        });
      }
    };
    
    // Track initial pageview
    trackPageview();
    
    // Setup for SPA navigation tracking (for frameworks like React)
    let lastUrl = window.location.href;
    
    // Create a new observer to watch for URL changes
    const observer = new MutationObserver(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        trackPageview();
      }
    });
    
    // Start observing the document for changes
    observer.observe(document, { subtree: true, childList: true });
    
    // For History API based navigation
    ['pushState', 'replaceState'].forEach(method => {
      const original = window.history[method];
      window.history[method] = function() {
        setTimeout(trackPageview, 0);
        return original.apply(this, arguments);
      };
    });
    
    // For hash-based navigation (SPAs)
    window.addEventListener('hashchange', trackPageview);
  })();