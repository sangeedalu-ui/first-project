import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

export function loadJSON(filename) {
  const filepath = join(DATA_DIR, filename);
  if (!existsSync(filepath)) return null;
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

export function saveJSON(filename, data) {
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function getProducts() {
  return loadJSON('products.json') || [];
}

export function saveProducts(products) {
  saveJSON('products.json', products);
}

export function getAlerts() {
  return loadJSON('alerts.json') || [];
}

export function saveAlerts(alerts) {
  saveJSON('alerts.json', alerts);
}

export function getPreferences() {
  return loadJSON('preferences.json');
}

export function getWatchlist() {
  return loadJSON('watchlist.json') || { products: [] };
}

export function saveWatchlist(watchlist) {
  saveJSON('watchlist.json', watchlist);
}
