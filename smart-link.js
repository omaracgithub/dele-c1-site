// Smart App Store Link Routing + Non-iOS Detection
(function () {
  'use strict';

  var APP_STORE_URL = 'https://apps.apple.com/app/id0000000000';

  function isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isMac() {
    return /Macintosh|MacIntel/.test(navigator.userAgent || navigator.platform);
  }

  // Show non-iOS banner if visitor is on Android or other non-Apple device
  function showNonIOSNotice() {
    if (isIOS() || isMac()) return;

    var banner = document.createElement('div');
    banner.id = 'non-ios-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;color:#fff;padding:14px 20px;text-align:center;font-size:0.9rem;z-index:9999;';
    banner.innerHTML = 'Esta app solo está disponible para iPhone. <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#aaa;margin-left:12px;cursor:pointer;font-size:1.1rem;">&times;</button>';
    document.body.appendChild(banner);
  }

  // Route smart links
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-appstore]');
    if (!link) return;

    e.preventDefault();

    if (isIOS()) {
      window.location.href = link.href;
    } else if (isMac()) {
      // Mac users can install iOS apps — open App Store
      window.open(link.href, '_blank');
    } else {
      // Non-Apple device
      showNonIOSNotice();
    }
  });

  // Auto-detect on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showNonIOSNotice);
  } else {
    showNonIOSNotice();
  }
})();
