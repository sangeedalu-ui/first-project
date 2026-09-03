import { BaseCollector } from './base.js';

export class MeeshoCollector extends BaseCollector {
  constructor() {
    super('Meesho');
  }

  async fetchProduct(url) {
    // Meesho does not provide a public API
    // This adapter supports manual product import
    console.log(`Meesho: Would fetch product from ${url}`);
    return null;
  }

  normalizeProduct(rawProduct) {
    return {
      id: rawProduct.id || `meesho-${Date.now()}`,
      name: rawProduct.name,
      url: rawProduct.url,
      platform: 'Meesho',
      category: rawProduct.category,
      price: rawProduct.price,
      previousPrice: rawProduct.originalPrice,
      discount: rawProduct.discount,
      sizes: rawProduct.sizes || [],
      fabric: rawProduct.fabric,
      offers: rawProduct.offers || [],
      image: rawProduct.image || null,
      lastChecked: new Date().toISOString()
    };
  }
}
