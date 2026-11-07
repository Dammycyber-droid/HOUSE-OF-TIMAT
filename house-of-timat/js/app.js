/* HOUSE OF TIMAT: shared shell (header, footer, bag, wishlist) + page logic */
(() => {
const C = CFG, P = PRODUCTS, page = document.body.dataset.page;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const st = {get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }};
let wish = st.get('hot_wish', []).filter(id => P.some(p => p.id === id)), cart = st.get('hot_cart', []).filter(x => P.some(p => p.id === x.id));
const money = n => C.currency + n.toLocaleString('en-NG'), pid = id => P.find(p => p.id === id);
const waNum = () => { let n = String(C.whatsapp || '').replace(/\D/g, ''); if (n.startsWith('0')) n = (C.countryCode || '234') + n.slice(1); return n; };
const waOk = () => waNum().length >= 10 && !/0{7,}/.test(waNum());
const wa = t => `https://wa.me/${waNum()}?text=${encodeURIComponent(t)}`;
const mailOk = () => /^\S+@\S+\.\S+$/.test(C.ownerEmail || '') && C.ownerEmail.toLowerCase() !== 'hello@houseoftimat.com';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function toast(m, bad) { const t = document.createElement('div'); t.className = 'toast' + (bad ? ' bad' : ''); t.setAttribute('role', 'status'); t.textContent = m; $('#toasts').append(t); setTimeout(() => t.remove(), 4500); }
const art = p => `<svg viewBox="0 0 200 260" role="img" aria-label="${esc(p.name)}"><rect width="200" height="260" fill="${COLORS[p.colors[0]]}"/><rect width="200" height="260" fill="url(#shade)" opacity=".45"/><path d="M100 12v28" stroke="#b08d57" stroke-width="2"/><path d="${SHAPES[p.shape]}" fill="rgba(255,255,255,.14)" stroke="#b08d57" stroke-width="1.5"/></svg>`;
const card = p => `<article class="card"><a class="img" href="product.html?id=${p.id}">${art(p)}</a><button class="heart" data-act="wish" data-id="${p.id}" aria-label="Save ${esc(p.name)} to wishlist">♥</button><div class="ci"><h3>${p.name}</h3><p>${money(p.price)}</p><div class="row"><button class="btn ghost small" data-act="quick" data-id="${p.id}">Quick view</button><button class="btn small" data-act="add" data-id="${p.id}">Add to bag</button></div></div></article>`;
const opts = p => `<div class="opt"><span>Size</span>${p.sizes.map((s, i) => `<label class="chip"><input type="radio" name="size" value="${s}" ${i ? '' : 'checked'}><b>${s}</b></label>`).join('')}</div><div class="opt"><span>Colour</span>${p.colors.map((c, i) => `<label class="sw"><input type="radio" name="color" value="${c}" ${i ? '' : 'checked'}><i style="background:${COLORS[c]}" title="${c}"></i></label>`).join('')}</div>`;
const sel = r => [$('[name=size]:checked', r).value, $('[name=color]:checked', r).value];

/* ---- shell ---- */
const NAV = [['index','Home'],['about','About'],['shop','Shop'],['custom','Custom order'],['wishlist','Wishlist'],['contact','Contact']];
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs></svg>
<header class="nav"><a class="brand" href="index.html">HOUSE OF TIMAT</a><nav id="nl" aria-label="Main">${NAV.map(([f, l]) => `<a href="${f}.html" ${f === page ? 'aria-current="page"' : ''}>${l}${f === 'wishlist' ? ' (<span id="wc">0</span>)' : ''}</a>`).join('')}</nav><div class="tools"><a class="btn ghost small" id="au" href="account.html">Login</a><button data-act="cart-open" aria-label="Open bag">Bag (<span id="cc">0</span>)</button><button class="burger" id="bg" aria-label="Menu" aria-expanded="false">Menu</button></div></header>`);
document.body.insertAdjacentHTML('beforeend', `<footer class="foot"><div class="wrap fg"><div><h3 class="brand">HOUSE OF TIMAT</h3><p>Luxury fashion, made to measure. Ready-to-wear pieces and fully custom tailoring for the occasions that matter.</p><div class="soc"><a data-wa href="#" target="_blank" rel="noopener">WhatsApp</a><a href="${C.tiktok}" target="_blank" rel="noopener">TikTok</a><a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a></div></div>
<div><h4>Explore</h4><a href="shop.html">Shop</a><a href="about.html">About us</a><a href="wishlist.html">Wishlist</a><a href="custom.html">Custom order</a><a href="account.html">Login / Sign up</a></div>
<div><h4>Support</h4><a href="contact.html">Contact us</a><a data-wa href="#" target="_blank" rel="noopener">Chat on WhatsApp</a><a href="mailto:${C.ownerEmail}">${C.ownerEmail}</a></div>
<div><h4>Newsletter</h4><form data-send="Newsletter signup" class="nl" novalidate><input type="email" name="email" required aria-label="Email address" placeholder="Your email"><button class="btn small">Subscribe</button></form></div></div><p class="copy">&copy; ${new Date().getFullYear()} HOUSE OF TIMAT. All rights reserved.</p></footer>
<div class="scrim" id="scrim" data-act="cart-close"></div><aside class="drawer" id="dr" aria-label="Shopping bag"><div class="dh"><h3>Your bag</h3><button data-act="cart-close" aria-label="Close bag">Close</button></div><div id="cl"></div><div class="df"><p>Total <b id="ct"></b></p><a class="btn" id="ck" href="#" target="_blank" rel="noopener">Order via WhatsApp</a><small>Payment is arranged with us on WhatsApp after you send your order.</small></div></aside>
<a class="wafab" data-wa href="#" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">WhatsApp</a><dialog id="qv"></dialog><div id="toasts"></div>`);
$$('[data-wa]').forEach(a => a.href = wa(a.dataset.wa || 'Hello HOUSE OF TIMAT, I would like to make an enquiry.'));

/* ---- wishlist & bag ---- */
function syncWish() { $('#wc').textContent = wish.length; $$('.heart').forEach(h => h.classList.toggle('on', wish.includes(h.dataset.id))); }
function toggleWish(id) { const on = !wish.includes(id); wish = on ? [...wish, id] : wish.filter(x => x !== id); st.set('hot_wish', wish); syncWish(); toast(on ? 'Saved to wishlist' : 'Removed from wishlist'); if (page === 'wishlist') renderWish(); }
function addCart(id, size, color, q = 1, quiet) { const k = id + size + color, i = cart.find(x => x.k === k); i ? i.q += q : cart.push({k, id, size, color, q}); saveCart(); if (!quiet) toast('Added to your bag'); }
function saveCart() { st.set('hot_cart', cart); renderCart(); }
function renderCart() {
  const n = cart.reduce((a, x) => a + x.q, 0), tot = cart.reduce((a, x) => a + x.q * pid(x.id).price, 0);
  $('#cc').textContent = n; $('#ct').textContent = money(tot);
  $('#cl').innerHTML = cart.length ? cart.map(x => { const p = pid(x.id); return `<div class="ci2"><div class="th">${art(p)}</div><div><h4>${p.name}</h4><small>${x.size} / ${x.color}</small><p>${money(p.price * x.q)}</p><div class="qty"><button data-act="qty" data-k="${x.k}" data-d="-1" aria-label="Decrease">-</button><span>${x.q}</span><button data-act="qty" data-k="${x.k}" data-d="1" aria-label="Increase">+</button><button class="lnk" data-act="rm" data-k="${x.k}">Remove</button></div></div></div>`; }).join('') : '<p class="empty">Your bag is empty.</p>';
  const ck = $('#ck'); ck.toggleAttribute('aria-disabled', !cart.length);
  ck.href = cart.length ? wa('Hello HOUSE OF TIMAT, I would like to order:\n' + cart.map(x => `- ${pid(x.id).name} (${x.size}, ${x.color}) x${x.q} = ${money(pid(x.id).price * x.q)}`).join('\n') + '\nTotal: ' + money(tot)) : '#';
}
function quick(id) {
  const p = pid(id), d = $('#qv');
  d.innerHTML = `<button class="x" data-act="qclose" aria-label="Close">Close</button><div class="qg"><div>${art(p)}</div><div data-opts><h2>${p.name}</h2><p class="pr">${money(p.price)}</p><p>${p.desc}</p>${opts(p)}<div class="row"><button class="btn" data-act="qadd" data-id="${id}">Add to bag</button><button class="btn ghost heartb" data-act="wish" data-id="${id}">${wish.includes(id) ? 'Remove from wishlist' : 'Save to wishlist'}</button></div><p><a href="product.html?id=${id}">View full details</a></p></div></div>`;
  d.showModal();
}

/* ---- email delivery (Formspree or any JSON form endpoint) ---- */
async function send(data, subject) {
  const url = C.formEndpoint || (mailOk() ? 'https://formsubmit.co/ajax/' + encodeURIComponent(C.ownerEmail) : '');
  if (!url) { toast('Email delivery is not set up: put your real email in ownerEmail in js/config.js. You can also use WhatsApp.', 1); return false; }
  try {
    const r = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify({...data, _subject: 'HOUSE OF TIMAT: ' + subject, _captcha: 'false', _template: 'table'})});
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === false || j.success === 'false') throw new Error(j.message || '');
    toast(/activat/i.test(j.message || '') ? j.message : 'Thank you. Your message has been sent.'); return true;
  } catch (e) { toast(e && e.message ? e.message : 'We could not send your message. Open the site through Live Server or your hosting (not by double-clicking the file), or use WhatsApp.', 1); return false; }
}
function check(f) {
  $$('[aria-invalid]', f).forEach(e => e.removeAttribute('aria-invalid'));
  for (const el of $$('[required]', f)) {
    const v = el.value.trim(); let m = '';
    if (!v) m = 'Please fill in: ' + el.name; else if (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) m = 'Enter a valid email address';
    else if (el.type === 'tel' && v.replace(/\D/g, '').length < 7) m = 'Enter a valid phone number'; else if (el.tagName === 'TEXTAREA' && v.length < 10) m = 'Your message is too short';
    if (m) { el.setAttribute('aria-invalid', 'true'); el.focus(); toast(m, 1); return false; }
  } return true;
}

