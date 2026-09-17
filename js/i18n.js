/* Soft language-suggestion banner (2026-09-14) — NOT an automatic redirect.
 *
 * Why not a server-side/forced redirect: Google's own international-SEO guidance
 * explicitly discourages auto-redirecting visitors based on detected location/language —
 * it can strand Googlebot (which crawls from fixed locations/UAs) on the wrong language
 * version, hurting indexing of both, and it overrides a user who deliberately wants the
 * other language. We also confirmed 2026-09-14 that this site's front end doesn't honor
 * .htaccess (server responds as nginx, not Apache/LiteSpeed) — a server-side redirect isn't
 * reliably implementable here even if it were desirable.
 *
 * What this does instead: reads navigator.language (no IP lookup, no third-party service,
 * nothing sent off-device) and shows a small dismissible banner suggesting the other
 * language, only once per visitor (localStorage flag) and only when the page you're on
 * doesn't match your browser's language. The user always chooses.
 *
 * Each page sets `window.FOUWELL_LANG` ('en' or 'ru') and `window.FOUWELL_ALT_URL`
 * (the equivalent page in the other language) before loading this script.
 */
(function () {
  var STORAGE_KEY = 'fouwell_lang_banner_dismissed';
  var current = window.FOUWELL_LANG;
  var altUrl = window.FOUWELL_ALT_URL;
  if (!current || !altUrl) return;

  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {
    // localStorage unavailable (private mode, etc.) — just skip the banner rather than error.
    return;
  }

  var browserLangs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
  var prefersRu = browserLangs.some(function (l) { return /^ru\b/i.test(l); });
  var prefersEn = browserLangs.some(function (l) { return /^en\b/i.test(l); });

  var shouldSuggest =
    (current === 'en' && prefersRu && !prefersEn) ||
    (current === 'ru' && prefersEn && !prefersRu);
  if (!shouldSuggest) return;

  var copy = current === 'en'
    ? { text: 'Похоже, вы предпочитаете русский язык. Показать сайт на русском?', switchLabel: 'Да, показать по-русски', dismissLabel: 'No, keep English' }
    : { text: 'Looks like your browser is set to English. Switch the site to English?', switchLabel: 'Yes, switch to English', dismissLabel: 'Нет, оставить русский' };

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    var el = document.getElementById('fw-lang-banner');
    if (el) el.remove();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.id = 'fw-lang-banner';
    bar.className = 'fw-lang-banner';
    bar.innerHTML =
      '<span class="fw-lang-banner-text"></span>' +
      '<span class="fw-lang-banner-actions">' +
      '<a class="fw-lang-banner-switch" href="' + altUrl + '"></a>' +
      '<button type="button" class="fw-lang-banner-dismiss"></button>' +
      '</span>';
    bar.querySelector('.fw-lang-banner-text').textContent = copy.text;
    bar.querySelector('.fw-lang-banner-switch').textContent = copy.switchLabel;
    bar.querySelector('.fw-lang-banner-dismiss').textContent = copy.dismissLabel;
    bar.querySelector('.fw-lang-banner-dismiss').addEventListener('click', dismiss);
    document.body.insertBefore(bar, document.body.firstChild);
  });
})();
