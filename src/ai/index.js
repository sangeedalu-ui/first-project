import { DealAnalyzer, createAnalyzer } from './analyzer.js';

export { DealAnalyzer, createAnalyzer };

export function analyzeProduct(product, preferences) {
  const analyzer = createAnalyzer();
  return analyzer.analyzeDeal(product, preferences);
}

export function analyzeTrend(product, historicalData) {
  const analyzer = createAnalyzer();
  return analyzer.analyzeTrend(product, historicalData);
}

export function generateSummary(products) {
  const analyzer = createAnalyzer();
  return analyzer.generateDealSummary(products);
}
