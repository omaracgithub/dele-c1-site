// GA4 CTA + Outbound Click Tracker for DELE C1 site
(function () {
  'use strict';

  function trackEvent(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  // Track all CTA clicks (App Store links)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.href || '';

    // App Store CTA clicks
    if (href.includes('apps.apple.com') || href.includes('itunes.apple.com')) {
      trackEvent('cta_click', {
        link_url: href,
        link_text: link.textContent.trim().substring(0, 50),
        page_location: window.location.pathname
      });
    }

    // Outbound link clicks
    if (link.hostname && link.hostname !== window.location.hostname) {
      trackEvent('outbound_click', {
        link_url: href,
        link_text: link.textContent.trim().substring(0, 50),
        page_location: window.location.pathname
      });
    }
  });

  // Track scroll depth on landing pages
  var scrollMarks = [25, 50, 75, 100];
  var scrollFired = {};

  window.addEventListener('scroll', function () {
    var scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    scrollMarks.forEach(function (mark) {
      if (scrollPercent >= mark && !scrollFired[mark]) {
        scrollFired[mark] = true;
        trackEvent('scroll_depth', { percent: mark });
      }
    });
  });
})();
