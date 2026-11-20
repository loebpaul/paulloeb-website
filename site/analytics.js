function trackStudioEvent(name, item) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, item ? { studio_item: item } : {});
}

(() => {
  if (!['paulloeb.net', 'www.paulloeb.net'].includes(location.hostname)) return;

  const measurementId = 'G-JLJKB7Q7BX';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(tag);
})();
