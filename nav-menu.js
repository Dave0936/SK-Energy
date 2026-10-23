(function () {
  function init(root) {
    if (root.__skm) return; root.__skm = true;
    var btn = root.querySelector('[data-svc-toggle]'), panel = root.querySelector('[data-svc-panel]'), caret = root.querySelector('[data-svc-caret]'), t;
    if (!btn || !panel) return;
    function set(o) {
      panel.style.opacity = o ? '1' : '0';
      panel.style.visibility = o ? 'visible' : 'hidden';
      panel.style.pointerEvents = o ? 'auto' : 'none';
      panel.style.transform = 'translateY(' + (o ? 0 : -6) + 'px)';
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      if (caret) caret.style.transform = o ? 'rotate(180deg)' : 'none';
      root.__open = o;
    }
    var hover = window.matchMedia('(hover: hover)').matches;
    if (hover) {
      root.addEventListener('mouseenter', function () { clearTimeout(t); set(true); });
      root.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 180); });
    }
    btn.addEventListener('click', function (e) { e.preventDefault(); set(!root.__open); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
  }
  function scan() { document.querySelectorAll('[data-svc-menu]').forEach(init); }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
