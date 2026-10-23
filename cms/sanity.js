(function () {
  var cfg = window.SK_CMS_CONFIG || {};
  var img = '{ "url": asset->url, alt, caption }';
  var rich = '[]{ ..., _type == "image" => { "url": asset->url } }';
  var Q = {
    content: '{' +
      '"posts": *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc){ _id, title, slug, category, readTime, publishedAt, excerpt, "author": author->{ name, role }, "mainImage": mainImage' + img + ', "body": body' + rich + ' },' +
      '"caseStudies": *[_type == "caseStudy" && !(_id in path("drafts.**"))] | order(completed desc){ _id, title, slug, caseNumber, sector, location, completed, duration, summary, stats, systems, "heroImage": heroImage' + img + ', "brief": brief' + rich + ', "solution": solution' + rich + ', "result": result' + rich + ', "gallery": gallery[]{ "url": asset->url, alt, caption }, "testimonial": testimonial->{ quote, name, role } }' +
    '}',
    services: '{ "services": *[_type == "service" && !(_id in path("drafts.**"))] | order(order asc){ ..., "heroImage": heroImage' + img + ', feature{ ..., "image": image' + img + ' } } }',
  };
  var local = { content: 'cms/content.json', services: 'cms/services.json' };
  var cache = {};
  function sample(name) { return fetch(local[name]).then(function (r) { return r.json(); }); }
  function query(name) {
    if (cache[name]) return cache[name];
    var p;
    if (cfg.projectId) {
      var url = 'https://' + cfg.projectId + '.' + (cfg.useCdn === false ? 'api' : 'apicdn') + '.sanity.io/v' + cfg.apiVersion +
        '/data/query/' + cfg.dataset + '?query=' + encodeURIComponent(Q[name]);
      p = fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) { var r = j.result || {}; var empty = Object.keys(r).every(function (k) { return !r[k] || !r[k].length; }); if (empty) throw new Error('no published content yet'); return r; })
        .catch(function (e) { console.warn('[SK CMS] Sanity unavailable (' + e.message + ') — using sample data'); return sample(name); });
    } else {
      p = sample(name);
    }
    return (cache[name] = p);
  }
  window.SKCMS = { content: function () { return query('content'); }, services: function () { return query('services'); }, live: !!cfg.projectId };
})();
