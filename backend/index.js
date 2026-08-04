import express from 'express';
import cors from 'cors';
import { db, initSchema } from './db.js';
import { tractorImage, implementImage, newsImage, videoImage, usedImage } from './img.js';

const app = express();
app.use(cors());
app.use(express.json());

initSchema();

const PORT = process.env.PORT || 3001;
const brandColors = {};
function getBrandColor(brandId) {
  if (brandColors[brandId]) return brandColors[brandId];
  const b = db.prepare('SELECT color FROM brands WHERE id = ?').get(brandId);
  const c = b ? b.color : '#0f6b00';
  brandColors[brandId] = c;
  return c;
}

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const withImg = (row, type) => (row ? { ...row, image: row.image || `/img/${type}/${row.slug ?? row.id}` } : row);

const queryTractors = (q) => {
  let sql = `
    SELECT t.*, b.name AS brand_name, b.slug AS brand_slug, b.color AS brand_color
    FROM tractors t JOIN brands b ON b.id = t.brand_id WHERE 1=1`;
  const params = [];
  const add = (clause, val) => { sql += clause; params.push(val); };

  if (q.brand) add(' AND b.slug = ?', q.brand);
  if (q.minHp) add(' AND t.hp >= ?', Number(q.minHp));
  if (q.maxHp) add(' AND t.hp <= ?', Number(q.maxHp));
  if (q.minPrice) add(' AND t.price >= ?', Number(q.minPrice));
  if (q.maxPrice) add(' AND t.price <= ?', Number(q.maxPrice));
  if (q.fuel) add(' AND t.fuel = ?', q.fuel);
  if (q.drive) add(' AND t.drive LIKE ?', `%${q.drive}%`);
  if (q.q) {
    sql += ' AND (t.name LIKE ? OR t.category LIKE ? OR t.fuel LIKE ?)';
    params.push(`%${q.q}%`, `%${q.q}%`, `%${q.q}%`);
  }
  if (q.popular) add(' AND t.is_popular = 1', null);
  if (q.latest) add(' AND t.is_latest = 1', null);
  if (q.mini === '1') add(' AND t.is_mini = 1', null);
  if (q.category) add(' AND t.category = ?', q.category);

  sql += ' ORDER BY t.is_popular DESC, t.hp DESC, t.name ASC';
  const rows = db.prepare(sql).all(...params.filter((p) => p !== null));
  return rows.map((r) => withImg(r, 'tractor'));
};

// ---------------- Public API ----------------

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/brands', (req, res) => {
  const rows = db.prepare(`
    SELECT b.*, (SELECT COUNT(*) FROM tractors t WHERE t.brand_id = b.id) AS model_count
    FROM brands b ORDER BY b.name`).all();
  res.json(rows);
});

app.get('/api/brands/:slug', (req, res) => {
  const brand = db.prepare('SELECT * FROM brands WHERE slug = ?').get(req.params.slug);
  if (!brand) return res.status(404).json({ error: 'Brand not found' });
  const tractors = db.prepare('SELECT * FROM tractors WHERE brand_id = ? ORDER BY hp DESC').all(brand.id).map((r) => withImg(r, 'tractor'));
  res.json({ ...brand, tractors });
});

app.get('/api/tractors', (req, res) => res.json(queryTractors(req.query)));

app.get('/api/tractors/:slug', (req, res) => {
  const row = db.prepare(`
    SELECT t.*, b.name AS brand_name, b.slug AS brand_slug, b.color AS brand_color
    FROM tractors t JOIN brands b ON b.id = t.brand_id WHERE t.slug = ?`).get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Tractor not found' });
  const related = db.prepare('SELECT * FROM tractors WHERE brand_id = ? AND id != ? LIMIT 4').all(row.brand_id, row.id).map((r) => withImg(r, 'tractor'));
  res.json({ ...withImg(row, 'tractor'), features: JSON.parse(row.features || '[]'), related });
});

app.get('/api/implements/categories', (req, res) => {
  const rows = db.prepare('SELECT category, COUNT(*) AS count FROM implements GROUP BY category ORDER BY count DESC').all();
  res.json(rows);
});

app.get('/api/implements', (req, res) => {
  let sql = 'SELECT * FROM implements WHERE 1=1';
  const params = [];
  if (req.query.category) { sql += ' AND category = ?'; params.push(req.query.category); }
  sql += ' ORDER BY category, name';
  const rows = db.prepare(sql).all(...params).map((r) => withImg(r, 'implement'));
  res.json(rows);
});

app.get('/api/implements/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM implements WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Implement not found' });
  const similar = db.prepare('SELECT * FROM implements WHERE category = ? AND id != ? LIMIT 4').all(row.category, row.id).map((r) => withImg(r, 'implement'));
  res.json({ ...withImg(row, 'implement'), similar });
});

