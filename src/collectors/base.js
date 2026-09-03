export class BaseCollector {
  constructor(platform) {
    this.platform = platform;
  }

  async fetchProduct(url) {
    throw new Error('fetchProduct must be implemented by subclass');
  }

  async fetchProducts(urls) {
    const results = [];
    for (const url of urls) {
      try {
        const product = await this.fetchProduct(url);
        if (product) results.push(product);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
      }
    }
    return results;
  }

  normalizeProduct(rawProduct) {
    throw new Error('normalizeProduct must be implemented by subclass');
  }
}
