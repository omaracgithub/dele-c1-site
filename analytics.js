// GA4 CTA + Outbound Click Tracker — b2.prepdele.com
(function () {
  'use strict';

  function trackEvent(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params);
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
        link_domain: link.hostname,
        page_location: window.location.pathname
      });
    }
  });

  // Track scroll depth on landing pages
  var scrollMarks = [25, 50, 75, 100];
  var scrollFired = {};

  function checkScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var percent = Math.round((scrollTop / docHeight) * 100);

    scrollMarks.forEach(function (mark) {
      if (percent >= mark && !scrollFired[mark]) {
        scrollFired[mark] = true;
        trackEvent('scroll_depth', { percent: mark });
      }
    });
  }

  var scrollTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(checkScroll, 150);
  }, { passive: true });
})();
