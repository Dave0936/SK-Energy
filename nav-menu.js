(function () {
  var BP = 960;

  function el(tag, style, html) {
    var e = document.createElement(tag);
    if (style) e.style.cssText = style;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function initServices(root) {
    if (root.__skm) return;
    root.__skm = true;
    var btn = root.querySelector('[data-svc-toggle]');
    var panel = root.querySelector('[data-svc-panel]');
    var caret = root.querySelector('[data-svc-caret]');
    var t;
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
    if (window.matchMedia('(hover: hover)').matches) {
      root.addEventListener('mouseenter', function () { clearTimeout(t); set(true); });
      root.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 180); });
    }
    btn.addEventListener('click', function (e) { e.preventDefault(); set(!root.__open); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.__open) { set(false); btn.focus(); } });
  }

  function css() {
    if (document.getElementById('sk-mobile-css')) return;
    var H = 'header:has(> nav [data-svc-menu])';
    var s = document.createElement('style');
    s.id = 'sk-mobile-css';
    s.textContent =
      '[data-sk-burger]{display:none}' +
      '@media (max-width:' + BP + 'px){' +
        H + ' > nav,' + H + ' > nav ~ a{display:none !important}' +
        '[data-sk-burger]{display:flex !important}' +
        H + '{flex-wrap:nowrap !important;padding:16px !important}' +
        H + ' > a img{height:32px !important;width:136px !important}' +
      '}' +
      'body.sk-lock{overflow:hidden}';
    document.head.appendChild(s);
  }

  var ov = null, ovClose = null, ovBurger = null;

  function setOv(o) {
    if (!ov) return;
    ov.style.opacity = o ? '1' : '0';
    ov.style.visibility = o ? 'visible' : 'hidden';
    ov.style.transform = o ? 'none' : 'translateY(-8px)';
    if (ovBurger) ovBurger.setAttribute('aria-expanded', o ? 'true' : 'false');
    document.body.classList.toggle('sk-lock', o);
    if (o) ovClose.focus();
    else if (ovBurger) ovBurger.focus({ preventScroll: true });
  }

  function buildOverlay(header) {
    if (ov) ov.remove();
    var nav = header.querySelector(':scope > nav');
    var cta = null;
    [].slice.call(header.children).forEach(function (c) {
      if (c !== nav && c.tagName === 'A' && !c.querySelector('img')) cta = c;
    });
    var logo = header.querySelector(':scope > a img');

    ov = el('div', 'position:fixed;inset:0;z-index:9000;background:#0E1110;color:#fff;display:flex;flex-direction:column;padding:16px 16px 24px;overflow-y:auto;opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .28s ease,transform .28s ease,visibility .28s;font-family:Satoshi,system-ui,sans-serif');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Menu');

    var top = el('div', 'display:flex;align-items:center;justify-content:space-between;gap:16px');
    if (logo) {
      var la = el('a', 'display:flex;align-items:center');
      la.href = logo.closest('a').getAttribute('href') || '#';
      var li = el('img', 'height:32px;width:136px;object-fit:contain;display:block');
      li.src = logo.getAttribute('src');
      li.alt = 'SK Energy';
      la.appendChild(li);
      top.appendChild(la);
    }
    ovClose = el('button', 'width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.24);background:transparent;color:#fff;font-size:24px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;padding:0', '&times;');
    ovClose.type = 'button';
    ovClose.setAttribute('aria-label', 'Close menu');
    top.appendChild(ovClose);
    ov.appendChild(top);

    var list = el('div', 'display:flex;flex-direction:column;margin-top:24px;border-top:1px solid rgba(255,255,255,.12)');
    var rowCss = 'display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px;padding:12px 0;border:0;border-bottom:1px solid rgba(255,255,255,.12);color:#fff;font-size:28px;font-weight:700;letter-spacing:-.03em;text-decoration:none;background:none;width:100%;text-align:left;cursor:pointer;font-family:inherit';

    [].slice.call(nav ? nav.children : []).forEach(function (c) {
      if (c.hasAttribute('data-svc-menu')) {
        var wrap = el('div', '');
        var bt = el('button', rowCss, 'Services <span style="font-size:24px;color:#CBF24C;transition:transform .25s ease;display:block">+</span>');
        bt.type = 'button';
        bt.setAttribute('aria-expanded', 'false');
        var sub = el('div', 'display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease');
        var inner = el('div', 'overflow:hidden;display:flex;flex-direction:column;gap:8px');
        inner.appendChild(el('div', 'height:8px'));
        [].slice.call(c.querySelectorAll('[data-svc-panel] a')).forEach(function (x) {
          var sp = x.querySelectorAll('span');
          var sa = el('a', 'display:flex;flex-direction:column;justify-content:center;gap:2px;min-height:48px;padding:8px 0 8px 16px;color:#fff;text-decoration:none;border-left:2px solid rgba(203,242,76,.5)');
          sa.href = x.getAttribute('href');
          sa.appendChild(el('span', 'font-size:17px;font-weight:700;letter-spacing:-.01em', sp[0] ? sp[0].textContent : x.textContent));
          if (sp[1]) sa.appendChild(el('span', 'font-size:13px;color:rgba(255,255,255,.62)', sp[1].textContent));
          inner.appendChild(sa);
        });
        inner.appendChild(el('div', 'height:16px'));
        sub.appendChild(inner);
        bt.addEventListener('click', function () {
          var o = bt.getAttribute('aria-expanded') !== 'true';
          bt.setAttribute('aria-expanded', o ? 'true' : 'false');
          sub.style.gridTemplateRows = o ? '1fr' : '0fr';
          bt.lastChild.style.transform = o ? 'rotate(45deg)' : 'none';
        });
        wrap.appendChild(bt);
        wrap.appendChild(sub);
        list.appendChild(wrap);
      } else if (c.tagName === 'A') {
        var a2 = el('a', rowCss, c.textContent.trim() + ' <span style="font-size:20px;color:rgba(255,255,255,.4)">&rarr;</span>');
        a2.href = c.getAttribute('href');
        list.appendChild(a2);
      }
    });
    ov.appendChild(list);

    var foot = el('div', 'margin-top:auto;padding-top:32px;display:flex;flex-direction:column;gap:8px');
    if (cta) {
      var c2 = el('a', 'display:flex;align-items:center;justify-content:center;min-height:56px;border-radius:999px;background:#CBF24C;color:#0E1110;font-size:16px;font-weight:700;text-decoration:none', cta.textContent.trim());
      c2.href = cta.getAttribute('href');
      foot.appendChild(c2);
    }
    var em = el('a', 'display:flex;align-items:center;justify-content:center;min-height:48px;color:rgba(255,255,255,.72);font-size:14px;text-decoration:none', 'customerservice@sk-energy.co.uk');
    em.href = 'mailto:customerservice@sk-energy.co.uk';
    foot.appendChild(em);
    ov.appendChild(foot);

    document.body.appendChild(ov);
    ovClose.addEventListener('click', function () { setOv(false); });
    ov.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOv(false); });
  }

  function initHeader(header) {
    if (!header.querySelector(':scope > nav [data-svc-menu]')) return;
    if (header.querySelector(':scope > [data-sk-burger]')) return;
    var burger = el('button', 'align-items:center;justify-content:center;gap:5px;flex-direction:column;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.14);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);cursor:pointer;padding:0;flex:none');
    burger.type = 'button';
    burger.setAttribute('data-sk-burger', '');
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    for (var i = 0; i < 2; i++) burger.appendChild(el('span', 'display:block;width:18px;height:2px;border-radius:2px;background:#fff;pointer-events:none'));
    burger.addEventListener('click', function () {
      ovBurger = burger;
      buildOverlay(header);
      requestAnimationFrame(function () { setOv(true); });
    });
    header.appendChild(burger);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ov && ov.style.visibility === 'visible') setOv(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > BP && ov && ov.style.visibility === 'visible') setOv(false);
  });

  function scan() {
    css();
    document.querySelectorAll('[data-svc-menu]').forEach(initServices);
    document.querySelectorAll('header').forEach(initHeader);
  }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
