'use strict';

// ── Icon paths (24×24 viewBox) ────────────────────────────────────────────

const BIRD_PATH =
  'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z';

// (HASH_PATH no longer used — explore icon uses SVG text instead)

// Old Twitter home icon (outline with door cutout, fill-rule:evenodd)
const HOME_PATH =
  'M22.58 7.29L12.475.19a.75.75 0 00-.95 0L1.42 7.29A1.75 1.75 0 00.75 8.68v12.57c0 .966.784 1.75 1.75 1.75H9c.414 0 .75-.336.75-.75v-5.5c0-.414.336-.75.75-.75h3c.414 0 .75.336.75.75v5.5c0 .414.336.75.75.75H21.5c.966 0 1.75-.784 1.75-1.75V8.68c0-.522-.23-1.015-.67-1.39z';

// Rounded envelope, narrower (corner radius 2, CSS stroke rendering)
const DM_PATH = 'M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2zM3 8l9 6 9-6';

// Two people icon (community) — outline style for nav
const COMMUNITY_ICON_PATH =
  'M7 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm10 0c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM7 10c-2.761 0-5 1.79-5 4v3h10v-3c0-2.21-2.239-4-5-4zm10 0c-2.761 0-5 1.79-5 4v3h10v-3c0-2.21-2.239-4-5-4z';

const X_PATH_PREFIX = 'M18.244 2.25h3.308';

// ── Text replacements ─────────────────────────────────────────────────────
const TEXT_REPLACEMENTS = [
  ['引用ポスト',              '引用ツイート'],
  ['リポスト',                'リツイート'],
  ['ポストする',              'ツイートする'],
  ['ポストを作成',            'ツイートを作成'],
  ['ポストを下書き保存',      'ツイートを下書き保存'],
  ['ポストを送信',            'ツイートを送信'],
  ['ポスト',                  'ツイート'],
  ['チャット',                'メッセージ'],
  ['「いま」を見つけよう',    'いまどうしてる？'],
  ['いまを見つけよう',        'いまどうしてる？'],
  ['設定とプライバシー',      '設定とサポート'],
  ['Settings and privacy',    'Settings and support'],
];

const HIDE_HREFS      = ['/premium', '/i/creator-studio', '/i/creator_studio', '/creator_studio', '/creator-studio'];
const HIDE_NAV_LABELS = ['クリエイタースタジオ', 'Creator Studio'];

// Items to hide from もっと見る dropdown (by text label)
const HIDE_DROPDOWN_LABELS = ['コミュニティ', 'Communities', 'ビジネスと広告', 'ビジネス', '広告', 'Business', 'Ads'];

const PREMIUM_TITLES = ['プレミアムにサブスクライブ', 'プレミアムにアップグレード', 'Subscribe to Premium', 'Subscribe to X Premium', 'Upgrade to Premium', 'Upgrade to X Premium'];

// =========================================================================
// LOGO
// =========================================================================
function replaceLogos() {
  for (const p of document.querySelectorAll('svg path')) {
    if (p.getAttribute('d')?.startsWith(X_PATH_PREFIX)) {
      p.setAttribute('d', BIRD_PATH);
      const svg = p.closest('svg');
      if (svg) { svg.style.color = '#1DA1F2'; svg.style.fill = '#1DA1F2'; }
    }
  }
  for (const sel of ['a[aria-label="X"]', 'a[aria-label="X ホームへ移動"]', 'a[href="/home"][role="link"]']) {
    for (const anchor of document.querySelectorAll(sel)) {
      if (anchor.closest('nav')) continue;
      const svg = anchor.querySelector('svg');
      if (!svg) continue;
      const p = svg.querySelector('path');
      if (p && p.getAttribute('d') !== BIRD_PATH) {
        svg.innerHTML = `<path d="${BIRD_PATH}"/>`;
        svg.style.color = '#1DA1F2';
        svg.style.fill = '#1DA1F2';
      }
    }
  }
}

