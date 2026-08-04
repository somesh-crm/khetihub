import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'khetihub.db');

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      country TEXT DEFAULT 'India',
      logo TEXT,
      color TEXT DEFAULT '#0f6b00',
      description TEXT DEFAULT '',
      is_mini INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tractors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      price INTEGER NOT NULL,
      hp INTEGER NOT NULL,
      cylinders INTEGER DEFAULT 0,
      lift_capacity TEXT DEFAULT 'NA',
      engine TEXT DEFAULT 'NA',
      fuel TEXT DEFAULT 'Diesel',
      drive TEXT DEFAULT '2WD',
      power_takeoff TEXT DEFAULT 'NA',
      transmission TEXT DEFAULT 'NA',
      fuel_tank TEXT DEFAULT 'NA',
      tyres TEXT DEFAULT 'NA',
      weight TEXT DEFAULT 'NA',
      warranty TEXT DEFAULT 'NA',
      category TEXT DEFAULT 'Full Range',
      is_mini INTEGER DEFAULT 0,
      is_latest INTEGER DEFAULT 0,
      is_popular INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      features TEXT DEFAULT '[]',
      image TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS implements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      price INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS used_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT DEFAULT '',
      model TEXT DEFAULT '',
      title TEXT DEFAULT '',
      price INTEGER NOT NULL,
      year INTEGER NOT NULL,
      hours INTEGER DEFAULT 0,
      location TEXT NOT NULL,
      state TEXT DEFAULT '',
      owner TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      status TEXT DEFAULT 'For Sell',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sell_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      brand TEXT DEFAULT '',
      model TEXT DEFAULT '',
      year INTEGER DEFAULT 0,
      expected_price INTEGER DEFAULT 0,
      location TEXT DEFAULT '',
      state TEXT DEFAULT '',
      hours INTEGER DEFAULT 0,
      condition TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'New',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT DEFAULT '',
      body TEXT DEFAULT '',
      date TEXT DEFAULT (date('now')),
      image TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      youtube_id TEXT DEFAULT '',
      thumbnail TEXT DEFAULT '',
      views INTEGER DEFAULT 0,
      duration TEXT DEFAULT '0:00',
      type TEXT DEFAULT 'Video',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dealers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      brand TEXT DEFAULT '',
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      rating REAL DEFAULT 4.0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT DEFAULT '',
      page TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_tractors_brand ON tractors(brand_id);
    CREATE INDEX IF NOT EXISTS idx_tractors_hp ON tractors(hp);
    CREATE INDEX IF NOT EXISTS idx_tractors_fuel ON tractors(fuel);
    CREATE INDEX IF NOT EXISTS idx_tractors_price ON tractors(price);
  `);
}