app.get('/api/used', (req, res) => {
  let sql = 'SELECT * FROM used_listings WHERE status = ?';
  const params = ["For Sell"];
  if (req.query.q) { sql += ' AND (title LIKE ? OR brand LIKE ? OR model LIKE ? OR location LIKE ? OR state LIKE ?)'; const l = `%${req.query.q}%`; params.push(l, l, l, l, l); }
  if (req.query.state) { sql += ' AND state = ?'; params.push(req.query.state); }
  sql += ' ORDER BY created_at DESC';
  const rows = db.prepare(sql).all(...params).map((r) => withImg(r, 'used'));
  res.json(rows);
});

app.get('/api/used/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM used_listings WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Listing not found' });
  res.json(withImg(row, 'used'));
});

app.get('/api/news', (req, res) => {
  const rows = db.prepare('SELECT id, title, slug, excerpt, date FROM news ORDER BY date DESC').all().map((r) => withImg(r, 'news'));
  res.json(rows);
});

app.get('/api/news/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM news WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Article not found' });
  const more = db.prepare('SELECT id, title, slug, excerpt, date FROM news WHERE slug != ? ORDER BY date DESC LIMIT 5').all(req.params.slug).map((r) => withImg(r, 'news'));
  res.json({ ...withImg(row, 'news'), more });
});

app.get('/api/videos', (req, res) => {
  const rows = db.prepare('SELECT * FROM videos ORDER BY views DESC').all().map((r) => withImg(r, 'video'));
  res.json(rows);
});

app.get('/api/dealers', (req, res) => {
  let sql = 'SELECT * FROM dealers WHERE 1=1';
  const params = [];
  if (req.query.state) { sql += ' AND state = ?'; params.push(req.query.state); }
  if (req.query.city) { sql += ' AND city LIKE ?'; params.push(`%${req.query.city}%`); }
  if (req.query.brand) { sql += ' AND brand = ?'; params.push(req.query.brand); }
  sql += ' ORDER BY rating DESC, name';
  res.json(db.prepare(sql).all(...params));
});

app.get('/api/dealers/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM dealers WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Dealer not found' });
  res.json(row);
});

app.get('/api/states', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT state FROM dealers ORDER BY state').all();
  const usedStates = db.prepare('SELECT DISTINCT state FROM used_listings ORDER BY state').all();
  const set = new Set([...rows.map((r) => r.state), ...usedStates.map((r) => r.state)]);
  res.json([...set].sort());
});

app.get('/api/emi', (req, res) => {
  const amount = Number(req.query.amount) || 0;
  const tenure = Number(req.query.tenure) || 1;
  const rate = Number(req.query.rate) || 10;
  const P = amount;
  const n = tenure * 12;
  const r = rate / 12 / 100;
  let emi = 0;
  if (P > 0 && n > 0) {
    emi = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
  }
  const total = emi * n;
  const interest = total - P;
  res.json({ amount: P, tenure, rate, monthlyEmi: Math.round(emi), totalPayment: Math.round(total), totalInterest: Math.round(Math.max(interest, 0)) });
});

