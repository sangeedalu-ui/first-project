import { MyntraCollector } from './myntra.js';
import { MeeshoCollector } from './meesho.js';
import { AmazonCollector } from './amazon.js';
import { getWatchlist, getProducts, saveProducts } from '../storage/index.js';

const collectors = {
  Myntra: new MyntraCollector(),
  Meesho: new MeeshoCollector(),
  Amazon: new AmazonCollector()
};

export async function collectAllProducts() {
  const watchlist = getWatchlist();
  const existingProducts = getProducts();
  const existingMap = new Map(existingProducts.map(p => [p.id, p]));
  
  const allProducts = [];

  for (const item of watchlist.products) {
    const collector = collectors[item.platform];
    if (!collector) {
      console.log(`No collector for platform: ${item.platform}`);
      continue;
    }

    try {
      const product = await collector.fetchProduct(item.url);
      if (product) {
        const normalized = collector.normalizeProduct(product);
        const existing = existingMap.get(normalized.id);
        
        if (existing) {
          normalized.previousPrice = existing.price;
          normalized.priceHistory = existing.priceHistory || [];
          normalized.priceHistory.push({
            price: existing.price,
            timestamp: existing.lastChecked
          });
        }
        
        allProducts.push(normalized);
      }
    } catch (error) {
      console.error(`Error collecting ${item.platform} product:`, error.message);
    }
  }

  saveProducts(allProducts);
  return allProducts;
}

export async function importManualProducts(products) {
  const existing = getProducts();
  const merged = [...existing];
  
  for (const product of products) {
    const index = merged.findIndex(p => p.id === product.id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...product, lastChecked: new Date().toISOString() };
    } else {
      merged.push({ ...product, lastChecked: new Date().toISOString() });
    }
  }
  
  saveProducts(merged);
  return merged;
}

export function getCollectors() {
  return Object.keys(collectors);
}
