import { BaseCollector } from './base.js';

export class AmazonCollector extends BaseCollector {
  constructor() {
    super('Amazon');
  }

  async fetchProduct(url) {
    // Amazon does not provide a public API for product prices
    // This adapter supports manual product import
    // or official Amazon Product Advertising API if available
    console.log(`Amazon: Would fetch product from ${url}`);
    return null;
  }

  normalizeProduct(rawProduct) {
    return {
      id: rawProduct.id || `amazon-${Date.now()}`,
      name: rawProduct.name,
      url: rawProduct.url,
      platform: 'Amazon',
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