/* ---- events ---- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (a && !e.metaKey && !e.ctrlKey && !a.target && /\.html/.test(a.getAttribute('href') || '') && a.protocol === location.protocol) { e.preventDefault(); document.body.classList.add('out'); setTimeout(() => location.href = a.href, 260); return; }
  if (a && a.href.startsWith('https://wa.me/') && !waOk()) { e.preventDefault(); toast('WhatsApp number is not set yet. Add it in js/config.js.', 1); return; }
  if (a && a.hasAttribute('aria-disabled')) { e.preventDefault(); toast('Add something to your bag first.', 1); return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, id = b.dataset.id;
  if (act === 'wish') { toggleWish(id); const h = $('.heartb'); if (h && $('#qv').open) h.textContent = wish.includes(id) ? 'Remove from wishlist' : 'Save to wishlist'; }
  else if (act === 'add') { const p = pid(id); addCart(id, p.sizes[0], p.colors[0]); }
  else if (act === 'quick') quick(id);
  else if (act === 'qadd') { addCart(id, ...sel(b.closest('[data-opts]'))); }
  else if (act === 'qclose') $('#qv').close();
  else if (act === 'cart-open') { $('#dr').classList.add('open'); $('#scrim').classList.add('open'); }
  else if (act === 'cart-close') { $('#dr').classList.remove('open'); $('#scrim').classList.remove('open'); }
  else if (act === 'qty') { const i = cart.find(x => x.k === b.dataset.k); i.q += +b.dataset.d; if (i.q < 1) cart = cart.filter(x => x !== i); saveCart(); }
  else if (act === 'rm') { cart = cart.filter(x => x.k !== b.dataset.k); saveCart(); }
  else if (act === 'logout') { me = null; st.set('hot_session', null); renderAuth(); onAuth(); toast('You have been logged out.'); }
  else if (act === 'tab') { $('#lf').hidden = b.dataset.t !== 'login'; $('#sf').hidden = b.dataset.t !== 'signup'; $$('[data-act=tab]').forEach(x => x.classList.toggle('on', x === b)); }
  else if (act === 'tm') tm(+b.dataset.d);
  else if (act === 'selall') $$('.ck').forEach(c => c.checked = b.checked);
  else if (act === 'wl-rm' || act === 'wl-add') {
    const ids = $$('.ck:checked').map(c => c.value); if (!ids.length) return toast('Select at least one product first.', 1);
    if (act === 'wl-rm') { wish = wish.filter(x => !ids.includes(x)); st.set('hot_wish', wish); syncWish(); renderWish(); toast('Removed selected products'); }
    else { ids.forEach(i => addCart(i, pid(i).sizes[0], pid(i).colors[0], 1, 1)); toast(ids.length + ' item(s) added to your bag'); }
  }
});
$('#qv').addEventListener('click', e => { if (e.target.id === 'qv') e.target.close(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { $('#dr').classList.remove('open'); $('#scrim').classList.remove('open'); } });
$('#bg').addEventListener('click', () => { const o = $('#nl').classList.toggle('open'); $('#bg').setAttribute('aria-expanded', o); });
document.addEventListener('submit', async e => {
  const f = e.target.closest('form[data-send]'); if (!f) return; e.preventDefault();
  if (!check(f)) return; const btn = $('button:not([type=button])', f); btn.disabled = true;
  if (await send(Object.fromEntries(new FormData(f)), f.dataset.send)) { f.reset(); renderAuth(); if (f.id === 'cf') summary(); }
  btn.disabled = false;
});

/* ---- accounts (front-end demo: stored in this browser only) ---- */
let me = st.get('hot_session', null), onAuth = () => {};
const users = () => st.get('hot_users', {});
async function hash(pw, salt) {
  if (!window.crypto || !crypto.subtle) throw new Error('secure');
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + pw));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function renderAuth() {
  $('#au').textContent = me ? 'Hi, ' + me.name.split(' ')[0] : 'Login';
  if (me) $$('form[data-send]').forEach(f => { const n = f.elements.name, m = f.elements.email; if (n && !n.value) n.value = me.name; if (m && !m.value) m.value = me.email; });
}
document.addEventListener('submit', async e => {
  const f = e.target.closest('form[data-auth]'); if (!f) return; e.preventDefault();
  if (!check(f)) return;
  const d = Object.fromEntries(new FormData(f)), email = d.email.trim().toLowerCase(), U = users();
  try {
    if (f.dataset.auth === 'signup') {
      if (d.password.length < 8) return toast('Password must be at least 8 characters.', 1);
      if (d.password !== d.confirm) return toast('Passwords do not match.', 1);
      if (U[email]) return toast('An account with this email already exists. Please log in.', 1);
      const salt = crypto.getRandomValues(new Uint32Array(4)).join('-');
      U[email] = {name: d.name.trim(), salt, hash: await hash(d.password, salt)}; st.set('hot_users', U);
      me = {name: U[email].name, email};
    } else {
      const u = U[email];
      if (!u || u.hash !== await hash(d.password, u.salt)) return toast('Incorrect email or password.', 1);
      me = {name: u.name, email};
    }
  } catch { return toast('Accounts need a secure page. Use Live Server (localhost) or https hosting.', 1); }
  st.set('hot_session', me); f.reset(); renderAuth(); onAuth(); toast('Welcome, ' + me.name.split(' ')[0] + '!');
});

