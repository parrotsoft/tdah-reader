(() => {
  const ROOT_ID = 'tdah-reader-root';
  const DEFAULTS = { letters: 3, largeText: false, focusLine: true };
  let root;
  let currentSettings = { ...DEFAULTS };

  function textLength(element) { return (element?.innerText || '').trim().length; }
  function articleSource() {
    const candidates = [...document.querySelectorAll('article, [role="main"], main')];
    const best = candidates.sort((a, b) => textLength(b) - textLength(a))[0];
    return textLength(best) > 180 ? best : document.body;
  }

  function cleanClone(source) {
    const clone = source.cloneNode(true);
    clone.querySelectorAll('script, style, noscript, iframe, svg, nav, aside, form, button, input, footer, header, [aria-hidden="true"], .advertisement, .ads, .ad').forEach((node) => node.remove());
    clone.querySelectorAll('*').forEach((node) => {
      node.removeAttribute('style');
      node.removeAttribute('class');
      node.removeAttribute('id');
    });
    return clone;
  }

  function cueText(container, letters) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('script,style') || !/[\p{L}\p{N}]/u.test(node.nodeValue)
          ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const word = new RegExp(`([\\p{L}\\p{N}][\\p{L}\\p{N}'’-]{0,${letters - 1}})([\\p{L}\\p{N}'’-]*)`, 'gu');
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      let last = 0;
      node.nodeValue.replace(word, (match, cue, rest, index) => {
        fragment.append(document.createTextNode(node.nodeValue.slice(last, index)));
        const strong = document.createElement('strong');
        strong.className = 'tdah-cue';
        strong.textContent = cue;
        fragment.append(strong, document.createTextNode(rest));
        last = index + match.length;
      });
      fragment.append(document.createTextNode(node.nodeValue.slice(last)));
      node.replaceWith(fragment);
    });
  }

  function styleSheet() {
    return `<style>
      #${ROOT_ID}{position:fixed;inset:0;z-index:2147483647;overflow:auto;background:#f8f5ef;color:#24313c;font-family:Georgia,Cambria,"Times New Roman",serif;line-height:1.8;font-size:20px;}
      #${ROOT_ID}.tdah-large{font-size:24px;line-height:1.95} #${ROOT_ID} .tdah-bar{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:14px max(22px,calc((100vw - 900px)/2));background:rgba(248,245,239,.95);border-bottom:1px solid #e2ddd3;backdrop-filter:blur(8px);font-family:system-ui,sans-serif}
      #${ROOT_ID} .tdah-brand{font-size:14px;font-weight:750;color:#164f86} #${ROOT_ID} .tdah-close{border:1px solid #b9c3cc;border-radius:8px;padding:7px 12px;background:#fff;color:#26333e;cursor:pointer;font-weight:650}
      #${ROOT_ID} .tdah-content{max-width:760px;margin:0 auto;padding:42px 28px 100px} #${ROOT_ID} h1{font-size:2em;line-height:1.2;margin:0 0 1em} #${ROOT_ID} h2{line-height:1.3;margin-top:1.8em} #${ROOT_ID} p,#${ROOT_ID} li{max-width:70ch} #${ROOT_ID} a{color:#125d9f} #${ROOT_ID} img{max-width:100%;height:auto;border-radius:7px} #${ROOT_ID} .tdah-cue{font-weight:800;color:#102e49}
      #${ROOT_ID}.tdah-focus p{opacity:.62;transition:opacity .16s,background .16s} #${ROOT_ID}.tdah-focus p:hover,#${ROOT_ID}.tdah-focus p:focus-within{opacity:1;background:#fff5c8;box-shadow:0 0 0 6px #fff5c8;border-radius:4px}
      @media (max-width:600px){#${ROOT_ID}{font-size:18px}#${ROOT_ID}.tdah-large{font-size:21px}#${ROOT_ID} .tdah-content{padding:28px 20px 80px}}
    </style>`;
  }

  function openReader(settings) {
    currentSettings = { ...DEFAULTS, ...settings };
    if (root) closeReader();
    root = document.createElement('section');
    root.id = ROOT_ID;
    root.className = `${currentSettings.largeText ? 'tdah-large ' : ''}${currentSettings.focusLine ? 'tdah-focus' : ''}`;
    const cloned = cleanClone(articleSource());
    const content = document.createElement('article');
    content.className = 'tdah-content';
    content.append(...cloned.childNodes);
    cueText(content, currentSettings.letters);
    root.innerHTML = styleSheet() + '<div class="tdah-bar"><span class="tdah-brand">Lector TDAH</span><button class="tdah-close" type="button">Cerrar · Esc</button></div>';
    root.append(content);
    root.querySelector('.tdah-close').addEventListener('click', closeReader);
    document.documentElement.append(root);
    document.documentElement.style.overflow = 'hidden';
  }

  function closeReader() { root?.remove(); root = undefined; document.documentElement.style.overflow = ''; }
  function refresh() { if (root) openReader(currentSettings); }
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && root) closeReader(); });
  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message.type === 'GET_STATE') respond({ active: Boolean(root) });
    if (message.type === 'TOGGLE_READER') { root ? closeReader() : openReader(message.settings); respond({ active: Boolean(root) }); }
    if (message.type === 'SETTINGS_CHANGED') { currentSettings = { ...currentSettings, ...message.settings }; refresh(); respond({ active: Boolean(root) }); }
  });
})();