// =========================================================================
// EXPLORE "#" ICON — replace with system-font text for authentic look
// =========================================================================
function replaceExploreIcon() {
  for (const link of document.querySelectorAll('a[href="/explore"], a[href="/search"]')) {
    for (const svg of link.querySelectorAll('svg')) {
      const alreadyDone = !!svg.querySelector('text[data-tw-hash]');
      const hasPaths    = !!svg.querySelector('path');

      if (alreadyDone && !hasPaths) continue;          // already replaced, nothing to do
      if (alreadyDone && hasPaths) {                   // React re-added paths — remove them
        svg.querySelectorAll('path').forEach(p => p.remove());
        continue;
      }
      if (!hasPaths) continue;                         // empty/unknown state, skip

      // Replace all paths with a text "#"
      svg.querySelectorAll('path').forEach(p => p.remove());
      svg.setAttribute('viewBox', '0 0 24 24');
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '12');
      t.setAttribute('y', '12');
      t.setAttribute('dominant-baseline', 'central');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-size', '22');
      t.setAttribute('font-weight', '500');
      t.setAttribute('fill', 'currentColor');
      t.setAttribute('font-family', "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif");
      t.setAttribute('data-tw-hash', '1');
      t.textContent = '#';
      svg.appendChild(t);
    }
  }
}

// =========================================================================
// HOME + DM NAV ICONS
// =========================================================================
function replaceNavIcons() {
  for (const link of document.querySelectorAll('nav a[href="/home"]')) {
    for (const p of link.querySelectorAll('svg path')) {
      if (p.getAttribute('d') !== HOME_PATH) {
        p.setAttribute('d', HOME_PATH);
        p.setAttribute('fill-rule', 'evenodd');
        p.setAttribute('clip-rule', 'evenodd');
      }
    }
  }
  const dmLinks = new Set([
    ...document.querySelectorAll('nav a[href="/messages"]'),
    ...document.querySelectorAll('nav a[href="/dms"]'),
    ...document.querySelectorAll('a[data-testid="AppTabBar_DirectMessage_Link"]'),
    ...document.querySelectorAll('a[href="/messages"]'),
  ]);
  for (const link of dmLinks) {
    for (const p of link.querySelectorAll('svg path')) {
      if (p.getAttribute('d') !== DM_PATH) {
        p.setAttribute('d', DM_PATH);
        p.closest('svg')?.setAttribute('data-tw-dm', '1');
      }
    }
  }
}

// =========================================================================
// COMMUNITY NAV ITEM — inject after 話題を検索 in the main nav
// =========================================================================
const COMMUNITY_HREF = '/reimu_7120/communities/explore';

// Find the direct child of <nav> that contains the given link
function navRowOf(link) {
  let row = link;
  while (row.parentElement) {
    if (row.parentElement.tagName === 'NAV') return row;
    row = row.parentElement;
  }
  return null;
}