/* ---- pages ---- */
let ti = 0, tmr; function tm(d) {
  ti = (ti + d + TESTIMONIALS.length) % TESTIMONIALS.length; const t = TESTIMONIALS[ti];
  $('#tm').innerHTML = `<figure class="tc"><div class="av">${t.n[0]}</div><div class="stars" aria-label="${t.s} out of 5 stars">${'★'.repeat(t.s)}${'☆'.repeat(5 - t.s)}</div><blockquote>${t.t}</blockquote><figcaption>${t.n}, ${t.c}</figcaption></figure><div class="dots"><button data-act="tm" data-d="-1" aria-label="Previous review">Prev</button><button data-act="tm" data-d="1" aria-label="Next review">Next</button></div>`;
  clearTimeout(tmr); tmr = setTimeout(() => tm(1), 6500);
}
function renderWish() {
  wish = wish.filter(pid);
  $('#wl').innerHTML = wish.length ? wish.map(id => { const p = pid(id); return `<div class="wl"><input type="checkbox" class="ck" value="${id}" aria-label="Select ${esc(p.name)}"><a class="th" href="product.html?id=${id}">${art(p)}</a><div class="wi"><h3>${p.name}</h3><p>${money(p.price)}</p></div><div class="row"><button class="btn small" data-act="add" data-id="${id}">Add to bag</button><button class="btn ghost small" data-act="wish" data-id="${id}">Remove</button></div></div>`; }).join('') : '<p class="empty">Nothing saved yet. <a href="shop.html">Browse the shop</a>.</p>';
  $('#bar').hidden = !wish.length; $('#all').checked = false;
}
function summary() {
  const f = $('#cf'), d = Object.fromEntries(new FormData(f)), L = [['Garment', d.garment], ['Size', d.size], ['Colour', d.color], ['Fabric', d.fabric]];
  ['bust','waist','hips','shoulder','length','sleeve'].forEach(k => d[k] && L.push([k[0].toUpperCase() + k.slice(1) + ' (in)', d[k]])); if (d.notes) L.push(['Design notes', d.notes]);
  $('#sum').innerHTML = L.map(([k, v]) => `<li><span>${k}</span><b>${esc(v)}</b></li>`).join('');
  $('#cwa').href = wa('Hello HOUSE OF TIMAT, I would like a custom order:\n' + L.map(([k, v]) => `${k}: ${v}`).join('\n'));
}

