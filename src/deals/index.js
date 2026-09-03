import { getMatchScore } from '../filters/index.js';

export function calculateDealScore(product, preferences) {
  const { score: matchScore, factors } = getMatchScore(product, preferences);
  
  let discountScore = 0;
  if (product.discount >= 60) discountScore = 30;
  else if (product.discount >= 50) discountScore = 25;
  else if (product.discount >= 40) discountScore = 20;
  else if (product.discount >= 30) discountScore = 15;

  let offerScore = 0;
  if (product.offers && product.offers.length > 0) {
    offerScore = Math.min(product.offers.length * 5, 15);
  }

  let priceChangeScore = 0;
  if (product.previousPrice && product.price) {
    const change = ((product.previousPrice - product.price) / product.previousPrice) * 100;
    if (change >= 20) priceChangeScore = 10;
    else if (change >= 10) priceChangeScore = 5;
  }

  const totalScore = matchScore + discountScore + offerScore + priceChangeScore;

  return {
    total: totalScore,
    match: matchScore,
    discount: discountScore,
    offer: offerScore,
    priceChange: priceChangeScore,
    factors
  };
}

export function getDealStatus(dealScore) {
  if (dealScore.total >= 80) return 'great';
  if (dealScore.total >= 60) return 'good';
  if (dealScore.total >= 40) return 'watch';
  return 'neutral';
}

export function getDealEmoji(status) {
  const emojis = {
    great: '🔥',
    good: '🟢',
    watch: '🟡',
    new: '🔵',
    unavailable: '⚪'
  };
  return emojis[status] || '⚪';
}

export function detectBetterDeal(currentProduct, previousProduct) {
  if (!previousProduct) return null;

  const alerts = [];

  if (currentProduct.price < previousProduct.price) {
    alerts.push({
      type: 'price_drop',
      message: `Price dropped from ₹${previousProduct.price} to ₹${currentProduct.price}`,
      previous: previousProduct.price,
      current: currentProduct.price
    });
  }

  if (currentProduct.discount > previousProduct.discount) {
    alerts.push({
      type: 'discount_increase',
      message: `Discount increased from ${previousProduct.discount}% to ${currentProduct.discount}%`,
      previous: previousProduct.discount,
      current: currentProduct.discount
    });
  }

  if (currentProduct.availableSizes && previousProduct.availableSizes) {
    const newSizes = currentProduct.availableSizes.filter(
      size => !previousProduct.availableSizes.includes(size)
    );
    if (newSizes.length > 0) {
      alerts.push({
        type: 'size_available',
        message: `New sizes available: ${newSizes.join(', ')}`,
        previous: previousProduct.availableSizes,
        current: currentProduct.availableSizes
      });
    }
  }

  return alerts.length > 0 ? alerts : null;
}

export function rankProducts(products, preferences) {
  return products
    .map(product => ({
      ...product,
      dealScore: calculateDealScore(product, preferences),
      dealStatus: getDealStatus(calculateDealScore(product, preferences))
    }))
    .sort((a, b) => b.dealScore.total - a.dealScore.total);
}
