(() => {
  const API_BASE = '/api';
  const CART_KEY = 'sushii_cart_v2';
  const LEGACY_CART_KEY = 'sushii_cart';
  const COOKIE_KEY = 'sushii_cookies';

  const state = {
    products: [],
    cart: [],
    isCartPage: false,
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const storage = {
    read(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (error) {
        console.warn('Impossible de lire depuis localStorage', error);
        return fallback;
      }
    },
    write(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn('Impossible d’écrire dans localStorage', error);
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn('Impossible de supprimer la clé', key, error);
      }
    },
  };

  function migrateLegacyCart() {
    const legacy = storage.read(LEGACY_CART_KEY, null);
    if (!Array.isArray(legacy)) {
      return null;
    }
    const migrated = legacy
      .map((item) => ({
        productId: Number(item.id ?? item.productId),
        quantity: Number(item.qty ?? item.quantity ?? 1),
      }))
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0);

    if (migrated.length > 0) {
      storage.write(CART_KEY, migrated);
    }
    storage.remove(LEGACY_CART_KEY);
    return migrated;
  }

  function loadCart() {
    const stored = storage.read(CART_KEY, null);
    if (Array.isArray(stored)) {
      return stored;
    }
    return migrateLegacyCart() ?? [];
  }

  function saveCart(cart) {
    storage.write(CART_KEY, cart);
    state.cart = cart;
    renderCartCount();
    if (state.isCartPage) {
      renderCartPage();
    }
  }

  function findProduct(productId) {
    return state.products.find((product) => product.id === productId);
  }

  function addToCart(productId, quantity = 1) {
    const product = findProduct(productId);
    if (!product) {
      alert("Ce produit n'est plus disponible.");
      return;
    }

    const nextCart = [...state.cart];
    const existing = nextCart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 25);
    } else {
      nextCart.push({ productId, quantity });
    }
    saveCart(nextCart);
    flashFeedback(`${product.name} ajouté au panier.`);
  }

  function updateQuantity(productId, delta) {
    const nextCart = state.cart
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(item.quantity + delta, 1), 25) }
          : item,
      )
      .filter((item) => item.quantity > 0);
    saveCart(nextCart);
  }

  function removeFromCart(productId) {
    const product = findProduct(productId);
    saveCart(state.cart.filter((item) => item.productId !== productId));
    if (product) {
      flashFeedback(`${product.name} retiré du panier.`);
    }
  }

  function flashFeedback(message) {
    const zone = $('#feedback');
    if (!zone) return;
    zone.textContent = message;
    zone.classList.add('is-visible');
    window.setTimeout(() => zone.classList.remove('is-visible'), 2200);
  }

  function renderProducts() {
    const container = $('#products');
    if (!container) return;

    if (state.products.length === 0) {
      container.innerHTML =
        '<p class="muted">Aucun produit disponible pour le moment. Merci de revenir plus tard.</p>';
      return;
    }

    const cards = state.products
      .map(
        (product) => `
        <article class="product-card" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="320" height="240">
          <div class="product-content">
            <header>
              <h3>${product.name}</h3>
              <p class="product-desc">${product.description ?? ''}</p>
            </header>
            <footer class="product-meta">
              <span class="product-price">${product.price.toFixed(2)} €</span>
              <button class="btn add-to-cart" data-product-id="${product.id}" type="button">
                Ajouter
              </button>
            </footer>
          </div>
        </article>`,
      )
      .join('');

    container.innerHTML = cards;
  }

  function cartWithProductDetails() {
    return state.cart
      .map((item) => {
        const product = findProduct(item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: item.quantity * product.price,
        };
      })
      .filter(Boolean);
  }

  function renderCartCount() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    $$('#cart-count').forEach((node) => {
      node.textContent = String(totalItems);
      node.setAttribute('aria-label', `${totalItems} article(s) dans le panier`);
    });
  }

  function renderCartPage() {
    const itemsContainer = $('#cart-items');
    const totalContainer = $('#cart-total');

    if (!itemsContainer || !totalContainer) {
      return;
    }

    const entries = cartWithProductDetails();
    if (entries.length === 0) {
      itemsContainer.innerHTML =
        '<p class="muted">Ton panier est vide pour le moment. Ajoute quelques plats !</p>';
      totalContainer.textContent = '0,00 €';
      return;
    }

    const html = entries
      .map(
        (entry) => `
        <article class="cart-line" data-product-id="${entry.productId}">
          <div class="cart-line-infos">
            <img src="${entry.product.image}" alt="${entry.product.name}" loading="lazy" width="96" height="72">
            <div>
              <h4>${entry.product.name}</h4>
              <p class="muted">${entry.product.price.toFixed(2)} € / pièce</p>
            </div>
          </div>
          <div class="cart-line-actions">
            <div class="cart-qty">
              <button type="button" class="btn-icon qty-dec" data-product-id="${entry.productId}" aria-label="Diminuer la quantité">−</button>
              <span aria-live="polite">${entry.quantity}</span>
              <button type="button" class="btn-icon qty-inc" data-product-id="${entry.productId}" aria-label="Augmenter la quantité">+</button>
            </div>
            <div class="cart-line-meta">
              <strong>${entry.lineTotal.toFixed(2)} €</strong>
              <button type="button" class="btn outline remove-item" data-product-id="${entry.productId}">
                Retirer
              </button>
            </div>
          </div>
        </article>`,
      )
      .join('');

    itemsContainer.innerHTML = html;

    const total = entries.reduce((sum, entry) => sum + entry.lineTotal, 0);
    totalContainer.textContent = `${total.toFixed(2)} €`;
  }

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Réponse API inattendue.');
      }
      const payload = await response.json();
      const products = Array.isArray(payload?.data) ? payload.data : [];
      state.products = products;
      renderProducts();
    } catch (error) {
      console.error('Erreur lors du chargement des produits', error);
      const container = $('#products');
      if (container) {
        container.innerHTML =
          '<p class="error">Impossible de récupérer le menu. Vérifie ta connexion et réessaie.</p>';
      }
    }
  }

  function handleCartClicks(event) {
    const addButton = event.target.closest('.add-to-cart');
    if (addButton) {
      const productId = Number(addButton.dataset.productId);
      if (Number.isInteger(productId)) {
        addToCart(productId, 1);
      }
      return;
    }

    const inc = event.target.closest('.qty-inc');
    if (inc) {
      const productId = Number(inc.dataset.productId);
      if (Number.isInteger(productId)) {
        updateQuantity(productId, 1);
      }
      return;
    }

    const dec = event.target.closest('.qty-dec');
    if (dec) {
      const productId = Number(dec.dataset.productId);
      if (Number.isInteger(productId)) {
        updateQuantity(productId, -1);
      }
      return;
    }

    const remove = event.target.closest('.remove-item');
    if (remove) {
      const productId = Number(remove.dataset.productId);
      if (Number.isInteger(productId)) {
        removeFromCart(productId);
      }
    }
  }

  async function sendOrder() {
    if (state.cart.length === 0) {
      alert('Ton panier est vide.');
      return;
    }

    const button = $('#checkout');
    if (button) {
      button.disabled = true;
      button.textContent = 'Envoi...';
    }

    try {
      const payload = {
        items: cartWithProductDetails().map((entry) => ({
          productId: entry.productId,
          quantity: entry.quantity,
        })),
      };
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error ?? 'La commande a échoué.');
      }
      storage.remove(CART_KEY);
      state.cart = [];
      renderCartCount();
      renderCartPage();
      alert(`Commande enregistrée ! Référence : ${result.orderRef}.`);
    } catch (error) {
      console.error('Erreur commande', error);
      alert(error.message || 'Erreur réseau.');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Passer la commande';
      }
    }
  }

  function initCheckout() {
    const checkoutButton = $('#checkout');
    if (!checkoutButton) return;
    checkoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      sendOrder();
    });
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const submit = $('button[type="submit"]', form);
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Envoi...';
      }

      try {
        const response = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data?.error ?? 'Impossible d’envoyer le message.');
        }
        form.reset();
        flashFeedback('Merci ! Nous te répondons sous 24h.');
      } catch (error) {
        console.error('Erreur contact', error);
        alert(error.message || 'Erreur réseau.');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Envoyer';
        }
      }
    });
  }

  function initCookieBanner() {
    const banner = $('#cookie-banner');
    if (!banner) return;

    const current = storage.read(COOKIE_KEY, null);
    if (current === 'accepted' || current === 'rejected') {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;

    $('#accept-cookies')?.addEventListener('click', () => {
      storage.write(COOKIE_KEY, 'accepted');
      banner.hidden = true;
      flashFeedback('Merci ! Cookies activés.');
    });

    $('#reject-cookies')?.addEventListener('click', () => {
      storage.write(COOKIE_KEY, 'rejected');
      banner.hidden = true;
      flashFeedback('Cookies désactivés.');
    });
  }

  function initGlobalListeners() {
    document.addEventListener('click', handleCartClicks);
  }

  async function bootstrap() {
    state.cart = loadCart();
    state.isCartPage = Boolean($('#cart-items'));
    initGlobalListeners();
    initCheckout();
    initContactForm();
    initCookieBanner();
    renderCartCount();
    if (state.isCartPage) {
      renderCartPage();
    }
    await fetchProducts();
    if (state.isCartPage) {
      renderCartPage();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch((error) => {
      console.error('Bootstrap front échoué', error);
    });
  });
})();