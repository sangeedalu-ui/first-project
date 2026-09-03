export class DealAnalyzer {
  constructor() {
    this.model = 'big-pickle';
  }

  analyzeDeal(product, preferences) {
    const analysis = {
      score: 0,
      factors: [],
      explanation: '',
      recommendation: ''
    };

    if (product.discount >= 50) {
      analysis.score += 30;
      analysis.factors.push('Excellent discount');
    } else if (product.discount >= 40) {
      analysis.score += 25;
      analysis.factors.push('Good discount');
    } else if (product.discount >= 30) {
      analysis.score += 20;
      analysis.factors.push('Decent discount');
    }

    if (product.price <= preferences.budget.max * 0.5) {
      analysis.score += 25;
      analysis.factors.push('Well within budget');
    } else if (product.price <= preferences.budget.max) {
      analysis.score += 15;
      analysis.factors.push('Within budget');
    }

    if (product.sizes && preferences.sizes) {
      const hasPreferred = preferences.sizes.some(s => product.sizes.includes(s));
      if (hasPreferred) {
        analysis.score += 20;
        analysis.factors.push('Preferred size available');
      }
    }

    if (product.fabric && preferences.fabrics) {
      const fabricMatch = preferences.fabrics.some(f => 
        product.fabric.toLowerCase().includes(f.toLowerCase())
      );
      if (fabricMatch) {
        analysis.score += 10;
        analysis.factors.push('Preferred fabric');
      }
    }

    if (analysis.score >= 70) {
      analysis.recommendation = 'Highly recommended - great deal!';
    } else if (analysis.score >= 50) {
      analysis.recommendation = 'Good deal worth considering';
    } else if (analysis.score >= 30) {
      analysis.recommendation = 'Average deal - could wait for better';
    } else {
      analysis.recommendation = 'Not recommended at current price';
    }

    analysis.explanation = `${product.name} gets ${analysis.factors.join(', ')}. Score: ${analysis.score}/100.`;

    return analysis;
  }

  analyzeTrend(product, historicalData) {
    if (!historicalData || historicalData.length < 2) {
      return { trend: 'insufficient_data', message: 'Not enough history to determine trend' };
    }

    const prices = historicalData.map(d => d.price);
    const recentPrices = prices.slice(-5);
    
    const isDecreasing = recentPrices.every((p, i) => i === 0 || p <= recentPrices[i-1]);
    const isIncreasing = recentPrices.every((p, i) => i === 0 || p >= recentPrices[i-1]);
    
    const avgRecent = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const avgOld = prices.slice(0, -5).reduce((a, b) => a + b, 0) / Math.max(prices.slice(0, -5).length, 1);
    
    if (isDecreasing && avgRecent < avgOld * 0.9) {
      return { trend: 'decreasing', message: 'Price is trending downward - good time to buy' };
    } else if (isIncreasing && avgRecent > avgOld * 1.1) {
      return { trend: 'increasing', message: 'Price is trending upward - consider buying soon' };
    } else {
      return { trend: 'stable', message: 'Price is relatively stable' };
    }
  }

  generateDealSummary(products) {
    if (!products.length) return 'No products to analyze';

    const greatDeals = products.filter(p => p.dealStatus === 'great');
    const goodDeals = products.filter(p => p.dealStatus === 'good');
    
    let summary = `Found ${products.length} products. `;
    
    if (greatDeals.length) {
      summary += `${greatDeals.length} great deals including ${greatDeals[0].name} at ${greatDeals[0].discount}% off. `;
    }
    
    if (goodDeals.length) {
      summary += `${goodDeals.length} good deals available. `;
    }

    return summary;
  }
}

export function createAnalyzer() {
  return new DealAnalyzer();
}