app.post('/api/sell-requests', (req, res) => {
  const { name, phone, brand, model, year, expected_price, location, state, hours, condition, notes } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  const info = db.prepare(`
    INSERT INTO sell_requests (name, phone, brand, model, year, expected_price, location, state, hours, condition, notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    name, phone, brand || '', model || '', year || 0, expected_price || 0, location || '', state || '',
    hours || 0, condition || '', notes || '');
  res.status(201).json({ id: info.lastInsertRowid, message: 'Sell request submitted successfully' });
});

app.post('/api/leads', (req, res) => {
  const { name, phone, message, page } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  const info = db.prepare('INSERT INTO leads (name, phone, message, page) VALUES (?,?,?,?)').run(name, phone, message || '', page || '');
  res.status(201).json({ id: info.lastInsertRowid, message: 'Thank you! We will contact you soon.' });
});

// ---------------- SVG image endpoints ----------------

app.get('/img/tractor/:slug', (req, res) => {
  const row = db.prepare('SELECT t.name, t.slug, b.color FROM tractors t JOIN brands b ON b.id = t.brand_id WHERE t.slug = ?').get(req.params.slug);
  const color = row ? row.color : '#0f6b00';
  res.set('Content-Type', 'image/svg+xml').set('Cache-Control', 'public, max-age=86400');
  res.send(tractorImage(row ? row.name : req.params.slug, color));
});

app.get('/img/implement/:slug', (req, res) => {
  const row = db.prepare('SELECT name, category, slug FROM implements WHERE slug = ?').get(req.params.slug);
  res.set('Content-Type', 'image/svg+xml').set('Cache-Control', 'public, max-age=86400');
  res.send(implementImage(row ? row.name : req.params.slug, row ? row.category : 'Cultivator'));
});

app.get('/img/news/:slug', (req, res) => {
  const row = db.prepare('SELECT title, slug FROM news WHERE slug = ?').get(req.params.slug);
  res.set('Content-Type', 'image/svg+xml').set('Cache-Control', 'public, max-age=86400');
  res.send(newsImage(row ? row.title : req.params.slug));
});

app.get('/img/video/:slug', (req, res) => {
  const row = db.prepare('SELECT title, id FROM videos WHERE id = ?').get(req.params.slug);
  res.set('Content-Type', 'image/svg+xml').set('Cache-Control', 'public, max-age=86400');
  res.send(videoImage(row ? row.title : `Video ${req.params.slug}`));
});

app.get('/img/used/:slug', (req, res) => {
  const row = db.prepare('SELECT title, id FROM used_listings WHERE id = ?').get(req.params.slug);
  res.set('Content-Type', 'image/svg+xml').set('Cache-Control', 'public, max-age=86400');
  res.send(usedImage(row ? row.title : `Listing ${req.params.slug}`));
});

// ---------------- Admin endpoints ----------------

app.get('/api/admin/dashboard', (req, res) => {
  const count = (t) => db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c;
  res.json({
    brands: count('brands'), tractors: count('tractors'), implements: count('implements'),
    used: count('used_listings'), sell_requests: count('sell_requests'), news: count('news'),
    videos: count('videos'), dealers: count('dealers'), leads: count('leads'),
    pendingSell: db.prepare("SELECT COUNT(*) c FROM sell_requests WHERE status = 'New'").get().c,
    recentSellRequests: db.prepare('SELECT * FROM sell_requests ORDER BY created_at DESC LIMIT 5').all(),
    recentLeads: db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5').all()
  });
});

const CRUD = (base, table, allowed) => {
  const cols = allowed.join(',');
  const placeholders = allowed.map((c) => `@${c}`).join(',');
  const updateSet = allowed.map((c) => `${c} = @${c}`).join(', ');

  app.get(`${base}`, (req, res) => {
    res.json(db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all());
  });
  app.post(`${base}`, (req, res) => {
    const data = {};
    for (const c of allowed) data[c] = req.body[c] ?? null;
    if (table === 'tractors' && !data.slug) data.slug = slugify(data.name);
    if (table === 'brands' && !data.slug) data.slug = slugify(data.name);
    if (table === 'implements' && !data.slug) data.slug = slugify(data.name);
    if (table === 'news' && !data.slug) data.slug = slugify(data.title);
    if (table === 'dealers' && !data.slug) data.slug = slugify(data.name);
    const info = db.prepare(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`).run(data);
    res.status(201).json({ id: info.lastInsertRowid, ...data });
  });
  app.put(`${base}/:id`, (req, res) => {
    const data = { id: req.params.id };
    for (const c of allowed) data[c] = req.body[c] ?? null;
    if (table === 'tractors' && !data.slug) data.slug = slugify(data.name);
    if (table === 'brands' && !data.slug) data.slug = slugify(data.name);
    if (table === 'implements' && !data.slug) data.slug = slugify(data.name);
    if (table === 'news' && !data.slug) data.slug = slugify(data.title);
    if (table === 'dealers' && !data.slug) data.slug = slugify(data.name);
    db.prepare(`UPDATE ${table} SET ${updateSet} WHERE id = @id`).run(data);
    res.json({ id: Number(req.params.id), ...data });
  });
  app.delete(`${base}/:id`, (req, res) => {
    const info = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    res.json({ deleted: info.changes > 0 });
  });
};

const adminTables = {
  brands: ['name', 'slug', 'country', 'color', 'description', 'is_mini', 'logo'],
  tractors: ['brand_id', 'name', 'slug', 'price', 'hp', 'cylinders', 'lift_capacity', 'engine', 'fuel', 'drive', 'power_takeoff', 'transmission', 'fuel_tank', 'tyres', 'weight', 'warranty', 'category', 'is_mini', 'is_latest', 'is_popular', 'description', 'features'],
  implements: ['category', 'name', 'slug', 'price', 'description'],
  used_listings: ['brand', 'model', 'title', 'price', 'year', 'hours', 'location', 'state', 'owner', 'phone', 'description', 'status'],
  news: ['title', 'slug', 'excerpt', 'body', 'date'],
  videos: ['title', 'youtube_id', 'views', 'duration', 'type'],
  dealers: ['name', 'slug', 'brand', 'city', 'state', 'address', 'phone', 'email', 'rating']
};

for (const [table, cols] of Object.entries(adminTables)) {
  CRUD(`/api/admin/${table}`, table, cols);
}

app.get('/api/admin/sell-requests', (req, res) => {
  res.json(db.prepare('SELECT * FROM sell_requests ORDER BY created_at DESC').all());
});
app.patch('/api/admin/sell-requests/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE sell_requests SET status = ? WHERE id = ?').run(status || 'New', req.params.id);
  res.json({ id: Number(req.params.id), status });
});
app.delete('/api/admin/sell-requests/:id', (req, res) => {
  const info = db.prepare('DELETE FROM sell_requests WHERE id = ?').run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

app.get('/api/admin/leads', (req, res) => {
  res.json(db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all());
});
app.delete('/api/admin/leads/:id', (req, res) => {
  const info = db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`KhetiHub API running on http://localhost:${PORT}`));
