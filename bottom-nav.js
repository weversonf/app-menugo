/* =========================================================
   BOTTOM NAV — componente reusável Brasa & Cia
   Como usar em qualquer página:
   1) Incluir este arquivo: <script src="bottom-nav.js"></script>
   2) Logo no <body>, no fim, chamar: BottomNav.render('cardapio')
      Valores aceitos: 'cardapio' | 'carrinho' | 'fidelidade' | 'perfil'
   3) O componente injeta seu próprio CSS e HTML, e atualiza o
      badge do carrinho sozinho lendo localStorage (chave 'brasa_cart_count').
      Cada página é responsável por chamar BottomNav.setCartCount(n)
      sempre que o carrinho mudar, se quiser o badge atualizado ao vivo.
   ========================================================= */

(function (global) {
  "use strict";

  const ITEMS = [
    {
      id: "cardapio",
      label: "Cardápio",
      href: "index.html",
      icon: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v4H3z"></path><path d="M3 11h18v10H3z"></path><line x1="9" y1="15" x2="15" y2="15"></line></svg>`
    },
    {
      id: "carrinho",
      label: "Carrinho",
      href: "carrinho.html",
      icon: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
      badge: true
    },
    {
      id: "fidelidade",
      label: "Fidelidade",
      href: "fidelidade.html",
      icon: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
    },
    {
      id: "perfil",
      label: "Perfil",
      href: "perfil.html",
      icon: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    }
  ];

  const CSS = `
    .bnav-spacer{ height:78px; }
    .bnav{
      position:fixed; left:0; right:0; bottom:0; z-index:80;
      background:rgba(26,20,16,0.92);
      backdrop-filter:blur(14px);
      border-top:1px solid rgba(255,248,240,0.08);
      padding:8px 10px calc(8px + env(safe-area-inset-bottom));
      display:flex;
      justify-content:space-around;
      align-items:center;
    }
    .bnav-item{
      display:flex; flex-direction:column; align-items:center; gap:4px;
      flex:1;
      padding:6px 4px;
      color:#A89B8C;
      position:relative;
      border-radius:12px;
      transition:color 0.15s;
      font-family:'Inter', sans-serif;
      text-decoration:none;
      background:none; border:none; cursor:pointer;
    }
    .bnav-item svg{ transition:transform 0.15s; }
    .bnav-item:hover{ color:#FFF8F0; }
    .bnav-item.active{ color:#FF6B35; }
    .bnav-item.active svg{ transform:translateY(-2px); }
    .bnav-label{ font-size:10.5px; font-weight:700; letter-spacing:0.01em; }
    .bnav-dot{
      position:absolute; top:2px; right:calc(50% - 16px);
      width:7px; height:7px; border-radius:50%;
      background:#FF6B35;
      border:2px solid #1A1410;
    }
    .bnav-badge{
      position:absolute; top:0px; right:calc(50% - 18px);
      background:#FF6B35; color:#1A1410;
      font-family:'JetBrains Mono', monospace;
      font-size:10px; font-weight:800;
      min-width:16px; height:16px; border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      padding:0 3px;
      border:2px solid #1A1410;
    }
  `;

  function injectCSS() {
    if (document.getElementById("bnav-styles")) return;
    const style = document.createElement("style");
    style.id = "bnav-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function getCartCount() {
    try {
      return parseInt(global.localStorage.getItem("brasa_cart_count") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function buildHTML(activeId) {
    const cartCount = getCartCount();
    const itemsHTML = ITEMS.map((item) => {
      const isActive = item.id === activeId;
      let badgeHTML = "";
      if (item.badge && cartCount > 0) {
        badgeHTML = `<span class="bnav-badge" id="bnavCartBadge">${cartCount}</span>`;
      }
      return `
        <a href="${item.href}" class="bnav-item ${isActive ? "active" : ""}" aria-current="${isActive ? "page" : "false"}">
          ${item.icon}
          ${badgeHTML}
          <span class="bnav-label">${item.label}</span>
        </a>
      `;
    }).join("");

    return `
      <div class="bnav-spacer" aria-hidden="true"></div>
      <nav class="bnav" aria-label="Navegação principal">
        ${itemsHTML}
      </nav>
    `;
  }

  function render(activeId) {
    injectCSS();
    const mount = document.createElement("div");
    mount.innerHTML = buildHTML(activeId);
    document.body.appendChild(mount.querySelector(".bnav-spacer"));
    document.body.appendChild(mount.querySelector(".bnav"));
  }

  function setCartCount(n) {
    try {
      global.localStorage.setItem("brasa_cart_count", String(n));
    } catch (e) {}
    const badge = document.getElementById("bnavCartBadge");
    const cartLink = document.querySelector('.bnav-item[href="carrinho.html"]');
    if (n > 0) {
      if (badge) {
        badge.textContent = n;
      } else if (cartLink) {
        const span = document.createElement("span");
        span.className = "bnav-badge";
        span.id = "bnavCartBadge";
        span.textContent = n;
        cartLink.appendChild(span);
      }
    } else if (badge) {
      badge.remove();
    }
  }

  global.BottomNav = { render, setCartCount };
})(window);