function addCommunityNavItem() {
  // Already injected?
  if (document.querySelector('[data-tw-community-nav]')) return;

  // Insertion anchor: the explore row
  const exploreLink =
    document.querySelector('nav a[href="/explore"]') ||
    document.querySelector('nav a[href="/search"]');
  if (!exploreLink) return;
  const exploreRow = navRowOf(exploreLink);
  if (!exploreRow) return;

  // Clone source: a CLEAN nav row with a normal path icon (NOT explore/home/messages
  // which we have modified). This keeps the community icon perfectly aligned and
  // decoupled from the "#" explore icon.
  const cleanLink =
    document.querySelector('nav a[href="/i/bookmarks"]') ||
    document.querySelector('nav a[href="/bookmarks"]') ||
    document.querySelector('nav a[href$="/notifications"]') ||
    document.querySelector('nav a[href*="/communities"]');
  const sourceRow = cleanLink ? navRowOf(cleanLink) : exploreRow;
  if (!sourceRow) return;

  // Clone the clean row
  const clone = sourceRow.cloneNode(true);
  clone.setAttribute('data-tw-community-nav', '1');
  clone.removeAttribute('data-tw-checked');

  // Fix the link
  const cloneLink = clone.tagName === 'A' ? clone : clone.querySelector('a');
  if (!cloneLink) return;
  cloneLink.setAttribute('href', COMMUNITY_HREF);
  cloneLink.removeAttribute('aria-current');
  cloneLink.removeAttribute('aria-label');

  // Replace icon: keep the source SVG's native sizing/viewBox, only swap the path(s)
  for (const svg of clone.querySelectorAll('svg')) {
    svg.setAttribute('data-tw-community-svg', '1');
    svg.querySelectorAll('text').forEach(t => t.remove());
    const g = svg.querySelector('g');
    const container = g || svg;
    container.innerHTML = `<path d="${COMMUNITY_ICON_PATH}"/>`;
  }

  // Remove any notification/badge counters carried over from the source row
  clone.querySelectorAll('[aria-label][data-testid]').forEach(el => {
    if (/通知|notification/i.test(el.getAttribute('aria-label') || '')) el.remove();
  });

  // Fix label text — replace the first non-empty leaf span's text
  for (const span of clone.querySelectorAll('span')) {
    if (span.children.length === 0 && span.textContent.trim()) {
      span.textContent = 'コミュニティ';
      break;
    }
  }

  // Insert right after the explore row
  exploreRow.after(clone);

  updateCommunityIcons();
}

// =========================================================================
// UPDATE COMMUNITY ICONS — keep the single community path correct
// =========================================================================
function updateCommunityIcons() {
  for (const svg of document.querySelectorAll('svg[data-tw-community-svg]')) {
    const paths = svg.querySelectorAll('path');
    // Exactly one path with the right d → nothing to do
    if (paths.length === 1 && paths[0].getAttribute('d') === COMMUNITY_ICON_PATH) continue;
    // Otherwise rebuild: one path inside the <g> (or svg) container
    const container = svg.querySelector('g') || svg;
    container.innerHTML = `<path d="${COMMUNITY_ICON_PATH}"/>`;
  }
}

// =========================================================================
// HIDE DROPDOWN ITEMS (もっと見る menu)
// =========================================================================
function hideDropdownItems() {
  for (const menu of document.querySelectorAll('[role="menu"], [data-testid="Dropdown"]')) {
    for (const link of menu.querySelectorAll('a')) {
      const text = link.textContent.trim();
      if (!HIDE_DROPDOWN_LABELS.some(l => text === l || text.startsWith(l))) continue;
      const row = link.parentElement !== menu ? link.parentElement : link;
      row.style.display = 'none';
    }
  }
}

// =========================================================================
// SEARCH PLACEHOLDER
// =========================================================================
function fixSearchPlaceholders() {
  for (const input of document.querySelectorAll('input[placeholder]')) {
    if (input.getAttribute('placeholder') === '検索') {
      input.setAttribute('placeholder', 'キーワードを検索');
    }
  }
}

// =========================================================================
// HIDE NAV ITEMS (Premium, Creator Studio)
// =========================================================================
function hideNavItems() {
  for (const link of document.querySelectorAll('nav a[role="link"]:not([data-tw-checked])')) {
    link.setAttribute('data-tw-checked', '1');
    const href  = link.getAttribute('href') || '';
    const label = link.querySelector('span[dir]')?.textContent?.trim() || link.textContent.trim();
    const hide  =
      HIDE_HREFS.some(h => href === h || href.startsWith(h + '/')) ||
      HIDE_NAV_LABELS.some(t => label === t);
    if (!hide) continue;
    const row = link.parentElement;
    const target = (row && row.tagName !== 'NAV' && row.tagName !== 'BODY') ? row : link;
    target.style.display = 'none';
  }
}

