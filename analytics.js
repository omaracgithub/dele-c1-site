// GA4 CTA + Outbound Click Tracker
(function () {
  'use strict';

  function track(eventName, props) {
    try {
      if (window.gtag) window.gtag('event', eventName, props || {});
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.href || '';

    // App Store CTA clicks
    if (href.includes('apps.apple.com') || href.includes('itunes.apple.com')) {
      var cta = link.getAttribute('data-cta') || 'app_store';
      track('CTA Click', {
        page_hostname: window.location.hostname,
        cta: cta,
        link_url: href,
        link_text: link.textContent.trim().substring(0, 50),
        page_path: window.location.pathname,
        page_url: window.location.href
      });
    }

    // Outbound link clicks
    if (link.hostname && link.hostname !== window.location.hostname) {
      track('Outbound Link: Click', {
        link_url: href,
        link_domain: link.hostname,
        page_path: window.location.pathname,
        page_url: window.location.href
      });
    }
  });

  // Scroll depth tracking
  var scrollMarks = [25, 50, 75, 100];
  var scrollFired = {};
  var scrollTimer;

  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var percent = Math.round((scrollTop / docHeight) * 100);
      scrollMarks.forEach(function (mark) {
        if (percent >= mark && !scrollFired[mark]) {
          scrollFired[mark] = true;
          track('scroll_depth', { percent: mark });
        }
      });
    }, 150);
  }, { passive: true });
})();
