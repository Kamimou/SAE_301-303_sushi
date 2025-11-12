const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const CART_KEY_MIGRATION_NOTE =
  'Ancienne clé cart détectée. Le format attendu est désormais { items: [{ productId, quantity }] }.';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false }));

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8');
      return fallback;
    }
    throw error;
  }
}

async function writeJson(filePath, data) {
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, payload, 'utf8');
}

async function appendToStore(filePath, entry) {
  const collection = await readJson(filePath, []);
  collection.push(entry);
  await writeJson(filePath, collection);
  return entry;
}

async function loadProducts() {
  const products = await readJson(PRODUCTS_FILE, []);
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
}

function normalizeOrderPayload(body, products) {
  const payload = {
    customer: {
      name: body?.customer?.name?.trim?.().slice(0, 120) || 'Client invité',
      email: body?.customer?.email?.trim?.().slice(0, 160) || null,
      phone: body?.customer?.phone?.trim?.().slice(0, 32) || null,
    },
    notes: body?.notes?.trim?.().slice(0, 240) || null,
  };

  const rawItems = Array.isArray(body?.items)
    ? body.items
    : Array.isArray(body?.cart)
    ? body.cart.map((legacy) => ({
        productId: legacy.id ?? legacy.productId,
        quantity: legacy.qty ?? legacy.quantity,
        _legacy: true,
      }))
    : [];

  const validItems = rawItems
    .map((item) => ({
      productId: Number(item.productId ?? item.id),
      quantity: Number(item.quantity ?? item.qty ?? 1),
      _legacy: Boolean(item._legacy),
    }))
    .filter((item) => Number.isInteger(item.productId) && item.productId > 0)
    .map((item) => ({
      ...item,
      quantity: Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 1,
    }));

  const enrichedItems = validItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return null;
      }
      return {
        productId: product.id,
        quantity: Math.min(item.quantity, 25),
        unitPrice: product.price,
      };
    })
    .filter(Boolean);

  if (enrichedItems.length === 0) {
    throw Object.assign(new Error('Panier vide ou produits inconnus.'), { statusCode: 400 });
  }

  const total = enrichedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  if (total <= 0) {
    throw Object.assign(new Error('Total invalide.'), { statusCode: 400 });
  }

  return {
    ...payload,
    items: enrichedItems,
    total: Number(total.toFixed(2)),
  };
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get(
  '/api/products',
  asyncHandler(async (_req, res) => {
    const products = await loadProducts();
    res.json({ data: products });
  }),
);

app.post(
  '/api/orders',
  asyncHandler(async (req, res) => {
    const products = await loadProducts();
    const orderPayload = normalizeOrderPayload(req.body, products);

    const order = {
      ref: `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
      createdAt: new Date().toISOString(),
      ...orderPayload,
    };

    await appendToStore(ORDERS_FILE, order);

    const response = {
      success: true,
      orderRef: order.ref,
      total: order.total,
    };

    if (Array.isArray(req.body?.cart) && !Array.isArray(req.body?.items)) {
      response.message = CART_KEY_MIGRATION_NOTE;
    }

    res.status(201).json(response);
  }),
);

app.post(
  '/api/contact',
  asyncHandler(async (req, res) => {
    const name = req.body?.name?.trim?.().slice(0, 120);
    const email = req.body?.email?.trim?.().slice(0, 160);
    const message = req.body?.message?.trim?.();

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Champs requis manquants.' });
    }

    const entry = {
      id: crypto.randomUUID(),
      name,
      email,
      message: message.slice(0, 800),
      submittedAt: new Date().toISOString(),
    };

    await appendToStore(MESSAGES_FILE, entry);
    res.json({ success: true });
  }),
);

app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    maxAge: '4h',
  }),
);

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'Route API introuvable.' });
});

app.use((error, _req, res, _next) => {
  console.error('[API error]', error);
  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 500 ? 'Erreur serveur inattendue.' : error.message,
  });
});

async function start() {
  await readJson(ORDERS_FILE, []);
  await readJson(MESSAGES_FILE, []);

  const server = app.listen(PORT, () => {
    console.log(`Sushii API en ligne -> http://localhost:${PORT}`);
  });

  process.on('SIGTERM', () => server.close());
  process.on('SIGINT', () => server.close());
}

start().catch((error) => {
  console.error('Impossible de démarrer le serveur', error);
  process.exit(1);
});