// =========================================================================
// HIDE PREMIUM BANNERS
// =========================================================================
function hidePremiumBanners() {
  ['subscribeToPremiumCard','premiumSubscribeCard','premiumSignup','PremiumSubscribeBanner','inlinePrompt']
    .forEach(id => document.querySelectorAll(`[data-testid="${id}"]`).forEach(el => { el.style.display = 'none'; }));

  document.querySelectorAll('a[href="/i/premium_sign_up"]').forEach(a => a.setAttribute('data-tw-hidden','1'));

  for (const leaf of document.querySelectorAll('span, div[dir="auto"]')) {
    if (leaf.children.length > 0) continue;
    if (!PREMIUM_TITLES.includes(leaf.textContent.trim())) continue;
    if (leaf.dataset.twBannerChecked) continue;
    leaf.dataset.twBannerChecked = '1';
    let card = null, el = leaf.parentElement;
    for (let i = 0; i < 3 && el; i++) {
      if (['BODY','MAIN','ASIDE','NAV','HEADER'].includes(el.tagName)) break;
      if (el.getAttribute('data-testid') && el.children.length <= 6) { card = el; break; }
      el = el.parentElement;
    }
    if (card && !card.dataset.twBannerHidden) { card.dataset.twBannerHidden = '1'; card.style.display = 'none'; }
  }
}

// =========================================================================
// TEXT REPLACEMENT
// =========================================================================
function replaceTextNode(node) {
  let text = node.nodeValue, changed = false;
  for (const [from, to] of TEXT_REPLACEMENTS) {
    if (text.includes(from)) { text = text.split(from).join(to); changed = true; }
  }
  if (changed) node.nodeValue = text;
}

const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT']);

function walkText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      return SKIP_TAGS.has(n.parentElement?.tagName)
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  let n;
  while ((n = walker.nextNode())) replaceTextNode(n);
}

// =========================================================================
// TITLE & FAVICON
// =========================================================================
function fixTitle() {
  const t = document.title;
  if (t === 'X')                  document.title = 'Twitter';
  else if (t.endsWith('/ X'))     document.title = t.slice(0,-1) + 'Twitter';
  else if (t.endsWith('on X'))    document.title = t.slice(0,-1) + 'Twitter';
  else if (t.includes('さんのX')) document.title = t.replace('さんのX','さんのTwitter');
}

function fixFavicon() {
  const d = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#1DA1F2" d="${BIRD_PATH}"/></svg>`
  );
  document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
  const lnk = Object.assign(document.createElement('link'),
    { rel:'icon', type:'image/svg+xml', href:'data:image/svg+xml,'+d });
  document.head.appendChild(lnk);
}

// =========================================================================
// SCHEDULED UPDATE
// =========================================================================
let rafId = null;
function scheduleUpdate() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    replaceLogos(); replaceExploreIcon(); replaceNavIcons();
    addCommunityNavItem(); updateCommunityIcons(); hideNavItems(); hideDropdownItems();
    hidePremiumBanners(); fixSearchPlaceholders(); fixTitle();
  });
}

// =========================================================================
// MUTATION OBSERVER
// =========================================================================
const observer = new MutationObserver(mutations => {
  for (const mut of mutations) {
    for (const node of mut.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE)  walkText(node);
      else if (node.nodeType === Node.TEXT_NODE) replaceTextNode(node);
    }
    if (mut.type === 'characterData') replaceTextNode(mut.target);
  }
  scheduleUpdate();
});

// =========================================================================
// BOOTSTRAP
// =========================================================================
function init() {
  replaceLogos(); replaceExploreIcon(); replaceNavIcons();
  addCommunityNavItem(); hideNavItems(); hideDropdownItems();
  hidePremiumBanners(); fixSearchPlaceholders();
  walkText(document.body);
  fixTitle(); fixFavicon();
  observer.observe(document.body, { childList:true, subtree:true, characterData:true });
  const t = document.querySelector('title');
  if (t) observer.observe(t, { childList:true, characterData:true, subtree:true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
