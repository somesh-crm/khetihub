import { db, initSchema } from './db.js';
import { brands, tractors, implementsData, usedListings, news, videos, dealers } from './data/seed-data.js';

initSchema();

const seed = () => {
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM sell_requests').run();
    db.prepare('DELETE FROM leads').run();
    db.prepare('DELETE FROM dealers').run();
    db.prepare('DELETE FROM videos').run();
    db.prepare('DELETE FROM news').run();
    db.prepare('DELETE FROM used_listings').run();
    db.prepare('DELETE FROM implements').run();
    db.prepare('DELETE FROM tractors').run();
    db.prepare('DELETE FROM brands').run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('brands','tractors','implements','used_listings','sell_requests','news','videos','dealers','leads')").run();

    const insBrand = db.prepare('INSERT INTO brands (name, slug, country, color, description, is_mini) VALUES (@name, @slug, @country, @color, @description, @is_mini)');
    const brandIdMap = {};
    for (const b of brands) {
      const info = insBrand.run({ ...b });
      brandIdMap[b.slug] = info.lastInsertRowid;
    }

    const insTractor = db.prepare(`
      INSERT INTO tractors (brand_id, name, slug, price, hp, cylinders, lift_capacity, engine, fuel, drive,
        power_takeoff, transmission, fuel_tank, tyres, weight, warranty, category, is_mini, is_latest, is_popular, description, features)
      VALUES (@brand_id, @name, @slug, @price, @hp, @cylinders, @lift_capacity, @engine, @fuel, @drive,
        @power_takeoff, @transmission, @fuel_tank, @tyres, @weight, @warranty, @category, @is_mini, @is_latest, @is_popular, @description, @features)
    `);
    for (const t of tractors) {
      insTractor.run({
        brand_id: brandIdMap[t.brand],
        name: t.name, slug: t.slug, price: t.price, hp: t.hp, cylinders: t.cylinders,
        lift_capacity: t.lift_capacity, engine: t.engine, fuel: t.fuel, drive: t.drive,
        power_takeoff: t.power_takeoff, transmission: t.transmission, fuel_tank: t.fuel_tank,
        tyres: t.tyres, weight: t.weight, warranty: t.warranty, category: t.category,
        is_mini: t.is_mini || 0, is_latest: t.is_latest || 0, is_popular: t.is_popular || 0,
        description: t.description, features: t.features
      });
    }

    const insImpl = db.prepare('INSERT INTO implements (category, name, slug, price, description) VALUES (@category, @name, @slug, @price, @description)');
    for (const i of implementsData) insImpl.run(i);

    const insUsed = db.prepare('INSERT INTO used_listings (brand, model, title, price, year, hours, location, state, owner, phone, description, status) VALUES (@brand, @model, @title, @price, @year, @hours, @location, @state, @owner, @phone, @description, @status)');
    for (const u of usedListings) insUsed.run({ ...u, status: 'For Sell' });

    const insNews = db.prepare('INSERT INTO news (title, slug, excerpt, body, date) VALUES (@title, @slug, @excerpt, @body, @date)');
    for (const n of news) insNews.run(n);

    const insVideo = db.prepare('INSERT INTO videos (title, youtube_id, views, duration, type) VALUES (@title, @youtube_id, @views, @duration, @type)');
    for (const v of videos) insVideo.run(v);

    const insDealer = db.prepare('INSERT INTO dealers (name, slug, brand, city, state, address, phone, email, rating) VALUES (@name, @slug, @brand, @city, @state, @address, @phone, @email, @rating)');
    for (const d of dealers) insDealer.run(d);
  });

  tx();
  console.log('Seed complete.');
  const counts = {
    brands: db.prepare('SELECT COUNT(*) c FROM brands').get().c,
    tractors: db.prepare('SELECT COUNT(*) c FROM tractors').get().c,
    implements: db.prepare('SELECT COUNT(*) c FROM implements').get().c,
    used_listings: db.prepare('SELECT COUNT(*) c FROM used_listings').get().c,
    news: db.prepare('SELECT COUNT(*) c FROM news').get().c,
    videos: db.prepare('SELECT COUNT(*) c FROM videos').get().c,
    dealers: db.prepare('SELECT COUNT(*) c FROM dealers').get().c
  };
  console.log(counts);
};

seed();