if (page === 'index') {
  $('#brandline').innerHTML = [...'HOUSE OF TIMAT'].map((c, i) => `<span style="animation-delay:${i * 70}ms">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  $('#featured').innerHTML = P.slice(0, 4).map(card).join(''); tm(0);
}
if (page === 'shop') {
  let q = '', cat = 'All', sort = '';
  const cats = ['All', ...new Set(P.map(p => p.cat))];
  $('#cats').innerHTML = cats.map(c => `<button class="pill ${c === 'All' ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
  const draw = () => {
    let l = P.filter(p => (cat === 'All' || p.cat === cat) && (p.name + p.desc + p.cat).toLowerCase().includes(q));
    if (sort) l.sort((a, b) => sort === 'lo' ? a.price - b.price : b.price - a.price);
    $('#grid').innerHTML = l.length ? l.map(card).join('') : '<p class="empty">No products match your search.</p>'; $('#count').textContent = l.length + ' pieces'; syncWish();
  };
  $('#q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); draw(); });
  $('#sort').addEventListener('change', e => { sort = e.target.value; draw(); });
  $('#cats').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $$('.pill').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  draw();
}
if (page === 'product') {
  const p = pid(new URLSearchParams(location.search).get('id'));
  if (!p) $('#pd').innerHTML = '<p class="empty">Product not found. <a href="shop.html">Back to the shop</a>.</p>';
  else {
    document.title = p.name + ' | HOUSE OF TIMAT';
    $('#pd').innerHTML = `<div class="qg"><div>${art(p)}</div><div data-opts><p class="crumb"><a href="shop.html">Shop</a> / ${p.cat}</p><h1>${p.name}</h1><p class="pr">${money(p.price)}</p><p>${p.desc}</p>${opts(p)}<div class="row"><button class="btn" data-act="qadd" data-id="${p.id}">Add to bag</button><button class="btn ghost heart2" data-act="wish" data-id="${p.id}">♥ Wishlist</button></div><p class="note">Need a different fit? <a href="custom.html">Request a custom order</a>.</p></div></div>`;
    $('#rel').innerHTML = P.filter(x => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4).map(card).join('');
  }
}
if (page === 'wishlist') renderWish();
if (page === 'custom') { $('#cf').addEventListener('input', summary); $('#cf').addEventListener('change', summary); summary(); }
if (page === 'account') { onAuth = () => { $('#auth').hidden = !!me; $('#acct').hidden = !me; if (me) $('#who').textContent = 'Signed in as ' + me.name + ' (' + me.email + ')'; }; onAuth(); }
renderCart(); syncWish(); renderAuth();
})();
